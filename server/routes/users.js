var express = require('express');
var router = express.Router();
var mongoose = require('mongoose')
var user = require('../models/users')

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});

//登录
router.post('/login', (req, res, next) => {
    const params = {
        userName: req.body.userName,
        userPwd: req.body.userPwd
    }
    user.findOne(params, (err, doc) => {
        if (err) {
            res.json({
                status: -1,
                msg: err.message
            })
        } else {
            if (doc) {
                res.cookie('userId', doc.userId, {
                    path: '/',
                    maxAge: 1000 * 60 * 60 * 24
                })
                res.cookie('userName', doc.userName, {
                    path: '/',
                    maxAge: 1000 * 60 * 60 * 24
                })
                res.json({
                    status: 0,
                    msg: '',
                    result: {
                        userId: doc.userId,
                        userName: doc.userName
                    }
                })
            } else {
                res.json({
                    status: -2,
                    msg: '该用户未注册',
                    result: ''
                })
            }
        }
    })
});

//登出
router.post('/logout', (req, res, next) => {
    //清除登录cookie
    res.cookie('userId', '', {
        path: '/',
        maxAge: -1
    })
    res.cookie('userName', '', {
        path: '/',
        maxAge: -1
    })

    res.json({
        status: 0,
        msg: '操作成功',
        result: ''
    })
})

//是否登录
router.get('/checkLogin', (req, res, next) => {
    if (req.cookies.userId) {
        res.json({
            status: 0,
            msg: '操作成功',
            result: req.cookies.userName || ''
        })
    }
})

//获取购物车数据
router.get('/cart', (req, res, next) => {
    const userId = req.cookies.userId
    user.findOne({userId: userId}, (err, doc) => {
        if (err) {
            res.json({
                status: -1,
                msg: err.message
            })
        } else {
            if (doc) {
                res.json({
                    status: 0,
                    msg: '',
                    result: doc.cartList
                })
            }
        }
    })
})

//删除购物车商品
router.post('/cartDel', (req, res, next) => {
    const userId = req.cookies.userId
    const productId = req.body.productId
    user.update({
            userId: userId
        },
        {
            $pull: {
                cartList: {
                    productId: productId
                }
            }
        }, (err, doc) => {
            if (err) {
                res.json({
                    status: -1,
                    msg: err.message
                })
            } else {
                if (doc) {
                    res.json({
                        status: 0,
                        msg: '删除成功',
                        result: ''
                    })
                }
            }
        })
})

//修改购物车商品
router.post('/cartEdit', (req, res, next) => {
    const userId = req.cookies.userId,
        productId = req.body.productId,
        productNum = req.body.productNum,
        checked = req.body.checked
    user.update({
        userId: userId,
        'cartList.productId': productId
    }, {
        'cartList.$.productNum': productNum,
        'cartList.$.checked': checked
    }, (err, doc) => {
        if (err) {
            res.json({
                status: -1,
                msg: err.message
            })
        } else {
            if (doc) {
                res.json({
                    status: 0,
                    msg: '操作成功',
                    result: ''
                })
            }
        }
    })
})

//全选
router.post('/cartCheckAll', (req, res, next) => {
    const userId = req.cookies.userId,
        checkedAll = req.body.checkedAll ? '1' : '0'
    console.log(userId)
    user.findOne({userId: userId}, (err1, doc1) => {
        if (err1) {
            res.json({
                status: -1,
                msg: err1.message
            })
        } else {
            if (doc1) {
                doc1.cartList.forEach(item => {
                    item.checked = checkedAll
                })
                doc1.save((err2, doc2) => {
                    if (err2) {
                        res.json({
                            status: -1,
                            msg: err2.message
                        })
                    } else {
                        if (doc2) {
                            res.json({
                                status: 0,
                                msg: '操作成功',
                                result: ''
                            })
                        }
                    }
                })
            }
        }
    })
})

//获取地址列表
router.get('/address', (req, res, next) => {
    const userId = req.cookies.userId
    user.findOne({userId, userId}, (err, doc) => {
        if (err) {
            res.json({
                status: -1,
                msg: err.message
            })
        } else {
            if (doc) {
                res.json({
                    status: 0,
                    msg: '',
                    result: doc.addressList
                })
            }
        }
    })
})

