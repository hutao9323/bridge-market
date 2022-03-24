import Vue from 'vue'
import Vuex from 'vuex'
import pbw from 'pbwallet'
Vue.use(Vuex)
export default new Vuex.Store({
    state: {
        bsc: {},
        bcoin: false,
        baddr: false,
        current: {},
        myList: {},
        marketList: {},
        mySaleList: {},
        WBalance: 0,
        redeemBalance: "0",
        redeemAllowance: "0",
    },
    mutations: {
        setBsc(state, bsc) {
            state.bsc = bsc
        },
        setBaddr(state, baddr) {
            state.baddr = baddr
        },
        setCurrentPbtId(state, pbtId) {
            if (pbtId != state.current.pbtId) {
                state.current.pbtId = pbtId
                state.current = Object.assign({}, state.current);
            }
        },
        setCurrentCoinType(state, coinType) {
            console.log('setCurrentCoinType', coinType)
            if (coinType != state.current.coinType) {
                state.current.coinType = coinType
                state.current = Object.assign({}, state.current);
                state.bcoin = pbw.wcoin_info(coinType).symbol;
            }
        },
        setMylist(state, list) {
            console.log('set-my-list', list)
            state.myList = Object.assign({}, list)
        },
        setMarketlist(state, list) {
            state.marketList = list
        },
        setMySalelist(state, list) {
            state.mySaleList = list
        },
        setRedeemBalance(state, balance) {
            state.redeemBalance = balance
        },
        setRedeemAllowance(state, allowance) {
            state.redeemAllowance = allowance
        },
        setWBalance(state, balance) {
            state.WBalance = balance
        }
    },
    actions: {},
    modules: {}
})