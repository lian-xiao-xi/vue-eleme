<template>
  <div class="star" :class="[starSize]">
    <span class="star-item" v-for="(itemClass, index) in itemClasses" :key="index" 
    :class="[itemClass]"></span>
  </div>
</template>

<script>
const LENGTH = 5;
const CLS_ON = 'on';
const CLS_HALF = 'half';
const CLS_OFF = 'off';

export default {
  data() {
    return {
      classList: []
    }
  },
  props: {
    size: { // 24, 36, 48 三种图片尺寸
      type: Number
    },
    score: {
      type: Number
    }
  },
  computed: {
    starSize() {
      return 'star-' + this.size;
    },
    itemClasses() {
      let result = [].concat(this.classList);
      let score = Math.floor(this.score * 2) / 2;
      const hasDecimal = score % 1 !== 0; // score 是否是小数(n.5)
      const integer = Math.floor(score); // 获取score的整数部分
      for(let i = 0; i <integer; i++) {
        result.push(CLS_ON);
      }
      if(hasDecimal) {
        result.push(CLS_HALF);
      }
      while (result.length <LENGTH) {
        result.push(CLS_OFF);
      }
      return result;
    }
  },
  created() {
  }
}
</script>

<style lang="stylus">
@import '../../common/stylus/mixin.styl'

.star 
  display flex
  flex-direction row
  flex-wrap nowrap
  justify-content center
  .star-item
    margin 0
    display block
    background-repeat no-repeat
    background-position center
    background-size 100% 100%
  &.star-24
    .star-item
      width .1rem
      height .1rem
      margin-right 0.05rem
      &:last-child
        margin-right 0
      &.on
        bg-image('./img/star24_on')
      &.half
        bg-image('./img/star24_half')
      &.off
        bg-image('./img/star24_off')
  &.star-36
    .star-item
      width .15rem
      height .15rem
      margin-right 0.06rem
      &:last-child
        margin-right 0
      &.on
        bg-image('./img/star36_on')
      &.half
        bg-image('./img/star36_half')
      &.off
        bg-image('./img/star36_off')
  &.star-48
    .star-item
      width .2rem
      height .2rem
      margin-right 0.12rem
      &:last-child
        margin-right 0
      &.on
        bg-image('./img/star48_on')
      &.half
        bg-image('./img/star48_half')
      &.off
        bg-image('./img/star48_off')

</style>


