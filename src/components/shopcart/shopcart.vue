<template>
  <div class="shopcart" ref="shopcartBox">
    <transition name="show">
      <div class="mask" v-show="listShow" @click="hideList()"></div>
    </transition>
    <transition name="list-fade">
      <div class="shopcart-list" v-show="listShow">
        <div class="list-header">
          <h1 class="title">购物车</h1>
          <span class="empty" @click="empty()">清空</span>
        </div>
        <div class="list-content" ref="listConent">
          <ul>
            <li class="list-item clearfix" v-for="(listItem, index) in selectFoods" :key="index">
              <span class="name">{{listItem.name}}</span>
              <div class="cartcontrol-wrap">
                <v-cart-control :foodsItem="listItem"></v-cart-control>
              </div>
              <span class="price">￥{{listItem.price*listItem.count}}</span>
            </li>
          </ul>
        </div>
      </div>
    </transition>
    <div class="content">
      <div class="content-left" @click="toggleList">
        <div class="logo-wrap" :class="{highlight: totalCount>0}">
          <div class="logo">
            <i class="icon-shopping_cart"></i>
          </div>
          <div class="count" v-show="totalCount>0">
            <span>{{totalCount}}</span>
          </div>
        </div>
        <div class="price" :class="{highlight: totalPrice>0}">
          <span>￥{{totalPrice}}</span>
        </div>
        <div class="desc">
          <span>另需配送费￥{{deliveryPrice}}</span>
        </div>
      </div>
      <div class="content-right" @click="pay()" :class="{'enough':totalPrice>=minPrice,'not-enough':totalPrice<minPrice}">
        <p class="text">{{payDesc}}</p>
      </div>
    </div>
    <div class="ball-wrap">
      <div v-for="(ball, index) in balls" :key="index">
        <transition name="drop" @before-enter="beforeDrop" @enter="dropping" @after-enter="afterDrop">
          <div class="ball" v-show="ball.show">
            <div class="inner inner-hook"></div>
          </div>
        </transition>
      </div>
    </div>

  </div>
</template>

<script>
import BScroll from 'better-scroll';
import Vue from 'vue';
import comCartControl from '../../components/cartcontrol/cartcontrol';

export default {
  props: {
    deliveryPrice: {
      type: Number,
      default: 0
    },
    minPrice: {
      type: Number,
      default: 0
    },
    selectFoods: {
      type: Array,
      default() {
        return [
          {
            name: '默认的selectFoods数据',
            price: 0,
            count: 0
          }
        ];
      }
    }
  },
  data() {
    return {
      balls: [
        { show: false },
        { show: false },
        { show: false },
        { show: false },
        { show: false }
      ],
      dropBalls: [],
      listIsFold: true
    }
  },
  computed: {
    totalPrice() {
      let totalPrice = 0;
      this.selectFoods.forEach((item, index) => {
        totalPrice += item.price * item.count;
      });
      return totalPrice;
    },
    totalCount() {
      let totalCount = 0;
      this.selectFoods.forEach((item, index) => {
        totalCount += item.count;
      });
      return totalCount;
    },
    payDesc() {
      if (this.totalPrice === 0) {
        return `￥${this.minPrice}元起送`;
      } else if (this.totalPrice < this.minPrice) {
        return `还差￥${this.minPrice - this.totalPrice}元起送`;
      } else {
        return '去结算';
      }
    },
    listShow() {
      if (this.totalCount <= 0) {
        this.listIsFold = true;
        return false;
      }
      let show = !this.listIsFold;
      if (show) {
        this.$nextTick(() => {
          if (!this.scroll) {
            this.scroll = new BScroll(this.$refs.listConent, {
              click: true
            });
          } else {
            this.scroll.refresh();
          }
        });
      }
      return show;
    }
  },
  methods: {
    drop(el) {
      console.log('shopcart组件的drop方法已经执行，小球将下落', el);
      // 触发一次事件就会将所有小球进行遍历
      for (let i = 0; i < this.balls.length; i++) {
        let ball = this.balls[i];
        if (!ball.show) { //将false的小球放到dropBalls
          ball.show = true;
          ball.el = el; // 设置小球的el属性为一个dom对象
          this.dropBalls.push(ball);
          return;
        }
      }
    },

    /*
    * 下面三个函数利用Vue过渡的js钩子函数实现过渡动画 
    */
    beforeDrop(el) {
      let count = this.balls.length;
      while (count--) {
        let ball = this.balls[count];
        if (ball.show) {
          let rect = ball.el.getBoundingClientRect(); //获取小球的相对于视口的位移(小球高度)
          let x = rect.left - 32;
          let y = -(window.innerHeight - rect.top - 22); //负数,因为是从左上角往下的的方向
          el.style.display = '';
          el.style.webkitTransform = `translate3d(0,${y}px,0)`;
          el.style.transform = `translate3d(0,${y}px,0)`;
          let innerEle = el.getElementsByClassName('inner-hook')[0];
          innerEle.style.webkitTransform = `translate3d(${x}px,0,0)`;
          innerEle.style.transform = `translate3d(${x}px,0,0)`;
        }
      }
    },
    dropping(el, done) { /*重置小球数量  样式重置*/
      let rf = el.offsetHeight; //触发重绘html
      this.$nextTick(() => { //让动画效果异步执行,提高性能
        el.style.webkitTransform = 'translate3d(0,0,0)';
        el.style.transform = 'translate3d(0,0,0)';
        let innerEle = el.getElementsByClassName('inner-hook')[0];
        innerEle.style.transform = 'translate3d(0,0,0)';
        innerEle.style.webkitTransform = 'translate3d(0,0,0)';
        el.addEventListener('transitionend', done); //Vue为了知道过渡的完成，必须设置相应的事件监听器
      });
    },
    afterDrop(el) {
      let ball = this.dropBalls.shift(); //完成一次动画就删除一个dropBalls的小球
      if (ball) {
        ball.show = false;
        el.style.display = 'none';
      }
    },
    toggleList() {
      if (!this.totalCount) {
        return;
      }
      this.listIsFold = !this.listIsFold;
    },
    addFood(target) {
      console.log(target);
      this.drop(target);
    },
    empty() {
      this.selectFoods.forEach((item) => {
        // item.count = 0;
        Vue.delete(item, 'count');
      });
    },
    hideList() {
      this.listIsFold = true;
    },
    pay() {
      if (this.totalPrice < this.minPrice) return;
      window.alert(`支付${this.totalPrice}元`);
    }

  },
  components: {
    'v-cart-control': comCartControl
  },
  created() {

  }
}
</script>

