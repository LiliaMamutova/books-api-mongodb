import express from "express";
import "dotenv/config";
import cors from 'cors';
import {connectMongoDB} from "./db/connectMongoDB.js";
import {errorHandler} from "./middleware/errorHandler.js";
import {notFoundHandler} from "./middleware/notFoundHandler.js";
import {logger} from "./middleware/logger.js";
import booksRoutes from "./routes/booksRoutes.js";
import helmet from "helmet";


const PORT = Number(process.env.PORT) || 3000;

const app = express();

app.use(logger);
app.use(express.json());
app.use(cors());
app.use(helmet());

app.use(booksRoutes);


app.use(errorHandler);
app.use(notFoundHandler);


// connection to MongoDB
await connectMongoDB();

// Server start
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
