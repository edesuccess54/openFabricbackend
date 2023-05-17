const Product = require('../models/productModel');
const cloudinary = require('cloudinary').v2


const addProduct = async (req, res, next) => {
    const { name, price, discount, desc } = req.body

    try {
        if (!name || !price || !discount || !desc) {
            throw new Error('All fields are required');
        }

        let fileData = {}

        if (!req.file) {
            throw new Error('No file was selected');
        }

        const uploadedFile = await cloudinary.uploader.upload(req.file.path, { folder: "openFabric", resource_type: "image" })

        if (!uploadedFile) {
            throw new Error("image could not be uploaded")
        }

        fileData = {
            fileName: req.file.originalname,
            filePath: uploadedFile.secure_url,
            fileType: req.file.mimetype,
            fileSize: req.file.size,
        }

        const product = await Product.create({
            productName: name,
            productPrice: price,
            priceDiscount: discount,
            productDesc: desc,
            productImage: fileData
        })

        if (!product) { 
            throw new Error("Product could not be created")
        }

        res.status(201).json(product);
        
    } catch (error) {
        res.status(400).json({error: error.message})
    }
}

const editProduct = async (req, res, next) => {
    const { name, price, discount, desc } = req.body
    const productId = req.params.id

    try {
        const product = await Product.findById(productId)

        if (!product) { 
            throw new Error("Product could not be found")
        }

        let updatedImage;
        let fileData;

        if (req.file) {
            updatedImage = await cloudinary.uploader.upload(req.file.path, { folder: "openFabric", resource_type: "image" })

            if (!updatedImage) {
                throw new Error("image upload failed")
            }
            
             fileData = {
                fileName: req.file.originalname,
                filePath: updatedImage.secure_url,
                fileType: req.file.mimetype,
                fileSize: req.file.size,
            }
        }


        const { productName, productPrice, priceDiscount, productDesc, productImage } = product
        
        product.productName = name || productName;
        product.productPrice = price || productPrice;
        product.priceDiscount = discount || priceDiscount;
        product.productDesc = desc || productDesc;
        product.productImage = fileData || productImage

        const updatedProduct = await product.save()

        res.status(200).json(updatedProduct);
        
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

const getProducts = async (req, res, next) => {

    try {
        const products = await Product.find();

        if (!products) {
            res.status(404)
            throw new Error("Product could not be found");
        }

        res.status(200).json(products);
        
    } catch (error) {
        res.status(400).json({error: error.message})
    }
}

const getSingleProduct = async (req, res, next) => {
    const productId = req.params.id
   try {
        const product = await Product.findOne({_id: productId});

        if (!product) {
            throw new Error("Product could not be found");
        }

        res.status(200).json(product);
        
    } catch (error) {
        res.status(400).json({error: error.message})
    }
}

const deleteProduct = async (req, res, next) => {
    const productId = req.params.id
    console.log(productId)
   try {
       const product = await Product.findOne({ _id: productId });
       console.log(product)

        if (!product) {
            throw new Error("This product does not exist");
        }
       
       const deleteProduct = await Product.findByIdAndDelete(productId);

       if (!deleteProduct) {
            throw new Error("Product could not be deleted");
       }

       res.status(200).json({ success: true, message: "Product successfully deleted" });
        
    } catch (error) {
        res.status(400).json({error: error.message})
    }
}



module.exports = {
    addProduct,
    editProduct,
    getProducts,
    getSingleProduct,
    deleteProduct
}