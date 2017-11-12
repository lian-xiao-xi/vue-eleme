<template>
  <div class="cartcontrol">
    <transition name="move">
      <div class="cart-decrease" @click.stop.prevent="decrease" v-show="foodsItem.count>0">
        <i class="icon-remove_circle_outline inner"></i>
      </div>
    </transition>
    <span class="cart-count" v-show="foodsItem.count>0">{{foodsItem.count}}</span>
    <div class="cart-add" @click.stop.prevent="addCart">
      <i class="icon-add_circle"></i>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';

export default {
  props: {
    foodsItem: {
      type: Object
    }
  },
  methods: {
    addCart(event) {
      if(!event._constructed) {
        return;
      }
      if(!this.foodsItem.count) {
        Vue.set(this.foodsItem,'count',1);
      } else {
        this.foodsItem.count++;
      }
      console.log('cartcontrol组件的addCart方法已经执行，将触发add事件',event.target);
      this.$emit('add', event.target);
    },
    decrease(event) {
      if(!event._constructed) {
        return;
      }
      if(this.foodsItem.count) {
        this.foodsItem.count--;
      }
    }
  },
  created() {
    // console.log(this.foodsItem);
  }
}
</script>

<style lang="stylus">
@import '../../common/stylus/mixin.styl';

.cartcontrol
  display flex
  flex-flow row nowrap
  justify-content space-around
  align-items center
  .cart-decrease, .cart-add
    font-size .24rem
    line-height 1em
    color $color0-160-220-1 
    text-align center
    padding .05rem
    flex 0 1 auto
    transform rotate(0)
    transition all .4s linear
  .cart-decrease
    &.move-enter, &.move-leave-to
      opacity 0
      transform translate3d(.24rem,0,0)
      .inner
        transform rotate(360deg)
        transform-origin center center 0
    &.move-leave-active, &.move-enter-active
      transition all .4s linear
      .inner
        transition all .4s linear
    &.move-enter-to, &.move-leave
      opacity 1
      transform translate3d(0,0,0)
      .inner
        transform rotate(0)
        transform-origin center center 0
    
  .cart-decrease .icon-remove_circle_outline, .cart-add .icon-add_circle
    display block
  .cart-count
      font-size .1rem
      color $color147-153-159-1
      text-align center
      flex 0 1 .24rem
      width 1.2em

</style>


