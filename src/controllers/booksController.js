import {Book} from "../models/books.js";
import createHttpError from "http-errors";


export const getAllBooks = async (req, res) => {
  const books = await Book.find()
  res.status(200).json(books);
};


export const getBookById = async (req, res) => {
  const { bookId } = req.params;
  const book = await Book.findById(bookId);

  if(!book) {
    throw createHttpError(404, `Book with id ${bookId} not found`);
  }

  res.status(200).json(book);
};

export const createBook = async (req, res) => {
  const book = await Book.create(req.body);

  res.status(200).json(book);
};

export const updateBook = async (req, res) => {
  const { bookId } = req.params;
  const book = await Book.findByIdAndUpdate(
    bookId,
    req.body,
    {returnDocument: "after"}
  );

  if(!book) {
    throw createHttpError(404, `Book with id ${bookId} not found`);
  }

  res.status(200).json(book);
}

export const deleteBook = async (req, res) => {
  const { bookId } = req.params;
    const book = await Book.findByIdAndDelete(bookId);

    if(!book) {
      throw createHttpError(404, `Book with id ${bookId} not found`);
    }

    res.status(200).json(book);
}
