const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: String,
});

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  price: { type: Number, required: true },
  description: String,
  image: String,
  reviews: [reviewSchema], // Array of reviews
});

module.exports = mongoose.model('Book', bookSchema);
