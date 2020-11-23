import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// 引入axios
import axios from 'axios'
axios.defaults.baseURL = 'http://m.jxedt.com/mnksnew/g.asp'; 
Vue.prototype.$axios= axios

// lib-flexible 用于设置 rem 基准值
import 'lib-flexible/flexible'  

// 引入vant组件
import{
  Button,
  NavBar,
  Swipe,
  SwipeItem,
  Dialog,
  Loading,
  Toast,
  Popup,
  CountDown,
  Empty
}from 'vant'

Vue.
  use(Button)
  .use(NavBar)
  .use(Swipe)
  .use(SwipeItem)
  .use(Dialog)
  .use(Loading)
  .use(Toast)
  .use(Popup)
  .use(CountDown)
  .use(Empty)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
