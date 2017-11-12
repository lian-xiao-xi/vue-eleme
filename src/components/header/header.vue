<template>
  <div class="header" ref="headerBox">
    <div class="content-wrap">
      <div v-if="sellerData.avatar" class="avatar">
        <img :src="sellerData.avatar" alt="商家头像" width="64" height="auto">
      </div>
      <div v-if="sellerData.name" class="right-content">
        <h1 class="title">
          <span class="brand"></span>
          <span class="name">{{sellerData.name}}</span>
        </h1>
        <p v-if="sellerData.description" class="description">{{sellerData.description}} / {{sellerData.deliveryTime}}分钟送达</p>
        <p v-if="sellerData.supports" class="support">
          <span class="support-icon" :class="classMap[sellerData.supports[0].type]"></span>
          <span class="support-text">{{sellerData.supports[0].description}}</span>
        </p>
      </div>
      <div class="support-count" v-if="sellerData.supports" @click="showDetail">
        <span class="count">{{sellerData.supports.length}}个</span>
        <i class="icon-keyboard_arrow_right"></i>
      </div>
    </div>
    <div class="bulletin-wrap" @click="showDetail">
      <span class="bulletin-title"></span>
      <span class="bulletin-text">{{sellerData.bulletin}}</span>
      <i class="icon-keyboard_arrow_right"></i>
    </div>
    <div class="header-bg"></div>
    <transition name="fade">
      <div class="detail" v-show="detailShow">
        <div class="detail-wrap clearfix">
          <h1 class="title-name">{{sellerData.name}}</h1>
          <div class="star-wrap">
            <v-star :score="sellerData.score" :size="48"></v-star>
          </div>
          <section class="content-title">
            <hr class="line"></hr>
            <div class="text">优惠信息</div>
            <hr class="line"></hr>
          </section>
          <ul class="info-list" v-if="sellerData.supports">
            <li class="info-item" v-for="(item, index) in sellerData.supports" :key="index">
              <span class="info-icon" :class="classMap[item.type]"></span>
              <span class="info-text">{{item.description}}</span>
            </li>
          </ul>
          <section class="content-title">
            <hr class="line"></hr>
            <div class="text">商家公告</div>
            <hr class="line"></hr>
          </section>
          <p class="bulletin-text">{{sellerData.bulletin}}</p>
  
        </div>
        <div class="detail-close">
          <i class="icon-close" @click="showDetail"></i>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import comStar from '../star/star.vue';

