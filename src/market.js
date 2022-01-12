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

async function getMyTokenList(coin) {
    return await getUserTokenList(coin2pb(coin), bsc.addr)
}

async function tokenBalance(tokenAddr){
    const ctr = pbwallet.erc20_contract(tokenAddr)
    const balance = await ctr.balanceOf(bsc.addr)
    console.log('token balance', tokenAddr, balance)
    const decimals = await ctr.decimals()
    return ethers.utils.formatUnits(balance, decimals)
}

async function tokenAllowance(tokenAddr){
    const ctr = pbwallet.erc20_contract(tokenAddr)
    const allowance = await ctr.allowance(bsc.addr, bsc.ctrs.tokenredeem.address)
    const decimals = await ctr.decimals()
    console.log('token allowance', tokenAddr, allowance)
    return ethers.utils.formatUnits(allowance, decimals)
}

async function tokenApprove(tokenAddr){
    const ctr = pbwallet.erc20_contract(tokenAddr)
    const supply = await ctr.totalSupply()
    await ctr.approve(bsc.ctrs.tokenredeem.address, supply.mul(1000))   // 1000x total supply, almost infinite
}

async function tokenRedeem(tokenAddr, amount){
    const ctr = pbwallet.erc20_contract(tokenAddr)
    const decimals = await ctr.decimals()
    amount = ethers.utils.parseUnits(amount,decimals)
    console.log('redeem amount', amount)
    await bsc.ctrs.tokenredeem.redeem(tokenAddr, amount)
}

export default {
    connect: connect,
    getMyTokenList: getMyTokenList,
    tokenAllowance: tokenAllowance,
    tokenApprove: tokenApprove,
    tokenBalance: tokenBalance,
    tokenRedeem: tokenRedeem,
}
