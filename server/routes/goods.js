const express = require('express')
const mongoose = require('mongoose')
const goods = require('../models/goods')
const users = require('../models/users')

const router = express.Router()

mongoose.connect('mongodb://140.143.234.88:27017/db_demo')

mongoose.connection.on('connected', () => {
    console.log('MongoDb connected successful!')
})

mongoose.connection.on('err', () => {
    console.log('MongoDb connected fail!')
})

mongoose.connection.on('disconnected', () => {
    console.log('MongoDb disconnected!')
})

//获取产品列表
router.get('/list', (req, res, next) => {
    const page = parseInt(req.param('page')) //获取页码参数
    const pageSize = parseInt(req.param('pageSize')) //获取一页有多少条数据参数
    const sort = req.param('sort') //获取排序参数
    const priceLevel = req.param('priceLevel') //获取价格区间
    const skip = (page - 1) * pageSize //计算跳过多少条
    let params = {} //查询参数
    let startPrice = '', endPrice = ''

    if (priceLevel != 'all') {
        switch (priceLevel) {
            case '0':
                startPrice = 0
                endPrice = 100
                break
            case '1':
                startPrice = 100
                endPrice = 500
                break
            case '2':
                startPrice = 500
                endPrice = 1000
                break
            case '3':
                startPrice = 1000
                endPrice = 5000
                break
        }
        params = {
            salePrice: {
                $gt: startPrice,
                $lt: endPrice
            }
        }
    }

    const goodsModel = goods.find(params).skip(skip).limit(pageSize) //查询后跳过多少条限制一页多少条，返回计算后的模型
    goodsModel.sort({'salePrice': sort}) //对模型进行排序
    goodsModel.exec((err, doc) => {
        if (err) {
            res.json({
                status: -1,
                msg: err.message
            })
        } else {
            res.json({
                status: 0,
                msg: '',
                result: {
                    count: doc.length,
                    list: doc
                }
            })
        }
    })
})

//加入购物车
router.post('/addCart', (req, res, next) => {
    const userId = req.cookies.userId
    const productId = req.body.productId
    let userProductId = ''

    //查询user表
    users.findOne({userId: userId}, (err1, userDoc) => {
        if (err1) {
            res.json({
                status: -1,
                msg: err.message
            })
        } else {
            if (userDoc) {
                //遍历user表的购物车列表是否已有此商品
                userDoc.cartList.forEach(item => {
                    if (item.productId == productId) {
                        userProductId = productId
                        item.productNum++
                    }
                })
                if (userProductId) {
                    //已添加的商品只增加数量
                    userDoc.save((err2, doc2) => {
                        if (err2) {
                            res.json({
                                status: -1,
                                msg: err2.message
                            })
                        } else {
                            res.json({
                                status: 0,
                                msg: '操作成功',
                                result: ''
                            })
                        }
                    })
                } else {
                    //未添加的查询goods表信息
                    goods.findOne({productId: productId}, (err3, goodsDoc) => {
                        if (err3) {
                            res.json({
                                status: -1,
                                msg: err3.message
                            })
                        } else {
                            if (goodsDoc) {
                                //查出来的信息赋值给user表的cartList
                                goodsDoc.productNum = 1
                                goodsDoc.checked = 1
                                userDoc.cartList.push(goodsDoc)
                                userDoc.save((err4, doc4) => {
                                    if (err4) {
                                        res.json({
                                            status: -1,
                                            msg: err2.message
                                        })
                                    } else {
                                        res.json({
                                            status: 0,
                                            msg: '操作成功',
                                            result: ''
                                        })
                                    }
                                })
                            }
                        }
                    })
                }
            }
        }
    })
})

module.exports = router
