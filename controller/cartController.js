const Cart = require('../model/cartModel');


exports.viewCart = async (req, res) => {
    try {
        const userId = req.user._id; 
        //console.log(userId)
        const cartItems = await Cart.find({ userId }).populate('bookId'); // Assuming 'bookId' is a reference to the book model

        //console.log('cartItems:', cartItems);
        res.render('cart', { cartItems });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.addToCart = async (req, res) => {
  console.log('Entering addToCart function');
  try {
      const { bookId } = req.params;
      console.log(bookId)
      const userId = req.user._id;
      //console.log(bookId+" "+userId)

      const existingCartItem = await Cart.findOne({ userId, bookId });

      if (existingCartItem) {
          existingCartItem.quantity++;
          await existingCartItem.save();
      } else {
          const newCartItem = new Cart({
              userId : req.user._id,
              bookId,
              quantity: 1,
          });
          await newCartItem.save();
      }

      if (req.session.pendingBookId) {
          delete req.session.pendingBookId;
      }

      res.redirect('/cart');
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
  }
};


exports.updateCartItem = async (req, res) => {
  const itemId = req.params.itemId;
  const action = req.body.action; 

  try {
    const cartItem = await Cart.findById(itemId);

    if (!cartItem) {
        console.error(`Item with ID ${itemId} not found`);
        return res.status(404).send('Item not found');
      }

    if (action === 'increment') {
      cartItem.quantity++;
    } else if (action === 'decrement') {
      if (cartItem.quantity > 1) {
        cartItem.quantity--;
      } else {
        await Cart.findByIdAndRemove(itemId);
        return res.redirect('/cart'); 
      }
    }

    await cartItem.save();

    res.redirect('/cart');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }              
};

exports.removeFromCart = async (req, res) => {
  const itemId = req.params.itemId;

  try {
    await Cart.findByIdAndRemove(itemId);

    res.redirect('/cart');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};

