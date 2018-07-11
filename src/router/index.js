import Vue from 'vue'
import Router from 'vue-router'
import goodList from '@/views/goodslist'
import cart from '@/views/cart'
import address from '@/views/address'
import orderConfirm from '@/views/orderConfirm'
import orderSuccess from '@/views/orderSuccess'

Vue.use(Router)

export default new Router({
    routes: [
        {
            path: '/',
            name: 'GoodList',
            component: goodList
        },
        {
            path: '/cart',
            name: 'cart',
            component: cart
        },
        {
            path: '/address',
            name: 'address',
            component: address
        },
        {
            path: '/orderConfirm',
            name: 'orderConfirm',
            component: orderConfirm
        },
        {
            path:'/orderSuccess',
            name:'orderSuccess',
            component:orderSuccess
        }
    ]
})
