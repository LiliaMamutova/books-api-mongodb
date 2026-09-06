import {Joi, Segments} from "celebrate";
import {GENRE} from "../constants/genres.js";
import {objectIdValidator} from "./validator.js";
import {bookSortFields} from "../constants/bookSort.js"

export const createBookSchema = {
  [Segments.BODY]: Joi.object({
    title: Joi.string().min(2).max(20).trim().required(),
    author: Joi.string().min(5).max(30).trim().required(),
    genre: Joi.string().valid(...GENRE).default(GENRE[0]),
    copies: Joi.number().integer().required(),
  }),
};



export const getAllBooksSchema = {
  [Segments.QUERY]: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    perPage: Joi.number().integer().min(5).max(20).default(10),
    genre: Joi.string().valid(...GENRE).insensitive(),
    minCopies: Joi.number().integer().positive(),
    search: Joi.string().trim().allow(""),
    sortBy: Joi.string().valid(...bookSortFields).trim(),
    sortOrder: Joi.string().valid("asc", "desc"),
  }),
};


export const bookIdSchema = {
  [Segments.PARAMS]: Joi.object({
    bookId: Joi.string().custom(objectIdValidator).required(),
  }),
};


export const updateBookSchema = {
  [Segments.PARAMS]: Joi.object({
    bookId: Joi.string().custom(objectIdValidator).required(),
  }),
  [Segments.BODY]: Joi.object({
    title: Joi.string().min(2).max(20).trim(),
    author: Joi.string().min(5).max(30).trim(),
    genre: Joi.string().valid(...GENRE),
    copies: Joi.number().integer(),
  }).min(1),
};

