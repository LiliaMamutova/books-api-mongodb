import {model, Schema} from "mongoose";
import {GENRE} from "../../constants/genres.js";


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
    enum: GENRE,
  },
  copies: {
    type: Number,
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  }
},
  {
  timestamps: true, // автоматично додає createdAt і updatedAt.
  versionKey: false, // вимикає службове поле __v.
});

bookSchema.index({ genre: 1, copies: 1 });

export const Book = model("Book", bookSchema);
