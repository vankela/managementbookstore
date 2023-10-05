const express=require('express');
const router=express.Router();
const bookController=require('../controller/bookController');
const auth=require('../middleware/auth');


router.get('/',bookController.shop);
router.get('/create',auth,bookController.createBookpage);
router.post('/create',auth,bookController.createBook);
router.get('/search',bookController.searchBooks);
router.get('/:bookId',bookController.getbookDetails);
router.get('/edit/:bookId',auth, bookController.editpage);
router.post('/edit/:bookId',auth,bookController.edit);
router.post('/delete/:bookId',auth,bookController.deleteBook);
router.post('/submit-review',auth, bookController.submitReview);

module.exports=router;