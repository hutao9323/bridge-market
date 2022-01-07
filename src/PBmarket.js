// import {
//     ethers
// } from 'ethers'
// import pb_abi from './pb-abi.json'
// import market_abi from './market-abi.json'
import {
    connect
} from 'pbwallet'
import con from './connect'

async function getUserTokenList(addr) {
    const coin = bsc.coin
    const pb = bsc.pb[coin]
    const cnt = await pb.balanceOf(addr)
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
        if (addr == bconst.market_address) {
            const sinfo = await bsc.market.getSaleInfo(b_addresses[bsc.coin], idx)
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
    return await getUserTokenList(bconst.market_address)
}

async function getMyTokenList() {
    return await getUserTokenList(bsc.addr)
}

async function getMySaleList() {
    // TODO: show tokens selling by me
}

async function sendToMarket(id) {
    const coin = bsc.coin
    const pb = bsc.pb[coin]
    const res = await pb["safeTransferFrom(address,address,uint256)"](bsc.addr, bconst.market_address, id)
    console.log('transfer receipt', res)
}

async function setSellInfo(id, price, desc) {
    const res = await bsc.market.onSale(b_addresses[bsc.coin], id, ethers.utils.parseEther(price), desc)
    console.log('set sell info receipt', res)
}


async function buyNFT(nft) {
    const price = await ethers.utils.parseEther(nft.price)
    const id = ethers.BigNumber.from(nft.id)
    const res = await bsc.market.buy(b_addresses[bsc.coin], id, {
        value: price
    })
    console.log('buy receipt', res)
}

async function retreatNFT(nft) {
    const res = await bsc.market.offSale(b_addresses[bsc.coin], nft.id)
    console.log('retreat receipt', res)
}

export default {
    buyNFT: buyNFT,
    connect: connect,
    getMyTokenList: getMyTokenList,
    getSaleList: getSaleList,
    retreatNFT: retreatNFT,
    sendToMarket: sendToMarket,
    setSellInfo: setSellInfo
}