import {
    ethers
} from 'ethers'

import pbwallet from 'pbwallet'

var bsc = {}

async function connect() {
    bsc = await pbwallet.connect(true)
    if(bsc){
        return bsc.addr
    }
    return false
}

async function getUserTokenList(pb,addr) {
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
        if (addr == bsc.ctrs.pbmarket.address) {
            const sinfo = await bsc.ctrs.pbmarket.getSaleInfo(pb.address, idx)
            info.priceToken = sinfo[0]
            info.price = ethers.utils.formatEther(sinfo[1])
            info.desc = sinfo[2]
            info.seller = sinfo[3]
            info.owner = 'market'
        }
        list.push(info)
    }
    console.log('token list of', addr, list)
    return list
}

function coin2pb(coin){
    if(coin=='PBT') return bsc.ctrs.pbt
    if(coin=='PBX') return bsc.ctrs.pbx
    throw new Error('Unsupported coin:'+coin)
}

async function getSaleList(coin) {
    return await getUserTokenList(coin2pb(coin), bsc.ctrs.pbmarket.address)
}

async function getMyTokenList(coin) {
    return await getUserTokenList(coin2pb(coin), bsc.addr)
}

async function sendToMarket(coin, id) {
    const pb = coin2pb(coin)
    const res = await pb["safeTransferFrom(address,address,uint256)"](bsc.addr, bsc.ctrs.pbmarket.address, id)
    console.log('transfer receipt', res)
}

async function setSellInfo(coin, id, price, desc) {
    const pb = coin2pb(coin)
    //TODO: set ERC20 price 
    console.log('onSale',pb.address, id, ethers.constants.AddressZero, ethers.utils.parseEther(price), desc)
    const res = await bsc.ctrs.pbmarket.onSale(pb.address, id, ethers.constants.AddressZero, ethers.utils.parseEther(price), desc)
    console.log('set sell info receipt', res)
}

async function buyNFT(coin, nft) {
    const pb = coin2pb(coin)
    const price = await ethers.utils.parseEther(nft.price)
    const id = ethers.BigNumber.from(nft.id)
    console.log('buy', pb, id, price)
    const res = await bsc.ctrs.pbmarket.buy(pb.address, id, {
        value: price
    })
    console.log('buy receipt', res)
}

async function retreatNFT(coin, nft) {
    const pb = coin2pb(coin)
    const res = await bsc.ctrs.pbmarket.offSale(pb.address, nft.id)
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
