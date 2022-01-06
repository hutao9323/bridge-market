import { connect } from 'pbwallet'

async function connect_wallet(commit){
    const bsc = await connect(true) // true: for testnet, false: for mainnet, TODO: support multiple networks
    if(typeof(commit)=='function'){
        commit('setBaddr', bsc.addr)
    }else{
        console.log('skip commit', commit)
    }
    console.log('bsc', bsc)
}

export default {
    connect_wallet: connect_wallet
}
