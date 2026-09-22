import createHttpError from "http-errors";
import Session from "../db/models/session.js";
import User from "../db/models/user.js";


const authenticate = async (req, res, next) => {
  const {sessionId, accessToken} = req.cookies;
  if (!sessionId || !accessToken) {
    throw createHttpError(401, "Missing access token");
  }

  const session = await Session.findOne({_id: sessionId, accessToken});
  if (!session) {
    throw createHttpError(401, "Session not found");
  }

  const isAccessTokenExpired = session.accessTokenValidUntil < new Date();
  if (isAccessTokenExpired) {
    throw createHttpError(401, "Session not found");
  }

  const user = await User.findById(session.userId);

  if (!user) {
    throw createHttpError(401, `User: ${user} not found`);
  }

  req.user = user;
  next();
}

export default authenticate;
