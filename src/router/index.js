import Vue from 'vue'
import Router from 'vue-router'
import VueResource from 'vue-resource'
import Goods from '../components/goods/goods.vue'
import Ratings from '../components/ratings/ratings.vue'
import Seller from '../components/seller/seller.vue'

Vue.use(Router)
Vue.use(VueResource)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/goods'
    },
    {
      path: '/goods',
      name: 'routesGoods',
      component: Goods
    },
    {
      path: '/ratings',
      name: 'routesRatings',
      component: Ratings
    },
    {
      path: '/seller',
      name: 'routesSeller',
      component: Seller
    }
  ]
})
