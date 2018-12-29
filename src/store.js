import Vue from 'vue'
import Vuex from 'vuex'
import {SET_TOKEN, SET_USER} from './store-mutations'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: JSON.parse(localStorage.getItem('TodoUser') || 'null'),
    token: localStorage.getItem('TodoToken'),

  },
  getters: {
    isLoggedIn: state =>  state.token,
    user: state => state.user,
  },
  mutations: {
    [SET_USER] (state, user) {
      localStorage.setItem('TodoUser', JSON.stringify(user || 'null'));
      state.user = user;
    },
    [SET_TOKEN] (state, token) {
      localStorage.setItem('TodoToken', token);
      state.token = token;
    },
  },
  actions: {
    logout(context) {
      context.commit(SET_TOKEN, '');
    },
  }
});
