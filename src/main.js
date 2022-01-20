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
Vue.config.productionTip = false


const store = new Vuex.Store({
    state: {
        mcoin: "XCH",
        bcoin: "PBT",
        baddr: false,
        curNFT: {},
        NFTinfo: false,
        allow: -1,
        PBTlists: [],
        PBXlists: [],
        redeemBalance: "0",
        redeemAllowance: "0"
    },
    mutations: {
        setBaddr(state, baddr) {
            state.baddr = baddr
        },
        setBalance(state, balance) {
            state.balance = balance
        },
        setBcoin(state, coin) {
            state.bcoin = coin
        },
        setMcoin(state, coin) {
            state.mcoin = coin
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
            state.PBXlists = list
        },
        setRedeemBalance(state, balance) {
            state.redeemBalance = balance
        },
        setRedeemAllowance(state, allowance) {
            state.redeemAllowance = allowance
        }
    }
})

new Vue({
    render: h => h(App),
    store: store,
}).$mount('#app')