import { Router } from "express";
import { verifyToken } from "../middleware/index.js";
import {
    home,
    logout,
    addBook,
    allBooks,
    tokenMaker,
    updateBook,
    bookDetails,
    borrowingBook,
    borrowedBooks,
    availableBooks,
    booksOfSameType,
    bookTypesWithImage,
    deleteBorrowedBook,
} from "../controller/index.js";

const router = Router()

router.get('/', home)

router.get('/bookTypes', bookTypesWithImage)

router.get('/books', verifyToken, allBooks);

router.get('/books/availableBooks', availableBooks)

router.get('/books/borrowedBooks', borrowedBooks)

router.get('/books/:type', booksOfSameType)

router.get('/books/:id/details', bookDetails)

router.patch('/books/:id/update', verifyToken, updateBook)

router.post('/borrows', borrowingBook)

router.patch('/returnBook', updateBook)

router.post('/addBook', verifyToken, addBook)

router.delete('/unBorrow/:id', deleteBorrowedBook)

router.post('/jwt', tokenMaker)

router.post('/logout', logout)

export default router;