<style lang="stylus">
@import '../../common/stylus/base.styl'
@import '../../common/stylus/mixin.styl'

.shopcart
  position fixed
  left 0
  right 0 
  bottom 0
  width 100%
  z-index 66
  .mask
    position fixed
    z-index 1
    left 0
    right 0
    top 0
    bottom 0
    // width 100%
    // height 100%
    background-color rgba(7,17,27,.6)
    -webkit-backdrop-filter blur(10px)
    // backdrop-filter blur(10px)
    &.show-enter, &.show-leave-to
      opacity 0
    &.show-leave-active, &.show-enter-active
      transition all .35s ease
    &.show-enter-to, &.show-leave 
      opacity 1
      
  .shopcart-list
    position relative
    z-index 2
    &.list-fade-enter, &.list-fade-leave-to
      transform translate3d(0,100%,0)
    &.list-fade-leave-active, &.list-fade-enter-active
      transition all .45s ease
    &.list-fade-enter-to, &.list-fade-leave 
      transform translate3d(0,0,0)
    .list-header
      padding 0 .18rem
      height .4rem
      background-color #f3f5f7
      display flex
      flex-flow row nowrap
      justify-content space-between
      align-items center
      border-bottom 1px solid rgba(7,17,27,0.1)
      .title
        font-size .14rem
        font-weight 200
        color $color7-17-27-1
        line-height .4rem
      .empty
        font-size .12rem
        color $color0-160-220-1 
        line-height .4rem
    .list-content
      max-height 2.17rem
      overflow hidden
      padding 0 .18rem
      background-color #fff
      .list-item
        height .48rem
        padding .12rem 0
        border-bottom 1px solid rgba(7,17,27,0.1)
        .name
          float left
          font-size .14rem
          font-weight 700
          color rgb(7,17,27)
          line-height .24rem
        .price
          float right
          margin-left .18rem
          color $color240-20-20-1
          font-size .14rem
          font-weight 700
          line-height .24rem
        .cartcontrol-wrap
          float right
          margin-left .12rem
  .content
    display flex
    flex-flow row nowrap
    justify-content flex-start
    align-items stretch
    position relative
    z-index 3
    background-color #141d27
    color rgba(255,255,255,.4)
    .content-right
      // height 100%
      display flex
      flex-flow column nowrap
      justify-content center
      align-items center
      flex 0 0 1.05rem
      max-width 1.20rem
      padding 0 .08rem
      &.not-enough
        background-color #2b333b
        color inherit
      &.enough 
        background-color #00b43c
        color #fff
      .text
        // height .48rem
        // line-height .48rem
        font-size .14rem
        font-weight 700
        text-align center
        white-space nowrap
    .content-left
      display flex
      flex-flow row nowrap
      justify-content flex-start
      align-items center
      flex-grow 1
      .logo-wrap
        position relative
        top -.1rem
        margin 0 .12rem
        padding .06rem
        width .56rem
        height .56rem
        border-radius 50%
        background-color #141d27;
        &.highlight
          .logo
            background-color $color0-160-220-1 
            .icon-shopping_cart
              color #fff
        .logo
          width 100%
          height 100%
          border-radius 50%
          text-align center
          background-color #2b343c
          .icon-shopping_cart
            font-size .24rem
            line-height .44rem
            color #80858a
        .count
          position absolute
          top 0
          right 0
          width .24rem
          height .16rem
          line-height .16rem
          font-size .09rem
          font-weight 700
          text-align center
          color #fff
          background-color $color240-20-20-1
          border-radius 10px
          box-shadow 0 4px 8px 0 rgba(0,0,0,.4);
      
      .price
        font-size .16rem
        font-weight 700
        line-height .24rem
        // align-self center
        margin-right .12rem
        &.highlight
          color #fff
      .desc
        font-size .1rem
        font-weight 700
        line-height .24rem
        padding-left .12rem
        border-left 1px solid rgba(255,255,255,.1)
  .ball-wrap
    .ball
      position fixed
      left 32px
      bottom 22px
      z-index 199
      transition all .6s cubic-bezier(0.49,-0.29,0.75,0.41)
      .inner
        width 16px
        height 16px
        border-radius 50%
        background-color $color0-160-220-1 
        transition all .6s linear
  

</style>

