import Vue from 'vue'
import App from './App.vue'
import router from './plugins/router'
import store from './plugins/store'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import '@mdi/font/css/materialdesignicons.css'
import './plugins/resource'

Vue.config.productionTip = false
Vue.use(Vuetify)

new Vue({
  render: h => h(App),
  router,
  store
}).$mount('#app')
