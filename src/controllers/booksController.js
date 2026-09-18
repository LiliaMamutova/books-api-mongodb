import createHttpError from "http-errors";
import {Book} from "../db/models/books.js";


export const getAllBooks = async (req, res) => {
  const {page = 1, perPage = 10, genre, minCopies, search, sortBy = "_id", sortOrder = "asc"} = req.query;
  const { _id: userId } = req.user;

  const skip = (page - 1) * perPage;

  // Створюємо базовий запит до колекції
  const bookQuery = Book.find();

  // Пошук по частині title
  if(userId) {
     bookQuery.where("userId").equals(userId);
  }

  if (search) {
    bookQuery.where({
      $or: [
        {title: {$regex: search, $options: "i"}},
        {author: {$regex: search, $options: "i"}},
      ],
    });
  }

  if (genre) {
    bookQuery.where("genre").equals(genre);
  }

  if (minCopies) {
    bookQuery.where("copies").gte(minCopies);
  }

  // Виконуємо одразу два запити паралельно
  const [books, totalBooks] = await Promise.all([
    bookQuery
      .clone()  // .clone() => потрібен у Mongoose, щоб один і той самий запит можна було виконати двічі (для підрахунку та для вибірки).
      .skip(skip)
      .limit(perPage)   // запит, що повертає книги
      // Додаємо сортування в ланцюжок методів квері
      .sort({[sortBy]: sortOrder}).populate("userId", "username"),
    bookQuery.countDocuments(),   // запит, що повертає їх кількість
  ]);


  // Обчислюємо загальну кількість «сторінок»
  const totalPages = Math.ceil(totalBooks / perPage);

  res.status(200).json({
    page,
    perPage,
    totalBooks,
    totalPages,
    books,
  });
};


export const getBookById = async (req, res) => {
  const {bookId} = req.params;
  const { _id: userId } = req.user;
  const singleBook = await Book.findOne({_id: bookId, userId});

  if (!singleBook) {
    throw createHttpError(404, `Book with id: ${bookId} not found`);
  }

  res.status(200).json(singleBook);
};

export const createBook = async (req, res) => {
  const { _id: userId } = req.user; // беремо userId з автентікейт і тепер кожен пост має автора
  const book = await Book.create({...req.body, userId});
  await book.populate("userId", "username");

  res.status(201).json(book);
};

export const deleteBook = async (req, res) => {
  const {bookId} = req.params;
  const { _id: userId } = req.user;
  const book = await Book.findOneAndDelete({_id: bookId, userId});

  if (!book) {
    throw createHttpError(404, `Book with id ${bookId} not found`);
  }

  res.status(200).json(book);
}

export const updateBook = async (req, res) => {
  const {bookId} = req.params;
  const { _id: userId } = req.user;
  const book = await Book.findOneAndUpdate(
    {_id: bookId, userId},
    req.body,
    {returnDocument: "after"}
  );

  if (!book) {
    throw createHttpError(404, `Book with id ${bookId} not found`);
  }

  res.status(200).json(book);
};

