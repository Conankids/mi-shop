// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
import vueLazyload from 'vue-lazyload'
import infiniteScroll from 'vue-infinite-scroll'
import {currency} from "./utils/currency"
import Vuex from 'vuex'

Vue.config.productionTip = false

Vue.prototype.$http = axios

Vue.use(vueLazyload, {
    loading: '/static/loading/loading-bars.svg'
})
Vue.use(infiniteScroll)
Vue.filter('currency', currency)

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        cartNum: 0
    },
    mutations: {
        updateCartNum(state, cartNum) {
            state.cartNum += cartNum
        }
    }
})

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    store,
    components: {App},
    template: '<App/>'
})
