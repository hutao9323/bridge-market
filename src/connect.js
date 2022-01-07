import {
    connect
} from 'pbwallet'

import { ethers } from 'ethers'

var bsc = {}

async function connect_wallet() {
    console.log('connect wallet', connect)
    bsc = await connect(true) // true: for testnet, false: for mainnet, TODO: support multiple networks
    console.log("bsc", bsc)
    return bsc
}

async function getUserTokenList(addr) {
    const pb = bsc.ctrs.pbt
    const pbmarket = bsc.ctrs.pbmarket

    const cnt = await pb.balanceOf(addr)
    console.log("cnt", cnt)
    console.log('user', addr, 'has', cnt, 'tokens')
    const list = []
    for (var i = 0; i < cnt; i++) {
        const idx = await pb.tokenOfOwnerByIndex(addr, i)
        const uri = await pb.tokenURI(idx)
        const meta = await (await fetch(uri)).json()
        const info = {
            id: idx.toNumber(),
            uri: uri,
            meta: meta,
        }
        if (addr == pbmarket.address) {
            const sinfo = await pbmarket.getSaleInfo(b_addresses[bsc.coin], idx)
            info.price = ethers.utils.formatEther(sinfo[0])
            info.desc = sinfo[1]
            info.seller = sinfo[2]
            info.owner = 'market'
        }
        list.push(info)
    }
    console.log('token list of', addr, list)
    return list
}

async function getSaleList() {
    return await getUserTokenList(bsc.ctrs.pbmarket.address)
}

async function getMyTokenList() {
    return await getUserTokenList(bsc.addr)
}

async function getMySaleList() {}

export default {
    connect_wallet: connect_wallet,
    getMyTokenList: getMyTokenList,
    getSaleList: getSaleList,

    // buyNFT: buyNFT,
    // retreatNFT: retreatNFT,
    // sendToMarket: sendToMarket,
    // setSellInfo: setSellInfo,

}
