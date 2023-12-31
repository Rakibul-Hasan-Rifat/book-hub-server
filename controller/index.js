import { ObjectId } from "mongodb";
import client from "../mongodb.js";
import jwt from "jsonwebtoken";
import { configDotenv } from "dotenv";

configDotenv({ path: '../.env' })

const home = (req, res) => {
  res.send('The server is running!!!')
}

const bookTypesWithImage = async (req, res) => {

  const data = await client
    .db('BookDB')
    .collection('BooksCollection')
    .aggregate([
      {
        $group: {
          _id: "$category",
          imgUrl: { $first: "$img_url" },
        }
      }
    ])
    .toArray();

  res.send(data)
}

const allBooks = async (req, res) => {
  console.log('queries', req.query)
  res.send(
    await client
      .db('BookDB')
      .collection('BooksCollection')
      .find({})
      .toArray()
  )
};

const booksOfSameType = async (req, res) => {

  const data = await client
    .db('BookDB')
    .collection('BooksCollection')
    .find(
      { category: { $regex: req.params.type, $options: 'i' } })
    .toArray();

  res.send(data)
}

const bookDetails = async (req, res) => {
  console.log(req.params.id)

  res.send(await client
    .db('BookDB')
    .collection('BooksCollection')
    .findOne({ _id: new ObjectId(req.params.id) }))
}

const availableBooks = async (req, res) => {
  res.send(await client
    .db('BookDB')
    .collection('BooksCollection')
    .find({ quantity: { $gte: 1 } })
    .toArray()
  )
}

const borrowedBooks = async (req, res) => {
  res.send(await client
    .db('BookDB')
    .collection('BorrowedBooks')
    .find({ 'user.email': req.query?.email })
    .toArray()
  )
}

const addBook = async (req, res) => {
  res.send(await client
    .db('BookDB')
    .collection('BooksCollection')
    .insertOne(req.body)
  )
}

const updateBook = async (req, res) => {
  console.log('increment', req.body)
  res.send(await client
    .db('BookDB')
    .collection('BooksCollection')
    .updateOne({ _id: new ObjectId(req.params.id) }, { $set: req.body })
  )
}

const borrowingBook = async (req, res) => {

  const isBorrowed = await client
    .db('BookDB')
    .collection('BorrowedBooks')
    .findOne({ 'book._id': req.body?.book?._id, 'user.email': req.body?.user?.email })

  if (isBorrowed?.book?._id === req.body?.book?._id) {
    return res.send({ message: 'You already borrowed the book!!😒' })
  }

  return res.send(await client
    .db('BookDB')
    .collection('BorrowedBooks')
    .insertOne(req.body)
  )
}

const deleteBorrowedBook = async (req, res) => {
  res.send(await client
    .db('BookDB')
    .collection('BorrowedBooks')
    .deleteOne({_id: new ObjectId(req.params.id)})
  )
}

const tokenMaker = async (req, res) => {
  const token = jwt.sign(req.body, process.env.JWT_SECRET_KEY, {})
  console.log(req.body, token)
  console.log('cookie', req.cookies)
  res
    .cookie('token', token, { secure: false, httpOnly: true })
    .send({ success: true })
}

export {
  home,
  addBook,
  allBooks,
  updateBook,
  tokenMaker,
  bookDetails,
  borrowingBook,
  borrowedBooks,
  availableBooks,
  booksOfSameType,
  bookTypesWithImage,
  deleteBorrowedBook,
}