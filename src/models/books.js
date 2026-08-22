import {model, Schema} from "mongoose";

const bookSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  author: {
    type: String,
    required: true,
    trim: true,
  },
  genre: {
    type: String,
    required: true,
    trim: true,
  },
  copies: {
    type: Number,
    required: true,
  },
},
  {
  timestamps: true, // автоматично додає createdAt і updatedAt.
  versionKey: false, // вимикає службове поле __v.
});

export const Book = model("Book", bookSchema);
