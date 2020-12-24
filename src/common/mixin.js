import { debounce } from "common/utils";
import BackTop from "components/content/backTop/BackTop";
export const itemListenerMixin = {
  data () {
    return {
      itemImgListener: null,
      newRefresh: null
    }
  },
  mounted () {
    this.newRefresh = debounce(this.$refs.scroll.refresh, 200);
    this.itemImgListener = () => {
      this.newRefresh();
    };
    this.$bus.$on("itemImageLoad", this.itemImgListener);
  }
}

export const backTopMixin = {
  components: {
    BackTop
  },
  data() {
    return {
      isShowBackTop: false
    }
  },
  methods: {
    backClick() {
      // this.$refs.scroll.scroll.scrollTo(0,0);
      this.$refs.scroll.scrollTo(0, 0);
    }
  }
}