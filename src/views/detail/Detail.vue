<template>
  <div id="detail">
    <detail-nav-bar class="detail-nav" @titleClick="titleClick" />
    <scroll
      class="content"
      ref="scroll"
      :probe-type="3"
    >
      <detail-swiper :top-images="topImages" @load="imageLoad" />
      <detail-base-info :goods="goods" />
      <detail-shop-info :shop="shop" />
      <detail-goods-info
        :detail-info="detailInfo"
        @detailImageLoad="detailImageLoad"
      />
      <detail-param-info ref="params" :param-info="paramInfo" />
      <detail-comment-info ref="comment" :comment-info="commentInfo" />
      <goods-list ref="recommend" :goods="recommends" />
    </scroll>
  </div>
</template>

<script>
import DetailNavBar from "./childComps/DetailNavBar";
import DetailSwiper from "./childComps/DetailSwiper";
import DetailBaseInfo from "./childComps/DetailBaseInfo";
import DetailShopInfo from "./childComps/DetailShopInfo";
import DetailGoodsInfo from "./childComps/DetailGoodsInfo";
import DetailParamInfo from "./childComps/DetailParamInfo";
import DetailCommentInfo from "./childComps/DetailCommentInfo";

import Scroll from "components/common/scroll/Scroll";
import GoodsList from "components/content/goods/GoodsList";

import {
  getDetail,
  Goods,
  Shop,
  GoodsParam,
  getRecommend
} from "network/detail";

import { itemListenerMixin } from "common/mixin";

export default {
  name: "Detail",
  components: {
    DetailNavBar,
    DetailSwiper,
    DetailBaseInfo,
    DetailShopInfo,
    DetailGoodsInfo,
    DetailParamInfo,
    DetailCommentInfo,
    Scroll,
    GoodsList
  },
  mixins: [itemListenerMixin],
  data() {
    return {
      iid: null,
      topImages: [],
      goods: {},
      shop: {},
      detailInfo: {},
      paramInfo: {},
      commentInfo: {},
      recommends: [],
      themeTopYs: []
    };
  },
  created() {
    // 1、保存传入的iid
    this.iid = this.$route.params.iid;

    // 2、根据iid请求详情数据
    getDetail(this.iid).then(res => {
      const data = res.result;
      // 2.1、获取顶部的图片轮播数据
      this.topImages = data.itemInfo.topImages;

      // 2.2、获取商品信息
      this.goods = new Goods(
        data.itemInfo,
        data.columns,
        data.shopInfo.services
      );

      // 2.3、创建店铺信息对象
      this.shop = new Shop(data.shopInfo);

      // 2.4、保存商品得详情数据
      this.detailInfo = data.detailInfo;

      // 2.5、保存参数信息
      this.paramInfo = new GoodsParam(
        data.itemParams.info,
        data.itemParams.rule
      );

      // 2.6、保存评论信息
      if (data.rate.cRare !== 0) {
        this.commentInfo = data.rate.list[0];
      }

      // this.$nextTick(() => {
      //   // 根据最新的数据，对应的DOM是已经渲染出来
      //   // 但是图片依然没有加载完成
      //   this.themeTopYs = [];
      //   this.themeTopYs.push(0);
      //   this.themeTopYs.push(this.$refs.params.$el.offsetTop);
      //   this.themeTopYs.push(this.$refs.comment.$el.offsetTop);
      //   this.themeTopYs.push(this.$refs.recommend.$el.offsetTop);
      // });
    });

    // 3、请求推荐数据
    getRecommend().then(res => {
      this.recommends = res.data.list;
    });
  },
  mounted() {},
  destroyed() {
    this.$bus.$off("itemImageLoad", this.itemImgListener);
  },
  methods: {
    imageLoad() {
      // this.$refs.scroll.refresh();
      this.newRefresh();
    },
    titleClick(index) {
      this.$refs.scroll.scrollTo(0, -this.themeTopYs[index], 100);
    },
    detailImageLoad() {
      this.newRefresh();
      this.themeTopYs = [];
      this.themeTopYs.push(0);
      this.themeTopYs.push(this.$refs.params.$el.offsetTop - 44);
      this.themeTopYs.push(this.$refs.comment.$el.offsetTop - 44);
      this.themeTopYs.push(this.$refs.recommend.$el.offsetTop - 44);
    }
  }
};
</script>

<style scoped>
#detail {
  position: relative;
  z-index: 9;
  background-color: #fff;
  height: 100vh;
}

.detail-nav {
  position: relative;
  z-index: 9;
  background-color: #fff;
}

.content {
  height: calc(100% - 44px);
}
</style>
