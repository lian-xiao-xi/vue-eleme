<template>
  <div id="seller" class="seller" ref="seller">
    <div class="seller-content">
      <div class="overview">
        <h1 class="the-title seller-title">{{sellerData.name}}</h1>
        <div class="desc border-bottom-1px">
          <div class="star-wrap desc-inline">
            <v-star :score="sellerData.serviceScore" :size="36"></v-star>
          </div>
          <span class="text rating-count desc-inline">({{sellerData.ratingCount}})</span>
          <span class="text sell-count desc-inline">月售{{sellerData.sellCount}}单</span>
        </div>
        <ul class="remark">
          <li class="block border-right-1px">
            <h2 class="block-title">起送价</h2>
            <div class="content">
              <span class="stress">{{sellerData.minPrice}}</span>元</div>
          </li>
          <li class="block border-right-1px">
            <h2 class="block-title">商家配送</h2>
            <div class="content">
              <span class="stress">{{sellerData.deliveryPrice}}</span>元</div>
          </li>
          <li class="block border-right-1px">
            <h2 class="block-title">平均配送时间</h2>
            <div class="content">
              <span class="stress">{{sellerData.deliveryTime}}</span>分钟</div>
          </li>
        </ul>
        <div class="favorite" @click="toogleFavorite()">
          <span class="icon-favorite" :class="classObj"></span>
          <span class="text">{{favoriteText}}</span>
        </div>
      </div>
      <div class="split-wrap">
        <v-split></v-split>
      </div>
      <div class="bulletin">
        <h1 class="the-title bulletin-title">公告与活动</h1>
        <div class="content-wrap border-bottom-1px">
          <p class="text">{{sellerData.bulletin}}</p>
        </div>
        <ul class="info-list" v-if="sellerData.supports">
          <li class="info-item border-bottom-1px" v-for="(item, index) in sellerData.supports" :key="index">
            <span class="info-icon" :class="classMap[sellerData.supports[index].type]"></span>
            <span class="info-text">{{sellerData.supports[index].description}}</span>
          </li>
        </ul>
      </div>
      <div class="split-wrap">
        <v-split></v-split>
      </div>
      <div class="pics">
        <h1 class="the-title pics-title">商家实景</h1>
        <div class="pics-wrap" ref="picsWrap">
          <ul class="pics-list" ref="picsList">
            <li class="pics-item" v-for="(pic, index) in sellerData.pics" :key="index" ref="picsItem">
              <img :src="pic" alt="商家实景" width="120" height="90">
            </li>
          </ul>
        </div>
      </div>
      <div class="split-wrap">
        <v-split></v-split>
      </div>
      <div class="infos">
        <h1 class="the-title infos-title border-bottom-1px">商家信息</h1>
        <ul class="infos-list">
          <li class="infos-item border-bottom-1px" v-for="(info, index) in sellerData.infos" :key="index">
            {{info}}
          </li>
        </ul>
      </div>

    </div>
  </div>
</template>

<script>
import comStar from '../star/star.vue';
import comSplit from '../split/split.vue';
import BScroll from 'better-scroll';
import {saveTolocal,loadFromLocal} from '../../common/js/store.js'
const ERR_OK = 0;

export default {
  name: 'comSeller',
  data() {
    return {
      classMap: ['decrease', 'discount', 'special', 'invoice', 'guarantee'],
      classObj: {
        'active': loadFromLocal(this.sellerData.id, 'favorite', false)
      }
    }
  },
  computed: {
    favoriteText() {
      return this.classObj.active ? '已收藏' : '收藏';
    }
  },
  props: {
    sellerData: {
      type: Object
    }
  },
  components: {
    'v-star': comStar,
    'v-split': comSplit
  },
  watch: {
    sellerData: function () {
      console.log('已经观测到sellerData的变化');
      this._initScroll();
      this._initPics();
    }
  },
  mounted() {
    console.log('已经编译');
    this._initScroll();
    this._initPics();

  },
  methods: {
    _initScroll() {
      console.log('_initScroll方法开始运行', this.sellerData);
      this.$nextTick(() => {
        if (!this.sellerScroll) {
          console.log('sellerScroll实例不存在，第一次初始化sellerScroll');
          this.sellerScroll = new BScroll(this.$refs.seller, {
            click: true
          });
        } else {
          console.log('sellerScroll实例已存在');
          this.sellerScroll.refresh();
        }
      });
    },
    _initPics() {
      console.log('_initPics方法开始运行', this.sellerData);
      if (this.sellerData.pics) {
        // let width = 0;
        // let marginRig = 0;
        // let picWidth = 120;
        // let margin = 6;
        // let width = (picWidth + margin) * this.sellerData.pics.length - margin;
        // this.$refs.picsList.style.width = width + 'px';
        this.$nextTick(() => {
          let width = 0;
          let marginRig = 0;
          let picsItems = this.$refs.picsItem;
          picsItems.forEach((item, index) => {
            width += item.offsetWidth;
            marginRig += parseFloat(document.defaultView.getComputedStyle(item, null).marginRight);
          });
          console.log(width, marginRig);
          this.$refs.picsList.style.width = width + marginRig + 'px';

          if (!this.picsScroll) {
            console.log('picsScroll实例不存在，第一次初始化picsScroll');
            this.picsScroll = new BScroll(this.$refs.picsWrap, {
              scrollX: true,
              eventPassthrough: 'vertical'
            });
          } else {
            console.log('picsScroll实例已存在');
            this.picsScroll.refresh();
          }
        });
      }
    },
    toogleFavorite() {
      if(!event._constructed) {
        console.log('此时是pc端点击，不执行下面的操作');
        return;
      }
      this.classObj.active = !this.classObj.active;
      saveTolocal(this.sellerData.id, 'favorite', this.classObj.active);
      // localStorage.favorite = this.classObj.active;
    }
  }

}
</script>

