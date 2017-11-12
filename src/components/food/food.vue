<template>
  <transition name="move">
    <div class="food-item-detail" v-show="showFlag" ref="foodItemBox">
      <div class="food-content">
        <div class="image-header">
          <img :src="foodItemData.image" alt="食品展览大图">
          <i class="back icon-arrow_lift" @click="hide()"></i>
        </div>
        <div class="main">
          <h1 class="title the-title">{{foodItemData.name}}</h1>
          <p class="detail">
            <span class="sell-count">月售{{foodItemData.sellCount}}份</span>
            <span class="rating-rate">好评率{{foodItemData.rating}}%</span>
          </p>
          <p class="price">
            <span class="now">￥{{foodItemData.price}}</span>
            <span class="old" v-show="foodItemData.oldPrice">￥{{foodItemData.oldPrice}}</span>
          </p>
          <div class="cartcontrol-wrap">
            <v-cart-control :foodsItem="foodItemData" @add="addFood"></v-cart-control>
          </div>
          <transition name="fade">
            <div class="buy-button" @click.stop.prevent="addFirst" v-show="!foodItemData.count || foodItemData.count===0">
              加入购物车
            </div>
          </transition>
        </div>
        <div class="split-wrap" v-show="foodItemData.info">
          <v-split></v-split>
        </div>
        <div class="info" v-show="foodItemData.info">
          <h1 class="title block-title">商品信息</h1>
          <p class="text">{{foodItemData.info}}</p>
        </div>
        <div class="split-wrap">
          <v-split></v-split>
        </div>
        <div class="rating">
          <h1 class="title block-title">商品评价</h1>
          <div class="rating-select-wrap">
            <v-rating-select :descCont="desc" :selectType="selectType" 
            :onlyContent="onlyContent" :ratings="foodItemData.ratings"
             @select="selectRating" @toggle="toggleContent"></v-rating-select>
          </div>
          <div class="rating-cont-wrap">
            <ul class="cont-list" v-show="foodItemData.ratings && foodItemData.ratings.length">
              <li class="rating-cont-item border-bottom-1px" v-show="needShow(item.rateType,item.text)"
              v-for="(item, index) in foodItemData.ratings" :key="index">
                <div class="item-user">
                  <span class="user-name">{{item.username}}</span>
                  <img class="avatar" width="12" height="12" :src="item.avatar"></img>
                </div>
                <div class="item-time">{{item.rateTime | formatDate}}</div>
                <p class="item-text">
                  <i :class="{'icon-thumb_up':item.rateType===0, 'icon-thumb_down':item.rateType!==0}"></i>
                  <span class="text-cont">{{item.text}}</span>
                </p>
              </li>
            </ul>
            <div class="no-rating" v-show="!foodItemData.ratings || !foodItemData.ratings.length">暂无评价</div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import comSplit from '../split/split.vue';
import BScroll from 'better-scroll';
import Vue from 'vue';
import comCartControl from '../../components/cartcontrol/cartcontrol';
import comShopcart from '../../components/shopcart/shopcart';
import comRatingSelect from '../../components/ratingselect/ratingselect';
import { formatDate } from '../../common/js/date.js'

const ALL = 2;