export default {
  name: 'comHeader',
  data() {
    return {
      classMap: ['decrease', 'discount', 'special', 'invoice', 'guarantee'],
      detailShow: false
    }
  },
  methods: {
    showDetail() {
      this.detailShow = !this.detailShow;
    }
  },
  props: {
    sellerData: {
      type: Object
    }
  },
  components: {
    'v-star': comStar
  },
  beforeUpdate() {
    // console.log(sellerData.score);
    document.querySelector('.header .header-bg').style.backgroundImage = `url(${this.sellerData.avatar})`;
  },
  created() {
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus">
@import '../../common/stylus/mixin.styl'
.header 
  position relative
  color #fff
  background-color rgba(7,17,27,.5)
  overflow hidden
  .content-wrap 
    display flex
    position relative
    padding 0.24rem 0.12rem 0.18rem 0.24rem
    flex-direction row
    flex-wrap nowrap
    justify-content flex-start
    align-items flex-start
    color #fff
    .avatar 
      flex 0 0 .64rem
      width .64rem
      margin-right .16rem
      height auto
      overflow hidden
      &>img 
        display block
        border-radius 2px
    .right-content 
      .title
        display flex
        flex-direction row
        flex-wrap nowrap
        justify-content flex-start
        align-items flex-start
        margin 0.02rem 0 0.08rem 0rem
        .brand 
          width 0.3rem
          height 0.18rem
          bg-image('./img/brand')
          background-size 100% 100%
          background-repeat no-repeat
        .name
          font-size 0.16rem
          font-weight bold
          line-height 0.18rem
          margin-left 0.06rem
      .description
        font-size 0.12rem
        font-weight 200
        line-height .12rem
        margin-top .08rem
      .support
        display flex
        flex-direction row
        flex-wrap nowrap
        justify-content flex-start
        align-items flex-start
        margin-top .1rem
        font-size .1rem
        font-weight 200
        line-height .12rem
        .support-icon
          flex 0 0 .12rem
          width .12rem
          height .12rem
          margin-right .04rem
          background-size 100% 100%
          background-repeat no-repeat
          background-position center center
          &.discount
            bg-image('./img/discount_1')
          &.decrease
            bg-image('./img/decrease_1')
          &.guarantee
            bg-image('./img/guarantee_1')
          &.invoice
            bg-image('./img/invoice_1')
          &.special
            bg-image('./img/special_1')
    .support-count
      position absolute
      right .12rem
      bottom .14rem
      height .24rem
      line-height .24rem
      padding 0 .08rem
      font-size .1rem
      color inherit
      font-weight 200
      background-color rgba(0,0,0,.2)
      border-radius .07rem
      cursor pointer
      .count
        float left
        margin-right .02rem
        line-height inherit
      .icon-keyboard_arrow_right
        float left
        line-height inherit
        vertical-align middle
  .bulletin-wrap
    display flex
    flex-direction row
    flex-wrap nowrap
    justify-content flex-start
    align-items center
    height .28rem
    padding 0 .12rem
    line-height .28rem
    color #fff
    background-color rgba(7,17,27,.2)
    cursor pointer
    .bulletin-title
      flex 0 0 .22rem
      width .22rem
      height .12rem
      bg-image('./img/bulletin')
      background-repeat no-repeat
      background-size 100% 100%
    .bulletin-text
      display block
      font-size .1rem
      font-weight 200
      line-height inherit
      overflow hidden
      white-space nowrap
      text-overflow ellipsis
      margin 0 .04rem
    .icon-keyboard_arrow_right
      line-height inherit
      flex 0 0 auto
  .header-bg
    position absolute
    z-index -1
    top 0
    left 0
    // right 0
    // bottom 0
    width 100%
    height 100%
    filter blur(10px)
    background-size: 100% auto
    background-position 50% 35%
  .detail
    position fixed
    z-index 99
    top 0
    left 0
    width 100%
    height 100%
    overflow auto
    background-color rgba(7,17,27,.8)
    backdrop-filter blur(10px)
    &.fade-enter, &.fade-leave-to
      opacity 0
    &.fade-leave-active, &.fade-enter-active
      transition all .6s ease
    &.fade-enter-to, &.fade-leave 
      opacity 1
    .detail-wrap
      min-height 100%
      height auto
      padding-bottom .64rem
      margin 0 .36rem
      overflow hidden
      .title-name
        margin-top .64rem
        font-size .16rem
        font-weight 700
        color inherit
        line-height .16rem
        text-align center
        margin-bottom .16rem
        overflow hidden
        white-space nowrap
        text-overflow ellipsis
      .star-wrap
        display flex
        flex-flow column nowrap
        justify-content center
        align-items center
        height .24rem
        margin-bottom .28rem
      .content-title
        display flex
        width 100%
        margin-right auto
        margin-left auto
        margin-bottom .24rem
        flex-flow row nowrap
        justify-content space-between
        align-items center
        .line
          flex 1 1 2.24rem
          border 1px solid rgba(255,255,255, .2)
        .text
          flex 0 0 auto
          font-size .14rem
          font-weight 700
          color inherit
          line-height .14rem
          padding 0 .12rem
      .info-list
        padding 0 .12rem
        margin-bottom .28rem
        overflow hidden
        .info-item
          display flex
          flex-flow row nowrap
          justify-content flex-start
          align-items center
          margin-bottom .12rem
          font-size .12rem
          line-height .12rem
          font-weight 200
          color rgba(255,255,255,1)
          &:last-child
            margin-bottom 0
          .info-icon
            flex 0 0 .16rem
            margin-right .06rem
            width .16rem
            height .16rem
            background-size 100% 100%
            background-repeat no-repeat
            background-position center center
            &.discount
              bg-image('./img/discount_2')
            &.decrease
              bg-image('./img/decrease_2')
            &.guarantee
              bg-image('./img/guarantee_2')
            &.invoice
              bg-image('./img/invoice_2')
            &.special
              bg-image('./img/special_2')
          .info-text
            overflow hidden
            text-overflow ellipsis
            white-space nowrap
      .bulletin-text
        padding 0 .12rem
        font-size .12rem
        font-weight 200
        line-height .24rem
    .detail-close
      position relative
      height .64rem
      margin-top -0.64rem
      clear both
      text-align center
      // background-color blue
      font-size .32rem
      i.icon-close
        font-size .32rem
        color rgba(255,255,255,.5)
        cursor pointer
</style>
