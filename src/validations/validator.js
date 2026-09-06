import {isValidObjectId} from "mongoose";


// Кастомний валідатор для ObjectId
export const objectIdValidator = (value, helpers) => {
  return isValidObjectId(value) ? value : helpers.message("Invalid id format");
};