export default {
  name: 'comFood',
  data() {
    return {
      showFlag: false,
      desc: {
        all: '全部',
        positive: '推荐',
        negative: '吐槽'
      },
      selectType: ALL,
      onlyContent: true
    }
  },
  props: {
    foodItemData: {
      type: Object
    }
  },
  components: {
    'v-split': comSplit,
    'v-cart-control': comCartControl,
    'v-rating-select': comRatingSelect
  },
  methods: {
    show() {
      this.showFlag = true;
      this.selectType = ALL;
      this.onlyContent = true;
      this.$nextTick(() => {
        if (!this.foodItemScroll) {
          this.foodItemScroll = new BScroll(this.$refs.foodItemBox, {
            click: true
          });
        } else {
          this.foodItemScroll.refresh();
        }
      });
    },
    hide() {
      this.showFlag = false;
    },
    addFirst(event) {
      if (!event._constructed) {
        return;
      }
      this.$emit('add', event.target);
      Vue.set(this.foodItemData, 'count', 1);

    },
    addFood(target) {
      this.$emit('add', target);
    },
    needShow(type, text) {
      if (this.onlyContent && !text) {
        return false;
      }
      if (this.selectType === ALL) {
        return true;
      } else {
        return type === this.selectType;
      }
    },
    selectRating(type) {
      this.selectType = type;
      this.$nextTick(() => {
        this.foodItemScroll.refresh();
      });
    },
    toggleContent() {
      this.onlyContent = !this.onlyContent;
      this.$nextTick(() => {
        this.foodItemScroll.refresh();
      });
    }
  },
  filters: {
    formatDate(value) {
      return formatDate(value);
    }
  },
  created() {
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import '../../common/stylus/mixin.styl'

.food-item-detail
  display block
  width 100%
  position fixed
  top 0
  left 0
  right 0
  bottom $shopcart-height
  z-index 33
  background-color #fff
  &.move-enter, &.move-leave-to
    transform translate3d(100%,0,0)
  &.move-enter-active, &.move-leave-active
    transition all 0.2s linear
  &.move-enter-to, &.move-leave
    transform translate3d(0,0,0)
  .food-content
    .block-title
      color $color7-17-27-1
      font-size .14rem
      line-height .14rem
      margin-bottom .06rem
    .image-header
      display block
      position relative
      width 100%
      // 下面两句使图片加载时不抖动，而且使图片盒子是一个宽高相同的盒子
      padding-top 100%
      height 0
      img 
        display block
        position absolute
        top 0
        left 0
        width 100%
        height 100%
      .back
        display block
        padding .1rem
        position absolute
        top .1rem
        left 0
        font-size .2rem
        color #fff
    .main
      position relative
      padding .18rem
      background-color #fff
      .title
        font-weight 700
        margin-bottom .08rem
      .detail
        display block
        font-size 0
        color $color147-153-159-1
        line-height .1rem
        margin-bottom .18rem
        .sell-count, .rating-rate
          display inline-block
          font-size .1rem
          margin-right .12rem
          line-height inherit 
          vertical-align top 
      .price
        display block
        font-size 0
        font-weight 700
        line-height .24rem
        .now, .old
          display inline-block
          vertical-align top
          line-height inherit 
        .now
          margin-right .08rem
          font-size .14rem
          color $color240-20-20-1
        .old
          font-size .1rem
          text-decoration line-through
          color $color147-153-159-1
      .cartcontrol-wrap
        position absolute
        right .12rem
        bottom .12rem
      .buy-button
        position absolute
        right .18rem
        bottom .18rem
        z-index 10
        height .24rem
        line-height .24rem
        padding 0 .12rem
        border-radius .12rem
        background-color $color0-160-220-1
        color #ffffff
        opacity 1
        font-size .1rem
        overflow hidden
        &.fade-enter, &.fade-leave-to
          opacity 0
          z-index -1
        &.fade-enter-active, &.fade-leave-active
          transition all 0.2s linear
        &.fade-enter-to, &.fade-leave
          opacity 1
  .info
    padding .18rem
    background-color #ffffff
    .text
      line-height .24rem
      font-weight 200
      padding 0 .08rem
      color $color77-85-93-1
  .rating
    padding-top .18rem
    .title
      margin-left .18rem
    .rating-cont-wrap
      .cont-list
        padding-left .18rem
        padding-right .18rem
        .rating-cont-item
          position relative
          padding .16rem 0
          border-bottom-1px($color7-17-27-0_1)
          .item-user
            display block
            position absolute
            top .16rem
            right 0
            color $color147-153-159-1
            font-size 0
            line-height .12rem
            .user-name, .avatar
              display inline-block
              vertical-align top
              line-height inherit 
            .user-name
              font-size .1rem
              margin-right .06rem
            .avatar
              width .12rem
              height .12rem
              border-radius 50%
          .item-time
            font-size .1rem
            color $color147-153-159-1
            line-height .12rem
            margin-bottom .06rem
          .item-text
            line-height .16rem
            color $color7-17-27-1
            .icon-thumb_up
              color $color0-160-220-1
            .icon-thumb_down
              color $color147-153-159-1
            [class^="icon-thumb"], .text-cont
              display inline-block
              vertical-align top
              line-height inherit 
            .icon-thumb
              font-size .12rem
            .text-cont
              font-size .12rem
              color $color7-17-27-1


</style>