<style lang="stylus">
@import '../../common/stylus/mixin.styl';
@import '../../common/stylus/base.styl';

.seller
  main-content-scroll()
  bottom 0
  .seller-content
    .the-title
      line-height .14rem
      color $color7-17-27-1
      font-size .14rem
    .overview
      position relative
      padding .18rem
      .seller-title
        margin-bottom .08rem
      .desc
        font-size 0
        color rgba(77,85,93,1)
        padding-bottom .18rem
        border-bottom-1px(rgba(7,17,27,0.1))
        .desc-inline
          display inline-block
          vertical-align top
          line-height .18rem
          font-size .1rem
        .star-wrap
          margin-right .08rem
        .text
          margin-right .12rem
          color inherit
      .remark
        padding-top .18rem
        display flex
        flex-flow row nowrap
        justify-content center
        align-items stretch
        .block
          flex 1
          text-align center
          border-right-1px(rgba(7,17,27,0.1))
          &:last-child
            border-none()
          .block-title
            color $color147-153-159-1
            font-size .1rem
            line-height .1rem
            margin-bottom .04rem
          .content
            color $color7-17-27-1
            font-size .1rem
            font-weight 200
            .stress
              display inline-block
              font-size .24rem
              line-height .24rem
              vertical-align bottom
      .favorite
        display block
        width 3em 
        // 如果不写上面这个样式，
        // 由于.favorite这个元素宽度由子元素.text的宽度决定，
        // 点击收藏之后.text元素字数出现变化，宽度就可能变化，心形图标可能会出现晃动

        position absolute
        top .18rem
        right .18rem
        text-align center
        .icon-favorite
          display block
          margin-bottom .04rem
          font-size .24rem
          line-height .24rem
          &.active
            color rgba(240,20,20,1)
        .text
          display block
          font-size .1rem
          color rgba(77,85,93,1)
          line-height .1rem
    .bulletin
      padding .18rem .18rem 0
      .bulletin-title
        margin-bottom .08rem
      .content-wrap
        font-size .12rem
        font-weight 200
        color rgba(240,20,20,1)
        line-height .24rem
        padding 0 .12rem .16rem
        border-bottom-1px(rgba(7,17,27,0.1))
      .info-list
        .info-item
          display flex
          flex-flow row nowrap
          justify-content flex-start
          align-items center
          padding .16rem .12rem
          font-size .12rem
          font-weight 200
          color $color7-17-27-1
          line-height .16rem
          border-bottom-1px(rgba(7,17,27,0.1))
          &:last-child
            border-none()
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
            white-space nowrap
            text-overflow ellipsis
    .pics
      padding .18rem 0 .18rem .18rem
      .pics-title
        margin-bottom .12rem
      .pics-wrap
        width 100%
        overflow hidden
        white-space nowrap
        .pics-list
          font-size 0
          .pics-item
            display inline-block
            margin-right .06rem
            width 1.2rem
            height .9rem
            overflow hidden
            &:last-child
              margin-right 0
            img
              display block
    .infos
      padding .18rem
      .infos-title
        padding-bottom .12rem
        border-bottom-1px(rgba(7,17,27,.1))
      .infos-list
        .infos-item
          border-bottom-1px(rgba(7,17,27,.1))
          font-size .12rem
          font-weight 200
          line-height .16rem
          color $color7-17-27-1
          padding .16rem .12rem


</style>
