import Vue from 'vue'
import VueResource from 'vue-resource'
Vue.use(VueResource)

Vue.http.interceptors.push((request, next) => {
    const authUser = window.localStorage.getItem('TodoToken');
    if(authUser) request.headers.set('Authorization', 'Bearer ' + authUser);
    request.headers.set('Accept', 'application/json');
    next();
  });
  