<template>
  <div id="goods" ref="goodsBox" class="goods main-content-scroll">
    <div class="menu" ref="menuBox">
      <ul class="menu-list">
        <li class="menu-item" v-for="(item, index) in goods" :key="index" :class="{current:currentIndex === index}" @click="selectMenu(index, $event)">
          <div class="menu-item-wrap border-bottom-1px">
            <span class="item-icon" v-if="item.type>=0" :class="classMap[item.type]"></span>
            <span class="item-text">{{item.name}}</span>
          </div>
        </li>
      </ul>
    </div>
    <div class="foods" ref="foodsBox">
      <ul class="foods-list">
        <li class="list-type-wrap list-type-hook" v-for="(item, index) in goods" :key="index">
          <h4 class="title border-left-1px">{{item.name}}</h4>
          <ul class="type-wrap">
            <li class="item-detail" v-for="(foodsItem, index) in item.foods" :key="index" @click="selectFoodItem(foodsItem, $event)">
              <div class="item-avatar">
                <img :src="foodsItem.icon" alt="图片" width="57" height="auto">
              </div>
              <div class="content">
                <h5 class="content-title">{{foodsItem.name}}</h5>
                <p class="content-desc" v-if="foodsItem.description">{{foodsItem.description}}</p>
                <p class="content-sell">
                  <span class="sell-count">月售{{foodsItem.sellCount}}份</span>
                  <span class="rating">好评率{{foodsItem.rating}}%</span>
                </p>
                <p class="content-price">
                  <span class="now">￥{{foodsItem.price}}</span>
                  <span class="old" v-if="foodsItem.oldPrice">￥{{foodsItem.oldPrice}}</span>
                </p>
              </div>
              <div class="cartcontrol-wrap">
                <v-cart-control :foodsItem="foodsItem" @add="addFood"></v-cart-control>
              </div>
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <v-shopcart ref="shopcart" :deliveryPrice="sellerData.deliveryPrice" :minPrice="sellerData.minPrice" :selectFoods="selectFoods"></v-shopcart>
    <v-food :foodItemData="selectedFoodItem" ref="foodItem" @add="addFood"></v-food>
  </div>
</template>

<script>
import BScroll from 'better-scroll';
import comShopcart from '../../components/shopcart/shopcart';
import comCartControl from '../../components/cartcontrol/cartcontrol';
import comFood from '../food/food.vue';

const ERR_OK = 0;

export default {
  name: 'comGoods',
  props: {
    sellerData: {
      type: Object
    }
  },
  data() {
    return {
      classMap: ['decrease', 'discount', 'special', 'invoice', 'guarantee'],
      goods: [],
      listHeight: [],
      scrollY: 0,
      selectedFoodItem: {}
    }
  },
  components: {
    'v-shopcart': comShopcart,
    'v-cart-control': comCartControl,
    'v-food': comFood
  },
  created() {
    this.$http.get('/api/goods').then((response) => {
      response = response.body;
      if (response.errno === ERR_OK) {
        this.goods = response.data;
        this.$nextTick(() => {
          this._initScroll();
          this._calculateHeight();
        });
      };
    }, () => {
      // error callback
    });
    this.$emit('childEvent');
  },
  computed: {
    currentIndex() {
      for (let i = 0; i < this.listHeight.length; i++) {
        let height1 = this.listHeight[i];
        let height2 = this.listHeight[i + 1];
        if (!height2 || (this.scrollY < height2 && this.scrollY >= height1)) {
          // console.log(height1,this.scrollY,height2,i)
          return i;
        }
      }
      return 0;
    },
    selectFoods() {
      let selectFoods = [];
      this.goods.forEach((goodsItem) => {
        goodsItem.foods.forEach((foodsItem) => {
          if (foodsItem.count) {
            selectFoods.push(foodsItem);
          };
        });
      });
      return selectFoods;
    }
  },
  methods: {
    _initScroll() {
      this.menuScroll = new BScroll(this.$refs.menuBox, {
        click: true
      });
      this.foodsScroll = new BScroll(this.$refs.foodsBox, {
        click: true,
        probeType: 3
      });
      // 监听scroll事件
      this.foodsScroll.on('scroll', (pos) => {
        this.scrollY = Math.abs(Math.round(pos.y));
      });
    },
    // 包含每一类食物的dom元素的高度组成的数组
    _calculateHeight() {
      let foodTypeList = this.$refs.foodsBox.querySelectorAll('.list-type-hook');
      let height = 0;
      this.listHeight.push(height);
      for (let i = 0, len = foodTypeList.length; i < len; i++) {
        let item = foodTypeList[i];
        height += item.clientHeight;
        this.listHeight.push(height);
      }
    },
    selectMenu(index, event) {
      if (!event._constructed) return;

      let foodTypeList = this.$refs.foodsBox.querySelectorAll('.list-type-hook');
      let targetEle = foodTypeList[index];
      this.foodsScroll.scrollToElement(targetEle, 300);
      // console.log(index);
    },
    selectFoodItem(foodItem, event) {
      if (!event._constructed) return;

      this.selectedFoodItem = foodItem;
      this.$refs.foodItem.show();
    },
    addFood(target) {
      console.log('goods组件的addFood方法已经执行，shopcart组件的drop方法将被触发', target);
      this.$refs.shopcart.drop(target);
    }
  }

}
</script>

