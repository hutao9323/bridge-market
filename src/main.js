import Vue from 'vue'
import Vuex from 'vuex'

// import LoadScript from 'vue-plugin-load-script'
// import PulseLoader from 'vue-spinner/src/PulseLoader.vue'
// import VueClipboard from 'vue-clipboard2'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import "../theme/index.css"
import "./assets/main.css"
// import './assets/js/chia-utils'

import App from './App.vue'

Vue.use(Vuex)
// Vue.use(LoadScript)
// Vue.LoadScript("js/chia-utils.js")
Vue.use(ElementUI)
// Vue.use(VueClipboard)
// Vue.component('pulse-loader', PulseLoader)
Vue.config.productionTip = false




const store = new Vuex.Store({
    state: {
        coin: "PBT",
        baddr: false,
        userList: [],
        saleList: [],
        mySaleList: [],
        curNFT: {},
        NFTinfo: false
    },
    mutations: {
        setBaddr(state, baddr) {
            state.baddr = baddr
        },
        setCoin(state, coin) {
            state.coin = coin
        },
        setUserList(state, userList) {
            state.userList = userList
        },
        setSaleList(state, list) {
            state.saleList = list
        },
        setMySaleList(state, list) {
            state.mySaleList = list
        },
        setCurNFT(state, curNFT) {
            state.curNFT = curNFT
        },
        setNFTinfo(state, boolean) {
            state.NFTinfo = boolean
        }
    }
})

new Vue({

    render: h => h(App),
    store: store,
}).$mount('#app')