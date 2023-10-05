const Book=require('../model/bookModel');

exports.shop=async(req,res)=> {
    try {
        const books = await Book.find();
    
        res.render('shopbooks', { books });
      } catch (error) {
        res.status(500).json({ error: 'Error fetching books' });
      }
}

exports.getbookDetails= async(req,res)=> {
    const bookId = req.params.bookId;

    try {
      const book = await Book.findById(bookId);
  
      if (!book) {
        return res.status(404).json({ error: 'Book not found' });
      }
      res.render('book', { book });
    } catch (error) {
      res.status(500).json({ error: 'Error fetching book details' });
    }
}

exports.createBookpage =async(req,res)=> {
    res.render('createbook'); 
}

exports.createBook= async(req,res)=> {
    const { title, author, price, description, image } = req.body;

    try {
      const newBook = new Book({
        title,
        author,
        price,
        description,
        image,
        reviews: [], 
    });

    await newBook.save();

    res.redirect('/shop');
  } catch (error) {
    res.status(500).json({ error: 'Error creating book' });
  }
}

exports.editpage = async(req,res)=> {
    const bookId = req.params.bookId;

  try {
    const book = await Book.findById(bookId);

    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }
    res.render('editbook', { book });
} catch (error) {
  res.status(500).json({ error: 'Error fetching book details for editing' });
}
}

exports.edit=async(req,res)=> {
    const bookId = req.params.bookId;
  const { title, author, price, description, image } = req.body;

  try {
    const updatedBook = await Book.findByIdAndUpdate(
      bookId,
      {
        title,
        author,
        price,
        description,
        image,
      },
      { new: true } 
    );

    if (!updatedBook) {
      return res.status(404).json({ error: 'Book not found' });
    }

    res.redirect(`/shop/${bookId}`);
  } catch (error) {
    res.status(500).json({ error: 'Error updating book' });
  }
}

exports.deleteBook=async(req,res)=> {

    try {
        const bookId = req.params.bookId;
        console.log(bookId)
        const deletedBook = await Book.findByIdAndRemove(bookId);

        if (!deletedBook) {
            return res.status(404).json({ message: 'Book not found' });
        }

        res.json({ message: 'Book deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
}

exports.submitReview = async (req, res) => {
  const { bookId, rating, comment } = req.body;

  try {
    const book = await Book.findById(bookId);

    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }

    const newReview = {
      rating: Number(rating),
      comment,
    };
    book.reviews.push(newReview);

    await book.save();

    res.redirect(`/shop/${bookId}`);
  } catch (error) {
    res.status(500).json({ error: 'Error submitting review' });
  }
};

exports.searchBooks = async (req, res) => {
  try {
    const { query } = req.query;

    const queryObject = {};

    if (query) {
      queryObject.$or = [
        { title: { $regex: query, $options: 'i' } }, 
        { author: { $regex: query, $options: 'i' } }, 
      ];
    }

    const results = await Book.find(queryObject);

    res.render('search-results', { results });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};
