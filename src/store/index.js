import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    endpoints: {
      api: ' ', // is set automatically in main.js
      login: ' ' // is set automatically in main.js
    },
    user: {
      isAuthenticated: false,
      name: '',
      idToken: '',
      accessToken: '',
      email: '',
      roles: []
    }
  },
  mutations: {
    setAPI(state, payload) {
      state.endpoints.api = payload.api
    },
    setAPIAndLogin(state, payload) {
      state.endpoints.api = payload.api
      state.endpoints.login = payload.login
    },
    logout(state) {
      state.user.isAuthenticated = false
      state.user.name = ''
      state.user.idToken = ''
      state.user.accessToken = ''
      state.user.roles = []
      localStorage.removeItem('vue-token')
      localStorage.removeItem('vue-refresh-token')
    },
    login(state, payload) {
      state.user.isAuthenticated = true
      state.user.idToken = payload.idToken
      state.user.accessToken = payload.accessToken
      state.user.roles = payload.roles

      axios.defaults.headers.common['Authorization'] = `Bearer ${payload.accessToken}`
    },
    setName(state, payload) {
      state.user.name = payload.name
      state.user.email = payload.email
    }
  },
  actions: {},
  getters: {
    loggedIn(state) {
      return !!state.user
    }
  }
})