<style lang="stylus">
@import '../../common/stylus/mixin.styl'

  .goods
    display flex
    width 100%
    flex-flow row nowrap
    justify-content flex-start
    align-items stretch
    main-content-scroll()
    .menu
      flex 0 0 .8rem
      width .8rem
      // height 100%
      overflow hidden
      background-color #f3f5f7
      .menu-list
        .menu-item
          display table
          width 100%
          height .54rem
          padding 0 .12rem
          overflow hidden
          &.current
            background-color #fff
          .menu-item-wrap
            display table-cell
            width 100%
            vertical-align middle
            font-size .12rem
            line-height .14rem
            border-bottom-1px(rgba(7,17,27,.1))
            .item-icon
              float left
              width .12rem
              height .12rem
              margin-right .03rem
              background-size 100% 100%
              background-repeat no-repeat
              background-position center center
              &.discount
                bg-image('./img/discount_3')
              &.decrease
                bg-image('./img/decrease_3')
              &.guarantee
                bg-image('./img/guarantee_3')
              &.invoice
                bg-image('./img/invoice_3')
              &.special
                bg-image('./img/special_3')
    .foods
      flex 1 1 auto
      // height 100%
      overflow hidden
      background-color #fff
      .list-type-wrap
        .title
          display block
          color $color147-153-159-1
          padding-left .14rem
          height .26rem
          font-size .12rem
          line-height .26rem
          background-color #f3f5f7
          border-left-1px(#d9dde1)
        .type-wrap
          // padding .18rem .18rem 0
          .item-detail:last-child
            border-none()
          .item-detail
            display flex
            flex-flow row nowrap
            justify-content flex-start
            align-items flex-start
            padding .18rem 0
            margin 0 .18rem
            border-bottom-1px(rgba(7,17,27,.1))
            .item-avatar
              flex 0 0 .57rem
              width .57rem
              height auto
              margin-right .1rem
              overflow hidden
              &>img 
                display block
                border-radius 2px
            .content
              flex-grow 1
              .content-title
                margin .02rem auto .08rem 0
                color rgb(7,17,27)
                font-size .14rem
                line-height .14rem
              .content-desc
                display block
                font-size .1rem
                color $color147-153-159-1
                line-height .1rem
                margin-bottom .08rem
              .content-sell
                display block
                font-size 0
                color $color147-153-159-1
                line-height .1rem
                margin-bottom .08rem
                .sell-count, .rating
                  display inline-block
                  font-size .1rem
                  line-height inherit
                  margin-right .12rem
                  vertical-align top
              .content-price
                display block
                line-height .24rem
                height .24rem
                font-weight 700
                .now, .old
                  float left
                .now
                  color $color240-20-20-1
                  font-size .14rem
                  margin-right .08rem
                .old
                  color $color147-153-159-1
                  font-size .1rem
                  text-decoration line-through
            .cartcontrol-wrap
              position absolute
              right 0
              bottom .12rem
              line-height .24rem

            
</style>
