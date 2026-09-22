import User from "../db/models/user.js";
import createHttpError from "http-errors";
import {saveFileToCloudinary} from "../utils/cloudinary.js";

export const updateUserAvatar = async (req, res) => {
  const {file, user} = req;

  if (!req.file) {
    throw createHttpError(400, "No file");
  }

  const result = await saveFileToCloudinary(file.buffer, user._id);

  const updateUser = await User.findOneAndUpdate(
    {_id: user._id},
    {attach: result.secure_url},
    {returnDocument: "after"},
  );

  res.status(200).json({url: updateUser.attach});
}
