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
        curNFT: {},
        NFTinfo: false,
        allow: -1,
        PBTlists: [],
        PBXlists: [],



    },
    mutations: {
        setBaddr(state, baddr) {
            state.baddr = baddr
        },
        setCoin(state, coin) {
            state.coin = coin
        },
        setCurNFT(state, curNFT) {
            state.curNFT = curNFT
        },
        setNFTinfo(state, boolean) {
            state.NFTinfo = boolean
        },
        setAllow(state, allow) {
            state.allow = allow
        },
        setPBTlists(state, list) {
            // generate MySale, Market, MyBag lists
            state.PBTlists = list
        },
        setPBXlists(state, list) {
            // generate MySale, Market, MyBag lists
            state.PBxlists = list
        }
    }
})

new Vue({
    render: h => h(App),
    store: store,
}).$mount('#app')