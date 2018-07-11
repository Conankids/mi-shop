<template>
    <div>
        <NavSpread>
            <span>Goods</span>
        </NavSpread>
        <div class="accessory-result-page accessory-page">
            <div class="container">
                <div class="filter-nav">
                    <span class="sortby">Sort by:</span>
                    <a href="javascript:void(0)" class="default cur">Default</a>
                    <a href="javascript:void(0)" class="price" @click="sortPrice">Price
                        <svg class="icon icon-arrow-short" :class="{'sort-up':sortFlag}">
                            <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-arrow-short"></use>
                        </svg>
                    </a>
                    <a href="javascript:void(0)" class="filterby stopPop" @click="showPriceFilter">Filter by</a>
                </div>
                <div class="accessory-result">
                    <!-- filter -->
                    <div class="filter stopPop" id="filter" :class="{'filterby-show':isShowPriceFilter}">
                        <dl class="filter-price">
                            <dt>Price:</dt>
                            <dd><a href="javascript:void(0)" @click="choosePriceFilter('all')"
                                   :class="{'cur':curPrice=='all'}">All</a>
                            </dd>
                            <dd v-for="(price,index) in priceFilter">
                                <a href="javascript:void(0)"
                                   :class="{'cur':curPrice==index}"
                                   @click=choosePriceFilter(index)>{{price.startPrice}} - {{price.endPrice}}</a>
                            </dd>
                        </dl>
                    </div>

                    <!-- search result accessories list -->
                    <div class="accessory-list-wrap">
                        <div class="accessory-list col-4">
                            <ul>
                                <li v-for="(item,index) in goodsData">
                                    <div class="pic">
                                        <a href="#"><img v-lazy="`static/${item.productImage}`" :alt="item.productName"></a>
                                    </div>
                                    <div class="main">
                                        <div class="name">{{item.productName}}</div>
                                        <div class="price">{{item.salePrice | currency('￥')}}</div>
                                        <div class="btn-area">
                                            <a href="javascript:;" class="btn btn--m" @click="addCart(item.productId)">加入购物车</a>
                                        </div>
                                    </div>
                                </li>
                            </ul>
                            <div class="load-more"
                                 v-infinite-scroll="loadMore"
                                 infinite-scroll-disabled="busy"
                                 infinite-scroll-distance="50">
                                <img src="../assets/loading-spinning-bubbles.svg" v-show="loading">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="md-overlay" v-show="isShowLayer" @click="closeLayer"></div>
        <Model :isShow.sync="mdShow">
            <p slot="msg">请先登录,再添加到购物车</p>
            <div slot="btnGroup">
                <a href="javascript:;" class="btn btn--m" @click="mdShow = false">关闭</a>
            </div>
        </Model>
        <Model :isShow.sync="mdShowCart">
            <p slot="msg">
                <svg class="icon icon-status-ok">
                    <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-status-ok"></use>
                </svg>
                <span>添加成功</span>
            </p>
            <div slot="btnGroup">
                <a href="javascript:;" class="btn btn--m" @click="mdShowCart = false">继续购物</a>
                <router-link to="cart" class="btn btn--m">前往购物车</router-link>
            </div>
        </Model>
    </div>
</template>

<script>
    import '@/assets/css/product.css'
    import NavSpread from '@/components/NavSpread'
    import Model from '@/components/model'

    export default {
        data() {
            return {
                goodsData: [],
                curPrice: 'all',
                isShowPriceFilter: false,
                isShowLayer: false,
                page: 1,
                pageSize: 8,
                sortFlag: true,
                busy: true,
                loading: false,
                mdShow: false,
                mdShowCart: false,
                priceFilter: [
                    {
                        startPrice: '0.00',
                        endPrice: '100.00'
                    },
                    {
                        startPrice: '100.00',
                        endPrice: '500.00'
                    },
                    {
                        startPrice: '500.00',
                        endPrice: '1000.00'
                    },
                    {
                        startPrice: '1000.00',
                        endPrice: '5000.00'
                    }
                ]
            }
        },
        created() {
            this.getGoodsList()
        },
        methods: {
            getGoodsList(flag) {
                const params = {
                    page: this.page,
                    pageSize: this.pageSize,
                    sort: this.sortFlag ? 1 : -1,
                    priceLevel: this.curPrice
                }
                this.loading = true
                this.$http.get('/goods/list', {
                    params: params
                }).then(res => {
                    this.loading = false
                    if (res.data.status == 0) {
                        if (flag) {
                            this.goodsData = this.goodsData.concat(res.data.result.list)
                        } else {
                            this.goodsData = res.data.result.list
                        }
                        this.busy = false
                        if (res.data.result.count < 8) {
                            this.busy = true
                        }
                    } else {
                        this.goodsData = []
                    }
                })
            },
            showPriceFilter() {
                this.isShowPriceFilter = true
                this.isShowLayer = true
            },
            choosePriceFilter(index) {
                this.curPrice = index
                this.page = 1
                this.getGoodsList()
                this.closeLayer()
            },
            closeLayer() {
                this.isShowPriceFilter = false
                this.isShowLayer = false
            },
            sortPrice() {
                this.sortFlag = !this.sortFlag
                this.page = 1
                this.getGoodsList()
            },
            loadMore() {
                this.busy = true
                setTimeout(() => {
                    this.page++
                    this.getGoodsList(true)
                }, 100)
            },
            addCart(productId) {
                this.$http.post('/goods/addCart', {
                    productId: productId
                }).then(response => {
                    const res = response.data
                    if (res.status == 0) {
                        this.mdShowCart = true
                        this.$store.commit('updateCartNum', 1)
                    } else {
                        this.mdShow = true
                    }
                })
            }
        },
        components: {
            NavSpread,
            Model
        }
    }
</script>

<style>
    .load-more {
        line-height: 100px;
        text-align: center;
    }

    .icon-arrow-short {
        transition: all .3s;
    }

    .sort-up {
        transform: rotate(180deg);
        transition: all .3s;
    }
</style>