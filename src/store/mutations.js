import { ADD_COUNTER, ADD_TO_CART } from "./mutation-types";

export default {
  // mutations 唯一的目的就是修改state中的状态
  // mutation中的每个方法尽可能完成的事件比较单一一点
  // addCart(state, payload) {
  //   let product = state.cartList.find(item => item.iid === payload.iid);
  //   if (product) {
  //     product.count += 1;
  //   } else {
  //     payload.count = 1;
  //     state.cartList.push(payload);
  //   }
  // }
  [ADD_COUNTER](state, payload) {
    payload.count++;
  },
  [ADD_TO_CART](state, payload) {
    state.cartList.push(payload);
  }
};