//设置默认地址
router.post('/setDefault', (req, res, next) => {
    const userId = req.cookies.userId,
        addressId = req.body.addressId
    if (!addressId) {
        res.json({
            status: -2,
            msg: 'addressId is null',
            result: ''
        })
    } else {
        user.findOne({userId: userId}, (err1, doc1) => {
            if (err1) {
                res.json({
                    status: -1,
                    msg: err1.message,
                    result: ''
                })
            } else {
                if (doc1) {
                    doc1.addressList.forEach(item => {
                        if (item.addressId == addressId) {
                            item.isDefault = true
                        } else {
                            item.isDefault = false
                        }
                    })
                    doc1.save((err2, doc2) => {
                        if (err2) {
                            res.json({
                                status: -1,
                                msg: err2.message,
                                result: ''
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
})

//删除地址
router.post('/delAddress', (req, res, next) => {
    const userId = req.cookies.userId
    const addressId = req.body.addressId
    user.update({
            userId: userId
        },
        {
            $pull: {
                addressList: {
                    addressId: addressId
                }
            }
        }, (err, doc) => {
            if (err) {
                res.json({
                    status: -1,
                    msg: err.message
                })
            } else {
                if (doc) {
                    res.json({
                        status: 0,
                        msg: '删除成功',
                        result: ''
                    })
                }
            }
        })
})

//生成订单
router.post('/payment', (req, res, next) => {
    const userId = req.cookies.userId,
        addressId = req.body.addressId,
        orderTotal = req.body.orderTotal
    user.findOne({userId: userId}, (err1, doc1) => {
        if (err1) {
            res.json({
                status: -1,
                msg: err1.message,
                result: ''
            })
        } else {
            if (doc1) {
                let address = {}, goodsList = []
                //获取收货地址信息
                doc1.addressList.forEach(item => {
                    if (item.addressId == addressId) {
                        address = item
                    }
                })
                //获取商品信息
                doc1.cartList.forEach(item => {
                    if (item.checked) {
                        goodsList.push(item)
                    }
                })
                const platForm = '622'
                const r1 = Math.floor(Math.random() * 10)
                const r2 = Math.floor(Math.random() * 10)
                const createDate = new Date().Format('yyyy-MM-dd hh:mm:ss')
                const createDateStr = new Date().Format('yyyyMMddhhmmss')
                const orderId = platForm + r1 + createDateStr + r2
                let order = {
                    orderId: orderId,
                    orderTotal: orderTotal,
                    addressInfo: address,
                    goodsList: goodsList,
                    orderStatus: '1',
                    createDate: createDate
                }
                doc1.orderList.push(order)
                doc1.save((err2, doc2) => {
                    if (err2) {
                        res.json({
                            status: -1,
                            msg: err1.message,
                            result: ''
                        })
                    } else {
                        if (doc2) {
                            res.json({
                                status: 0,
                                msg: '',
                                result: {
                                    orderId: orderId,
                                    orderTotal: orderTotal
                                }
                            })
                        }
                    }
                })
            }
        }
    })
})

//根据订单id查询购物信息
router.get('/getOrderInfo', (req, res, next) => {
    const userId = req.cookies.userId,
        orderId = req.param('orderId')
    user.findOne({userId: userId}, (err, doc) => {
        if (err) {
            res.json({
                status: -1,
                msg: err.messgae,
                result: ''
            })
        } else {
            if (doc) {
                let orderInfo = null
                doc.orderList.forEach(item => {
                    if (item.orderId == orderId) {
                        orderInfo = {
                            orderId: orderId,
                            orderTotal: item.orderTotal
                        }
                    }
                })
                if (orderInfo) {
                    res.json({
                        status: 0,
                        msg: '',
                        result: orderInfo
                    })
                } else {
                    res.json({
                        status: -2,
                        msg: '无订单信息',
                        result: ''
                    })
                }
            }
        }
    })
})

//获取购物车中商品数量
router.get('/cartNum', (req, res, next) => {
    const userId = req.cookies.userId
    user.findOne({userId: userId}, (err, doc) => {
        if (err) {
            res.json({
                status: -1,
                msg: err.message,
                result: ''
            })
        } else {
            if (doc) {
                let num = 0
                doc.cartList.forEach(item => {
                    num += parseInt(item.productNum)
                })
                res.json({
                    status: 0,
                    msg: '',
                    result: num
                })
            }
        }
    })
})

module.exports = router;
