<template>
  <div id="ratings" class="ratings" ref="ratings">
    <div class="ratings-content">
      <div class="overview">
        <div class="overview-left">
          <h1 class="score">{{sellerData.score}}</h1>
          <p class="title">综合评分</p>
          <p class="rank">高于周围商家{{sellerData.rankRate}}%</p>
        </div>
        <div class="overview-right">
          <div class="overview-right-content">
            <div class="score-wrap overview-right-flex-box">
              <span class="title no-shrink">服务态度</span>
              <div class="star-wrap">
                <v-star :score="sellerData.serviceScore" :size="36"></v-star>
              </div>
              <span class="score-num no-shrink">{{sellerData.serviceScore}}</span>
            </div>
            <div class="score-wrap overview-right-flex-box">
              <span class="title no-shrink">食物品质</span>
              <div class="star-wrap">
                <v-star :score="sellerData.foodScore" :size="36"></v-star>
              </div>
              <span class="score-num no-shrink">{{sellerData.foodScore}}</span>
            </div>
            <div class="delivery-wrap overview-right-flex-box">
              <span class="title no-shrink">送达时间</span>
              <span class="time no-shrink">{{sellerData.deliveryTime}}分钟</span>
            </div>
          </div>
        </div>
      </div>
      <div class="split-wrap">
        <v-split></v-split>
      </div>
      <div class="ratings-select-wrap">
        <!-- 这个组件里面的js数据见9-4视频-->
        <v-rating-select :descCont="desc" :selectType="selectType" 
            :onlyContent="onlyContent" :ratings="ratings" 
            @select="selectRating" @toggle="toggleContent"></v-rating-select>
      </div>
      <div class="main-content">
        <ul>
          <li class="ratings-item" v-for="(ratingsItem, index) in ratings" :key="index"
          v-show="needShow(ratingsItem.rateType, ratingsItem.text)">
            <div class="avatar">
              <img width="28" height="auto" :src="ratingsItem.avatar" alt="用户头像">
            </div>
            <div class="content">
              <h1 class="name-time">
                <span class="name">{{ratingsItem.username}}</span>
              </h1>
              <div class="delivery-rating">
                <div class="star-wrap">
                  <v-star :score="ratingsItem.score" :size="24"></v-star>
                </div>
                <span class="delivery-time" v-show="ratingsItem.deliveryTime">{{ratingsItem.deliveryTime}}分钟送达</span>
              </div>
              <p class="text" v-show="ratingsItem.text">{{ratingsItem.text}}</p>
              <div class="recommend" v-show="ratingsItem.recommend && ratingsItem.recommend.length">
                <i class="icon-thumb_up"></i>
                <div class="recommend-item" v-for="(recommendItem,index) in ratingsItem.recommend" :key="index">
                  {{recommendItem}}
                </div>
              </div>
              <div class="rate-time">{{ratingsItem.rateTime | formatDate}}</div>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <!--<v-shopcart ref="shopcart" :deliveryPrice="sellerData.deliveryPrice" 
      :minPrice="sellerData.minPrice" :selectFoods="selectFoods"></v-shopcart>-->
  </div>
</template>

<script>
import Vue from 'vue';
import BScroll from 'better-scroll';
import comStar from '../star/star.vue';
import comSplit from '../split/split.vue';
import comRatingSelect from '../ratingselect/ratingselect.vue';
import comShopcart from '../../components/shopcart/shopcart';
import { formatDate } from '../../common/js/date.js'

const ERR_OK = 0;
const ALL = 2;

export default {
  name: 'comRatings',
  data() {
    return {
      ratings: [],
      desc: {
        all: '全部',
        positive: '推荐',
        negative: '吐槽'
      },
      selectType: ALL,
      onlyContent: false
    }
  },
  props: {
    sellerData: {
      type: Object
    }
  },
  components: {
    'v-star': comStar,
    'v-rating-select': comRatingSelect,
    'v-split': comSplit,
    'v-shopcart': comShopcart
  },
  created() {
    this.$http.get('api/ratings').then((response) => {
      response = response.body;
      if (response.errno === ERR_OK) {
        this.ratings = response.data;
        
        this.$nextTick(() => {
          this.ratingsScroll = new BScroll(this.$refs.ratings, {
            click: true
          });
        });
      }
    }, () => {
      // error callback
    });
  },
  methods: {
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
        this.ratingsScroll.refresh();
      });
    },
    toggleContent() {
      this.onlyContent = !this.onlyContent;
      this.$nextTick(() => {
        this.ratingsScroll.refresh();
      });
    }
  },
  filters: {
    formatDate(value) {
      return formatDate(value);
    }
  }
}
</script>

<style lang="stylus">
@import '../../common/stylus/base.styl';
@import '../../common/stylus/mixin.styl';

