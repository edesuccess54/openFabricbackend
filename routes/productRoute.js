const express = require('express');
const { addProduct, editProduct, deleteProduct, getProducts, getSingleProduct } = require('../controllers/productController');
const { upload } = require('../utils/fileUpload');
const auth = require('../middlewares/authUser');
const requireAuth = require('../middlewares/requireAuth'); 

const router = express.Router()

router.use(requireAuth)

router.get('/', getProducts);
router.get('/:id', getSingleProduct);
router.post('/create', upload.single('image'), addProduct);
router.put('/update/:id', upload.single('image'), editProduct);
router.delete('/delete/:id', deleteProduct);


module.exports = router