import Session from "../db/models/session.js";
import {randomUUID} from "node:crypto";
import {accessTokenLiveTime, refreshTokenLiveTime} from "../constants/time.js";

export const createSession = async (userId) => {
  return Session.create({
    userId,
    accessToken: randomUUID(),
    refreshToken: randomUUID(),
    accessTokenValidUntil: new Date(Date.now() + accessTokenLiveTime),
    refreshTokenValidUntil: new Date(Date.now() + refreshTokenLiveTime),
  });
};
// зберігати інф потрібно в httpOnly cooks - бекенд встановлює ці куки,
// і коли вони приходять на фронт - фронт іх не бачить, тобто браузер бачить, що це httpOnly куки і ховає їх від фронтенду
// звичайні куки можна прочитати, а httpOnly cooks - не можна

export const setSessionCookie = (res, session) => {
  res.cookie("sessionId", session._id, {
    httpOnly: true, // use for safesend for server
    secure: true,
    sameSite: "none",
    maxAge: refreshTokenLiveTime,
  });

  res.cookie("accessToken", session.accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: accessTokenLiveTime,
  });

  res.cookie("refreshToken", session.refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: refreshTokenLiveTime,
  });
};
