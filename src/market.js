import {
    ethers
} from 'ethers'

import pbwallet from 'pbwallet'

var bsc = {}

const ptAddrs = {
    'BNB': ethers.constants.AddressZero,
    'BUSD': ethers.utils.getAddress('0x78867bbeef44f2326bf8ddd1941a4439382ef2a7')
}

async function connect() {
    bsc = await pbwallet.connect(true)
    if (bsc) {
        return bsc.addr
    }
    return false
}

function priceName(token) {
    token = ethers.utils.getAddress(token)
    for (var k in ptAddrs) {
        if (ethers.utils.getAddress(ptAddrs[k]) == token) {
            return k
        }
    }
    return false
}

async function getUserTokenList(pb, addr) {
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
            info.ptName = priceName(sinfo[0])
            info.price = ethers.utils.formatEther(sinfo[1])
            info.desc = sinfo[2]
            info.seller = sinfo[3]
            info.owner = 'market'
        }
        if (pb === bsc.ctrs.pbt) {
            const pbxs = await bsc.ctrs.pbconnect.getPBXList(info.id)
            if (pbxs.length > 0) {
                console.log('PBX for', info.id, pbxs)
                info.coinTypes = await bsc.ctrs.pbx.getCoinTypes(pbxs)
            }
        }
        list.push(info)
    }
    console.log('token list of', addr, list)
    return list
}

function coin2pb(coin) {
    if (coin == 'PBT') return bsc.ctrs.pbt
    if (coin == 'PBX') return bsc.ctrs.pbx
    throw new Error('Unsupported coin:' + coin)
}

async function getSaleList(coin) {
    // console.log("coin", coin, bsc.ctrs.pbmarket.address)
    return await getUserTokenList(coin2pb(coin), bsc.ctrs.pbmarket.address)
}

async function getMyTokenList(coin) {
    return await getUserTokenList(coin2pb(coin), bsc.addr)
}

async function sendToMarket(coin, id) {
    const pb = coin2pb(coin)
    const res = await pb["safeTransferFrom(address,address,uint256)"](bsc.addr, bsc.ctrs.pbmarket.address, id)
    console.log('transfer receipt', res)
    return res
}

async function waitSendDone(tx, done) {
    const ctr = pbwallet.erc721_contract(tx.to)
    ctr.on(ctr.filters.Transfer, function (evt) {
        if (evt.transactionHash == tx.hash) {
            done(tx, evt)
            ctr.off(ctr.filters.Transfer) //TODO: how to deal with overlap txs?
            console.log('tx confirmed')
        }
    })
}

async function setSellInfo(coin, id, ptName, price, desc) {
    const pb = coin2pb(coin)
    var ptAddr = ptAddrs[ptName]
    if (!ptAddr) {
        ptAddr = ethers.constants.AddressZero
    }
    console.log('onSale', pb.address, id, ptAddr, ethers.utils.parseEther(price), desc)
    const res = await bsc.ctrs.pbmarket.onSale(pb.address, id, ptAddr, ethers.utils.parseEther(price), desc)
    console.log('set sell info receipt', res)
}
async function checkAllowance(nft) {
    const priceToken = nft.priceToken
    const options = {}
    if (priceToken == ethers.constants.AddressZero) {
        options.value = price
    }
    const price = await ethers.utils.parseEther(nft.price)
    const ctr = pbwallet.erc20_contract(priceToken)
    const allow = await ctr.allowance(bsc.addr, bsc.ctrs.pbmarket.address)
    if (allow.lt(price)) {
        return false
    }
    return allow
}
async function approveAllow() {
    // uint256_MAX, priceToken_ctr.totalSupply()
    const res = await ctr.approve(bsc.ctrs.pbmarket.address, price.mul(1000000))
    res.fn = 'approve'
    return res


}
async function buyNFT(coin, nft) {
    const pb = coin2pb(coin)
    const price = await ethers.utils.parseEther(nft.price)
    const priceToken = nft.priceToken
    const id = ethers.BigNumber.from(nft.id)
    console.log('buy', pb, "id", id, priceToken, price)
    const options = {}
    if (priceToken == ethers.constants.AddressZero) {
        options.value = price
    } else {
        // check allowance
        const allow = await checkAllowance(nft)
        console.log("allow", allow)
        if (allow.lt(price)) { // not enough allowance, approve first
            const res = await approveAllow()
            console.log("res", res) // TODO: approve can use MAX_UINT256 for infinity
            res.fn = 'approve'
            // we need to wait for approve confirmed by BSC network, so return and let user buy again
            // TODO: show "Approve" in button when allowance not enough, then show "Buy" when allowance enough
            // TODO: check ERC20 balance then buy
            return res
        }
    }
    const res = await bsc.ctrs.pbmarket.buy(pb.address, id, options)
    res.fn = 'buy'
    return res
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
    setSellInfo: setSellInfo,
    waitSendDone: waitSendDone,
    checkAllowance: checkAllowance,
    approveAllow: approveAllow,
}