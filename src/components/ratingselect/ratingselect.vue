<template>
  <div class="ratingselect">
    <div class="rating-type border-bottom-1px">
      <div class="block positive" @click="select(2,$event)" :class="{'active': selectType===2}">
        <span class="select-cont">{{descCont.all}}</span>
        <span class="rating-count">{{ratings.length}}</span>
      </div>
      <div class="block positive" @click="select(0,$event)" :class="{'active': selectType===0}">
        <span class="select-cont">{{descCont.positive}}</span>
        <span class="rating-count">{{positiveRatings.length}}</span>
      </div>
      <div class="block negative" @click="select(1,$event)" :class="{'active': selectType===1}">
        <span class="select-cont">{{descCont.negative}}</span>
        <span class="rating-count">{{negativeRatings.length}}</span>
      </div>
    </div>
    <div class="switch" @click="toggleContent" :class="{'on':onlyContent}">
      <div class="icon-check_circle"></div>
      <div class="text">只看有内容的评价</div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
const ALL = 2;
const POSITIVE = 0, NEGATIVE = 1;

export default {
  name: 'comRatingSelect',
  props: {
    ratings: {
      type: Array,
      default() {
        return [];
      }
    },
    descCont: {
      type: Object,
      default() {
        return {
          all: '全部',
          positive: '满意',
          negative: '不满意'
        }
      }
    },
    selectType: {
      type: Number,
      default: ALL
    },
    onlyContent: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    positiveRatings() {
      return this.ratings.filter((item) => {
        return item.rateType === POSITIVE;
      });
    },
    negativeRatings() {
      return this.ratings.filter((item) => {
        return item.rateType === NEGATIVE;
      });
    }
  },
  methods: {
    select(type, event) {
      if (!event._constructed) return;
      this.$emit('select', type);
    },
    toggleContent(event) {
      if (!event._constructed) return;
      this.$emit('toggle');
    }
  }
}
</script>

<style lang="stylus">
@import '../../common/stylus/mixin.styl'
@import '../../common/stylus/base.styl'

.ratingselect
  .rating-type
    // position relative
    display flex
    flex-flow row nowrap
    justify-content flex-start
    align-content center
    margin 0 .18rem
    padding .12rem 0 .18rem
    border-bottom-1px($color7-17-27-0_1)
    .block
      color $color77-85-93-1
      font-size 0
      line-height .16rem
      padding .08rem .12rem
      margin-right .08rem
      background-color rgba(0,160,220,0.2)
      &:last-child
        margin-right 0
      &.negative
        background-color rgba(77,85,93,.2)
      &.active
        color #ffffff
      &.positive.active
        background-color $color0-160-220-1
      &.negative.active
        background-color $color77-85-93-1
      .select-cont, .rating-count
        display inline-block
        vertical-align top
        line-height inherit
      .select-cont
        font-size .12rem
      .rating-count
        font-size .08rem
        margin-left .02rem
  .switch
    padding .12rem .18rem
    line-height .24rem
    font-size 0
    color $color147-153-159-1
    border-bottom 1px solid $color7-17-27-0_1
    &.on [class^=icon-check]
      color $color0-160-220-1
    [class^=icon-check], .text
      display inline-block
      vertical-align top
      line-height inherit 
    [class^=icon-check]
      font-size .24rem
      margin-right .04rem
    .text
      font-size .12rem


</style>

