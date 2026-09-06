import User from "../db/models/user.js";
import bcrypt from "bcrypt";
import createHttpError from "http-errors";
import Session from "../db/models/session.js";
import {createSession, setSessionCookie} from "../services/auth.js";


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
