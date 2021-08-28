import Vue from 'vue'
import { BootstrapVue, IconsPlugin, JumbotronPlugin } from 'bootstrap-vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import Vuelidate from "vuelidate";
import VueQrcodeReader from "vue-qrcode-reader";
import * as Keycloak from 'keycloak-js'
import VueLogger from 'vuejs-logger'

Vue.config.productionTip = false
Vue.use(BootstrapVue)
Vue.use(IconsPlugin)
Vue.use(JumbotronPlugin)
Vue.use(Vuelidate);
Vue.use(VueQrcodeReader);

const options = {
  isEnabled: true,
  logLevel: Vue.config.productionTip ? 'error' : 'debug',
  stringifyArguments: false,
  showLogLevel: true,
  showMethodName: true,
  separator: '|',
  showConsoleColors: true
}
Vue.use(VueLogger, options)

const construtorOptions = {
  url: process.env.VUE_APP_KEYCLOAK_URL,
  realm: process.env.VUE_APP_KEYCLOAK_REALM,
  clientId: process.env.VUE_APP_KEYCLOAK_CLIENT_ID,
  credentials: {
    secret: process.env.VUE_APP_KEYCLOAK_SECRET
  },
}

const initOptions = {
  onLoad: 'login-required',
}

let keycloak = Keycloak(construtorOptions)
let payload = {} // this is where token + creddentials to send to API

Vue.prototype.$keycloak = keycloak
keycloak
  .init(initOptions)
  .success(auth => {
    if (!auth) {
      // console.log('not userrrr')
      window.location.reload()
    }

    else {
      payload = {
        idToken: keycloak.idToken,
        accessToken: keycloak.token,
        name: keycloak.tokenParsed.preferred_username,
        email: keycloak.tokenParsed.email,
        roles: keycloak.resourceAccess[process.env.VUE_APP_KEYCLOAK_CLIENT_ID].roles
      }
      console.log("whattt", keycloak.resourceAccess)

      console.log("payyyyyy", payload)

      if (payload.idToken && payload.accessToken && payload.idToken != '' && payload.accessToken != '') {
        localStorage.setItem('vue-token', payload.accessToken)
        localStorage.setItem('vue-refresh-token', keycloak.refreshToken)
        localStorage.setItem('username', payload.name)
        localStorage.setItem('email', payload.email)
        localStorage.setItem('roles', payload.roles)

        store.commit('login', payload)
        store.commit('setName', payload)

        console.log(localStorage)
      }
      else {
        store.commit('logout')
      }

      setInterval(() => {
        keycloak
          .updateToken(70)
          .success(refreshed => {
            if (refreshed) {
              Vue.$log.debug('Token refreshed')
              console.log('--> log: updateToken')
              let payloadRefreshedTokens = {
                idToken: keycloak.idToken,
                accessToken: keycloak.token
              }
              //should we check this?
              if (keycloak.token && keycloak.idToken && keycloak.token != '' && keycloak.idToken != '') {
                store.commit('login', payloadRefreshedTokens)
              }

              else {
                store.commit('logout')
              }
            }

            else {
              Vue.$log.warn(
                'Token not refreshed, valid for ' +
                Math.round(
                  keycloak.tokenParsed.exp +
                  keycloak.timeSkew -
                  new Date().getTime() / 1000
                ) +
                ' seconds'
              )
            }
          })
          .error(() => {
            Vue.$log.error('Failed to refresh token')
          })
      }, 60000)


      Vue.$log.info('Authenticated')
    }

    new Vue({
      store,
      router,
      render: h => h(App)
    }).$mount('#app')

  })
  .error(() => {
    Vue.$log.error('Authenticated Failed')
  })
