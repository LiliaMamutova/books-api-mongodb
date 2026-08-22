import {Router} from "express";
import {createBook, deleteBook, getAllBooks, getBookById, updateBook} from "../controllers/booksController.js";


const booksRoutes = Router();

booksRoutes.get("/books", getAllBooks);
booksRoutes.get("/books/:bookId", getBookById);
booksRoutes.post("/books", createBook);
booksRoutes.patch("/books/:bookId", updateBook);
booksRoutes.delete("/books/:bookId", deleteBook);


export default booksRoutes;
