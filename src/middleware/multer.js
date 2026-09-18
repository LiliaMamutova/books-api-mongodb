import multer from "multer";
import createHttpError from "http-errors";

const storage = multer.memoryStorage();
const limits = {
  fileSize: 5 * 1024 * 1024,
};

//fileFilter - визначає, які файли дозволено приймати
const fileFilter = (req, file, callback) => {
  if(!file.mimetype) {
    throw createHttpError(404, "File corrupted")
  }

  if(!file.mimetype.startsWith("image/") && !file.mimetype.startsWith("video/")) {
    return callback(createHttpError(404, "Allow file types: image and video"));
  }

  callback(null, true);
};

const upload = multer({
  storage,
  limits,
  fileFilter,
});

export default upload;
