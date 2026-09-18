import User from "../db/models/user.js";
import bcrypt from "bcrypt";
import createHttpError from "http-errors";
import Session from "../db/models/session.js";
import {createSession, setSessionCookie} from "../services/auth.js";
import jwt from "jsonwebtoken";
import {resolve} from "node:path"
import fs from "node:fs/promises";
import {sendEmail} from "../utils/sendMail.js";
import Handlebars from "handlebars";

const {JWT_SECRET, FRONTEND_DOMAIN, SMTP_FROM} = process.env;

export const registerUser = async (req, res) => {
  const {email, password} = req.body;
  const existingUser = await User.findOne({email});
  if (existingUser) {
    throw createHttpError(409, `Email: ${email} in use`);
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await User.create({...req.body, password: hashedPassword}); // зберігаємо користувача та захешований пароль в базі

  const session = await createSession(newUser._id);
  setSessionCookie(res, session);

  res.status(201).json(newUser); // повертаємо зареєстрованого користувача з 201 статусом з тілом відповіді
};

export const loginUser = async (req, res) => {
  const {email, password} = req.body;

  const user = await User.findOne({email});
  if (!user) {
    throw createHttpError(401, "Invalid email or password");
  }

  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    throw createHttpError(401, "Invalid email or password");
  }

  // Це видаляє поперелню сесію, наприклаж, якщо сидиш з різних пристороях
  await Session.deleteOne({userId: user._id});

  // або створює, якщо жодної сесії немає
  const newSession = await createSession(user._id);
  setSessionCookie(res, newSession);

  res.status(200).json(user);
};

export const refreshUserSession = async (req, res) => {
  const {sessionId} = req.cookies; // беремо з кукі sessionId щоб дізнатись що сесія існує

  const session = await Session.findOne({_id: sessionId});

// якщо сесії немає, викидаємо помилку
  if (!session) {
    throw createHttpError(401, `Session: ${session} not found`);
  }

  // якщо сесія є, потрібно перевірити чи час життя refreshToken по цій сесії ще не завершився
  if (session.refreshTokenValidUntil < new Date()) {
    throw createHttpError(401, `Session: ${session} expired`);
  }

  await Session.deleteOne({_id: sessionId}); // провсяк видаляємо сесію

  const newSession = await createSession(session.userId);
  setSessionCookie(res, newSession); //записуємо в куки нову сесію

  res.status(200).json({message: "Session refreshed"});
};

export const logoutUser = async (req, res) => {
  const {sessionId} = req.cookies;

  const session = await Session.findOne({_id: sessionId});

  if (!session) {
    throw createHttpError(401, `Session: ${session} not found`);
  }

  await Session.deleteOne({_id: sessionId});

  res.clearCookie("sessionId");
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");

  res.status(204).send();
};

export const verifyUser = async (req, res) => {
  const {token} = req.query;
  try {
    const {email} = jwt.verify(token, JWT_SECRET);
    const user = await User.findOne({email});

    if (!user) {
      throw createHttpError(404, `User with email: ${email} not found`);
    }
    if (user.verify) {
      throw createHttpError(400, "User already verify")
    }

    user.verify = true;
    await user.save();
    res.status(200).json({message: "Email successfully verified"})

  } catch (error) {
    throw createHttpError(401, error.message)
  }

  res.status(200).json({});
};


export const requestResetEmail = async (req, res) => {
  const {email} = req.body;
  const user = await User.findOne({email});
  if (!user) {
    return res.status(200).json({
      message: "If this email exists, a reset link has been sent",
    })
  }

  const resetToken = jwt.sign(
    {sub: user._id, email},
    JWT_SECRET,
    {expiresIn: "15m"}
  );

  const templatePath = resolve("src", "templates", "reset-password-email.html");
  const templateSource = await fs.readFile(templatePath, "utf-8");
  const template = Handlebars.compile(templateSource);

  const html = template({
    name: user.username,
    link: `${FRONTEND_DOMAIN}/auth/reset-password?token=${resetToken}`
  });

  try {
    await sendEmail({
      from: SMTP_FROM,
      to: email,
      subject: "Reset your password",
      html,
    })
  } catch {
    throw createHttpError(500, "Failed to send the email, please try again later.");
  }

  res.status(200).json({message: 'Password reset email sent successfully'});
};


export const resetPassword = async (req, res) => {
  const { token, password } = req.body;

  let payload;
  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch {
    throw createHttpError(401, "Invalid or expired token");
  }
  // 2. Шукаємо користувача
  const user = await User.findOne({
    _id: payload.sub, email: payload.email,
  });

  if(!user){
    throw createHttpError(404, `User: ${payload.email} not found`);
  }
// 3. Якщо користувач існує
  // створюємо новий пароль і оновлюємо користувача

  const hashedPassword = await bcrypt.hash(password, 10);
  await User.updateOne(
    {_id: user._id},
    {password: hashedPassword});

  // 4. Інвалідовуємо всі можливі попередні сесії користувача
  await Session.deleteMany({ userId: user._id});

  // 5. Повертаємо успішну відповідь
  res.status(200).json({message: "Password reset successfully. Please log in again."});
};
//
// fileFilter - це функція, яку multer викликає для кожного завантаженого файлу. Вона отримує три аргументи:
//
// req - HTTP-запит, як у звичайному Express;
// file - інформація про файл (назва, MIME-тип, розмір тощо);
// cb - callback, який повідомляє multer, що робити з файлом.
