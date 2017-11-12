<template>
  <div id="app">
    <v-header :sellerData="seller" ref="vHeaderEle"></v-header>
    <nav class="tap border-1px" ref="tapBox">
      <ul class="tap-list">
        <router-link to="/goods" tag="li" class="tap-item">商品</router-link>
        <router-link to="/ratings" tag="li" class="tap-item">评价</router-link>
        <router-link to="/seller" tag="li" class="tap-item">商家</router-link>
      </ul>
    </nav>
    <keep-alive>
      <router-view :sellerData="seller"></router-view>
    </keep-alive>
  </div>
</template>

<script>
// import "./common/stylus/index.styl";
import comHeader from "./components/header/header.vue";
import { urlParse } from "./common/js/url.js";

const ERR_OK = 0;

export default {
  name: "app",
  components: {
    "v-header": comHeader
    // 'v-shopcart': comShopcart
  },
  data() {
    return {
      seller: {
        /* 商家默认有id */
        id: (() => {
          /* 从地址栏中的url中通过urlParse函数解析得到id */
          let queryParam = urlParse();
          console.log(queryParam);
          return queryParam.id;
        })()
      }
    };
  },
  created: function() {
    this.$http.get("/api/seller").then(
      response => {
        response = response.body;
        response.errno === ERR_OK &&
          (this.seller = Object.assign({}, this.seller, response.data));
      },
      response => {
        alert(res.status);
      }
    );
  }
};
</script>

<style lang="stylus">
@import './common/stylus/mixin.styl';

#app {
  color: #333;
  position: relative;
  height: 100vh;
  // overflow auto
  overflow: hidden;

  .tap {
    border-1px(rgba(7, 17, 27, 0.1));

    .tap-list {
      display: flex;
      width: 100%;
      height: 0.4rem;
      padding: 0.3em 0;
      line-height: 0.4rem;
      flex-direction: row;
      flex-wrap: nowrap;
      justify-content: space-between;
      align-items: center;

      .tap-item {
        flex: 1 1 auto;
        text-align: center;
        cursor: pointer;
        font-size: 0.14rem;
        color: rgba(77, 85, 93, 1);

        &.router-link-active {
          color: rgba(240, 20, 20, 1);
        }
      }
    }
  }
}
</style>
