import Vue from 'vue'
import App from './App.vue'
import router from './plugins/router'
import store from './plugins/store'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import './plugins/resource'

Vue.config.productionTip = false
Vue.use(Vuetify, {
  iconfont: 'mdi'
 })

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
