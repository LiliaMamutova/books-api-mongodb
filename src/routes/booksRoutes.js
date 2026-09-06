import {Router} from "express";
import {createBook, deleteBook, getAllBooks, getBookById, updateBook} from "../controllers/booksController.js";
import {celebrate} from "celebrate";
import {bookIdSchema, createBookSchema, getAllBooksSchema, updateBookSchema} from "../validations/booksValidation.js";
import authenticate from "../middleware/authenticate.js";


const booksRoutes = Router();

booksRoutes.use(authenticate);

booksRoutes.get("/",
  celebrate(getAllBooksSchema,
    { abortEarly: false }),
  getAllBooks);

booksRoutes.get("/:bookId",
  celebrate(bookIdSchema,
    { abortEarly: false }),
  getBookById);

booksRoutes.post("/",
  celebrate(createBookSchema,
    { abortEarly: false }),
  createBook);

booksRoutes.patch("/:bookId",
  celebrate(updateBookSchema,
    { abortEarly: false }),
  updateBook);

booksRoutes.delete("/:bookId",
  celebrate(bookIdSchema,
    { abortEarly: false }),
  deleteBook);


export default booksRoutes;