.ratings {
  main-content-scroll();
  bottom: 0;

  .ratings-content {
    .overview {
      display: flex;
      flex-flow: row nowrap;
      justify-content: flex-start;
      align-items: stretch;
      padding: 0.18rem 0;
      color: rgb(7, 17, 27);

      .overview-left {
        flex: 1;
        border-right: 1px solid rgba(7, 17, 27, 0.2);
        text-align: center;

        .score {
          color: rgb(255, 153, 0);
          line-height: 0.28rem;
          font-size: 0.24rem;
          margin-bottom: 0.06rem;
        }

        .title {
          font-size: 0.12rem;
          color: rgb(7, 17, 27);
          line-height: 0.18rem;
          margin-bottom: 0.08rem;
        }

        .rank {
          font-size: 0.1rem;
          color: $color147-153-159-1;
          line-height: 0.1rem;
          margin-bottom: 0.06rem;
        }
      }

      .overview-right {
        flex: 1.72363;

        // https://stackoverflow.com/questions/34753491/how-does-flex-shrink-factor-in-padding-and-border-box
        // padding 0 .24rem 这里不能使用padding 原因见上链接，如果需要padding，解决办法是在其下面的添加一个的子元素来使用padding
        .overview-right-content {
          height: 100%;
          padding: 0 0.24rem;
          overflow-x: scroll;

          @media only screen and (max-width: 320px) {
            padding: 0 0.06rem;
          }

          .title {
            color: rgb(7, 17, 27);
            font-size: 0.12rem;
            line-height: 0.18rem;
            margin-right: 0.12rem;
            flex: 0 0 auto;
          }

          .overview-right-flex-box {
            display: flex;
            flex-flow: row nowrap;
            justify-content: flex-start;
            align-items: center;
          }

          .score-wrap {
            margin-bottom: 0.08rem;

            .star-wrap {
              margin-right: 0.12rem;
              flex: 0 1 auto;
            }

            .score-num {
              font-size: 0.12rem;
              color: rgb(255, 153, 0);
              line-height: 0.18rem;
              flex: 1 0 auto;
            }
          }

          .delivery-wrap {
            .time {
              font-size: 0.12rem;
              color: $color147-153-159-1;
              line-height: 0.18rem;
              flex: 0 0 auto;
            }
          }
        }
      }
    }

    .main-content {
      width: 100%;
      padding: 0 0.18rem 0;
      border-top: 1px solid rgba(7, 17, 27, 0.2);

      .ratings-item {
        display: flex;
        flex-flow: row nowrap;
        justify-content: flex-start;
        align-items: flex-start;
        padding: 0.18rem 0;
        color: rgb(7, 17, 27);
        border-bottom: 1px solid rgba(7, 17, 27, 0.1);

        .avatar {
          flex: 0 0 0.28rem;
          width: 0.28rem;
          margin-right: 0.12rem;

          img {
            display: block;
            border-radius: 50%;
          }
        }

        .content {
          position: relative;
          flex-grow: 1;

          .name-time {
            display: flex;
            flex-flow: row nowrap;
            align-items: center;
            line-height: 0.12rem;
            margin-bottom: 0.04rem;

            .name {
              font-size: 0.1rem;
              color: rgb(7, 17, 27);
            }
          }

          .delivery-rating {
            display: flex;
            flex-flow: row nowrap;
            justify-content: flex-start;
            align-items: center;
            margin-bottom: 0.06rem;

            .star-wrap {
              margin-right: 0.06rem;
            }

            .delivery-time {
              font-size: 0.1rem;
              line-height: 0.12rem;
              font-weight: 200;
              color: $color147-153-159-1;
            }
          }

          .text {
            display: block;
            font-size: 0.12rem;
            color: rgb(7, 17, 27);
            line-height: 0.18rem;
            margin-bottom: 0.08rem;
          }

          .recommend {
            display: flex;
            flex-flow: row wrap;
            justify-content: flex-start;
            align-items: center;

            // max-width 100%
            &>i {
              font-size: 0.12rem;
              color: $color0-160-220-1;
              line-height: 0.16rem;
            }

            .recommend-item {
              box-sizing: content-box;
              font-size: 0.09rem;
              color: $color147-153-159-1;
              line-height: 0.16rem;
              padding: 0 0.06rem;
              border: 1px solid rgba(7, 17, 27, 0.1);
              border-radius: 2px;
              background-color: #fff;
              max-width: 5em;
              margin-bottom: 0.04rem;
              white-space: nowrap;
              text-overflow: ellipsis;
              overflow: hidden;

              &:not(:last-child) {
                margin-right: 0.08rem;
              }
            }
          }

          .rate-time {
            position: absolute;
            top: 0;
            right: 0;
            font-size: 0.1rem;
            font-weight: 200;
            color: rgb(7, 17, 27);
          }
        }
      }
    }
  }
}
</style>
