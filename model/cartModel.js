const mongoose = require('mongoose');


const cartSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Assuming you have a 'User' model
    bookId: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true }, // Assuming you have a 'Book' model
    quantity: { type: Number, required: true },
});

module.exports = mongoose.model('Cart', cartSchema);
