const Product = require('../models/ProductModel');

const createProduct = (newProduct) => {
    return new Promise(async (resolve, reject) => {
        const { name, image, type, price, description} = newProduct
        try {
            const CheckProduct = await Product.findOne({name})
            if(CheckProduct !== null) {
                resolve({
                    status: 'OK',
                    message: 'The name of product is alrealy'
                })
            }
            const createdProduct = await Product.create({
                name,
                image,
                type,
                price,
                description
            })
            if(createdProduct) {
                resolve({
                    status: 'OK',
                    message: 'SUCCESS',
                    data: createdProduct
                }) 
            }
        } catch (error) {
            reject(error)
        }
    })
}

const updateProduct = (id, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const CheckProduct = await Product.findOne({_id: id})
            if(CheckProduct === null) {
                resolve({
                    status: 'OK',
                    message: 'The product is not defined'
                })
            }
            const updatedProduct = await Product.findByIdAndUpdate(id, data, { new: true });
            resolve({
                status: 'OK',
                message: 'SUCCESS',
                data: updatedProduct
            }) 
        } catch (error) {
            reject(error)
        }
    })
}

const getDetailsProduct = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const product = await Product.findOne({_id: id})
            if(product === null) {
                resolve({
                    status: 'OK',
                    message: 'The product is not defined'
                })
            }
            resolve({
                status: 'OK',
                message: 'success',
                data: product
            }) 
        } catch (error) {
            reject(error)
        }
    })
}

const deleteProduct = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const CheckProduct = await Product.findOne({_id: id})
            if(CheckProduct === null) {
                resolve({
                    status: 'OK',
                    message: 'The product is not defined'
                })
            }
            await Product.findByIdAndDelete(id);
            resolve({
                status: 'OK',
                message: 'delete product is success',
            }) 
        } catch (error) {
            reject(error)
        }
    })
}

const getAllProduct = (limit = 2, page = 1, sort = null, filter = null) => {
    return new Promise(async (resolve, reject) => {
        try {
            const totalProduct = await Product.countDocuments();
            if(filter) {
                const allProductFilter = await Product.find({ [filter[0]]: { '$regex': filter[1] }}).limit(limit).skip(limit * (page - 1))
                resolve({
                    status: 'OK',
                    message: 'get all product is success',
                    data: allProductFilter,
                    total: totalProduct,
                    pageCurrent: page,
                    totalPage: Math.ceil(totalProduct / limit)
                }) 
            }
            if(sort) {
                const objectSort = {};
                objectSort[sort[1]] = sort[0]
                const allProductSort = await Product.find().limit(limit).skip(limit * (page - 1)).sort(objectSort)
                resolve({
                    status: 'OK',
                    message: 'get all product is success',
                    data: allProductSort,
                    total: totalProduct,
                    pageCurrent: page,
                    totalPage: Math.ceil(totalProduct / limit)
                }) 
            }
            const allProduct = await Product.find().limit(limit).skip(limit * (page - 1))
            resolve({
                status: 'OK',
                message: 'get all product is success',
                data: allProduct,
                total: totalProduct,
                pageCurrent: page,
                totalPage: Math.ceil(totalProduct / limit)
            }) 
        } catch (error) {
            reject(error)
        }
    })
}

module.exports = {
    createProduct,
    updateProduct,
    getDetailsProduct,
    deleteProduct,
    getAllProduct
}