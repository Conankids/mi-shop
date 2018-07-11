const mongoose = require('mongoose')

const Schema = mongoose.Schema

//定义MongoDB中集合Collection里文档document的结构　　
const productSchema = new Schema({
    'productId': String,
    'productName': String,
    'salePrice': Number,
    'productImage': String,
    'productNum': Number,
    'checked': Number
})

//通过Model可以实例化出文档对象document
module.exports = mongoose.model('good', productSchema)