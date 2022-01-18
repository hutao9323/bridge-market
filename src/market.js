import {
    ethers
} from 'ethers'

import pbwallet from 'pbwallet'

var bsc = {}

const ptAddrs = {
    'BNB': ethers.constants.AddressZero,
    'BUSD': ethers.utils.getAddress('0x78867bbeef44f2326bf8ddd1941a4439382ef2a7')
}

async function listenNFTEvents(ctr, list, commit) {
    ctr.on(ctr.filters.Transfer, function (evt) {
        // console.log("listen evt", evt)
        if (evt.args.to == bsc.addr && evt.args.to == bsc.ctrs.pbmarket.to) { // transfer in   PBXRetreat
            // [{nft0}, {nft1}]
            console.log("listen list0 =", list, evt, evt.args.tokenId)

        } else if (evt.args.from == bsc.addr && evt.args.from == bsc.ctrs.pbmarket.to) { // transfer out PBXBind
            console.log("listen list1 =", list, evt, evt.args.tokenId)

            // } else if (evt.args.to == bsc.ctrs.pbmarket.to) { // on sale
            //     console.log("listen list2 =", list, evt, evt.args.tokenId)

            // } else if (evt.args.from == bsc.ctrs.pbmarket.to) { // bought or offsale
            //     console.log("listen list3 =", list, evt, evt.args.tokenId)
        }
    })
}

function pbInList(id, list) {
    for (var i in list) {
        const item = list[i]
        if (item.id == id) {
            return i
        }
    }
    return false
}
//数组去重
function unique(arr) {
    return Array.from(new Set(arr))
}
async function getCoinTypes(pbxid) {
    const cointype = await bsc.ctrs.pbx.getCoinTypes([pbxid])
    return cointype
}
async function listenEvents(commit) {

    listenNFTEvents(bsc.ctrs.pbt, bsc.nftlists.pbt, function (newlist) {
        newlist = bsc.nftlists.pbt
        console.log("pbt=list", newlist)
        commit('setPBTlists', newlist)
    })
    listenNFTEvents(bsc.ctrs.pbx, bsc.nftlists.pbx, function (newlist) {
        newlist = bsc.nftlists.pbx
        console.log("pbx=list", newlist)

        commit('setPBXlists', newlist)
    })
    if (bsc.ctrs.pbconnect.filters.PBXBind) {
        bsc.ctrs.pbconnect.on(bsc.ctrs.pbconnect.filters.PBXBind, async function (evt) {
            // if PBTid in PBTList, update my PBT info

            const index = pbInList(evt.args.pbtId.toNumber(), bsc.nftlists.pbt)
            const coinTy = await getCoinTypes(evt.args.pbxId)

            if (index) {
                const pbtnft = bsc.nftlists.pbt[index]

                if ('coinTypes' in pbtnft) {

                    const type = pbtnft.coinTypes.includes(coinTy[0])
                    console.log("type", type, coinTy[0], "cointype type", pbtnft.coinTypes)

                    if (!type) {

                        pbtnft.coinTypes.push(coinTy[0])
                        console.log("pntnft", bsc.nftlists.pbt[index])
                        // commit("setPBTlists", bsc.nftlists.pbt)

                    }

                } else {
                    pbtnft.coinTypes = coinTy
                    bsc.nftlists.pbt.splice(index, 1)
                    bsc.nftlists.pbt.push(pbtnft)
                    console.log('bind cointypes', pbtnft, "bsc.nftlists", bsc.nftlists.pbt)
                }
                console.log("bind pbt nft", bsc.nftlists.pbt)
                commit("setPBTlists", bsc.nftlists.pbt)

            }
            const xIndex = pbInList(evt.args.pbxId.toNumber(), bsc.nftlists.pbx)

            if (xIndex) {
                bsc.nftlists.pbx.splice(xIndex, 1)
                console.log("bind pbx nft", bsc.nftlists.pbx)
                commit("setPBXlists", bsc.nftlists.pbx)
            }
            bsc.ctrs.pbconnect.off(bsc.ctrs.pbconnect.filters.PBXBind)
        })
    }
    if (bsc.ctrs.pbconnect.filters.PBXRetreat) {
        bsc.ctrs.pbconnect.on(bsc.ctrs.pbconnect.filters.PBXRetreat, async function (evt) {
            // if PBTid in PBTList, update my PBT info
            console.log("retreat listen evt", evt, "args", evt.args)

            const index = pbInList(evt.args.pbtId.toNumber(), bsc.nftlists.pbt)
            const coinTy = await getCoinTypes(evt.args.pbxId)

            if (index) {
                const pbtnft = bsc.nftlists.pbt[index]
                //判断 coinTypes 中是否含有 coinTy
                const type = pbtnft.coinTypes.indexOf(coinTy[0])
                console.log("re type=", type)
                // cointTypes[type] = true
                // Object.keys(coinTypes)
                if (type != false)
                    if (pbtnft.coinTypes.length > 1) {
                        //查找cointypes中cointy的位置
                        // const tyIndex = pbtnft.coinTypes.indexof(coinTy[0])
                        pbtnft.coinTypes.splice(type, 1)
                        console.log("retreat cointypes", pbtnft.coinTypes, bsc.nftlists.pbt)
                        // commit("setPBTlists", bsc.nftlists.pbt)

                    } else {
                        delete(pbtnft.coinTypes)

                        bsc.nftlists.pbt.splice(index, 1)
                        bsc.nftlists.pbt.push(pbtnft)
                        console.log("re cointy", pbtnft.coinTypes, bsc.nftlists.pbt)
                        // commit("setPBTlists", bsc.nftlists.pbt)

                    }
                commit("setPBTlists", bsc.nftlists.pbt)

                console.log("retreat pbt nft=", bsc.nftlists.pbt)

            }
            const xIndex = pbInList(evt.args.pbxId.toNumber(), bsc.nftlists.pbx)
            console.log("retread xIndex", xIndex)

            if (!xIndex) {
                const pb = bsc.ctrs.pbx
                const id = evt.args.pbxId
                console.log("retreat pbx id", id, evt.args.pbxId)
                const uri = await pb.tokenURI(id)
                const meta = await (await fetch(uri)).json()
                const item = {
                    id: id.toNumber(),
                    uri: uri,
                    meta: meta
                }
                console.log("item", item)
                bsc.nftlists.pbx.push(item)
                bsc.nftlists.pbx = Array.from(new Set(bsc.nftlists.pbx))
                console.log("pbx retreat list push", bsc.nftlists.pbx)
                commit("setPBXlists", bsc.nftlists.pbx)

            }
            console.log("retreat evt done,bsc.nftlists =", bsc.nftlists)
            bsc.ctrs.pbconnect.off(bsc.ctrs.pbconnect.filters.PBXRetreat)
        })
    }

}

async function connect(commit) {
    bsc = await pbwallet.connect(true)
    bsc.nftlists = {
        pbt: [], // initial load all owned PBT
        pbx: [], // initial load all owned PBX
    }
    if (bsc) {
        console.log("bsc", bsc)
        await listenEvents(commit)
        return bsc.addr
    }
    console.log("bsc", bsc)
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
    // console.log('user', addr, 'has', cnt, 'tokens')
    const list = []
    for (var i = 0; i < cnt; i++) {
        const idx = await pb.tokenOfOwnerByIndex(addr, i)
        console.log("idx=", idx)
        const uri = await pb.tokenURI(idx)
        const meta = await (await fetch(uri)).json()
        const info = {
            id: idx.toNumber(),
            uri: uri,
            meta: meta,
        }
        if (pb === bsc.ctrs.pbt) {
            const pbxs = await bsc.ctrs.pbconnect.PBXList(info.id)

            if (pbxs.length > 0) {
                info.coinTypes = await bsc.ctrs.pbx.getCoinTypes(pbxs)
                console.log('pnnnnnnn', info.id, pbxs, info.coinTypes)
            }
        }
        list.push(info)
    }

    // console.log('token list of', addr, list, )
    return list
}

function coin2pb(coin) {
    if (coin == 'PBT') return bsc.ctrs.pbt
    if (coin == 'PBX') return bsc.ctrs.pbx
    throw new Error('Unsupported coin:' + coin)
}

async function getMyTokenList(coin) {
    if (coin == "PBT") bsc.nftlists.pbt = await getUserTokenList(coin2pb(coin), bsc.addr)
    if (coin == "PBX") bsc.nftlists.pbx = await getUserTokenList(coin2pb(coin), bsc.addr)
    console.log("bsc.nftlist=", bsc.nftlists)
    return await getUserTokenList(coin2pb(coin), bsc.addr)
}

async function tokenBalance(tokenAddr) {
    const ctr = pbwallet.erc20_contract(tokenAddr)
    const balance = await ctr.balanceOf(bsc.addr)
    console.log('token balance', tokenAddr, balance)
    const decimals = await ctr.decimals()
    return ethers.utils.formatUnits(balance, decimals)
}

async function tokenAllowance(tokenAddr) {
    const ctr = pbwallet.erc20_contract(tokenAddr)
    const allowance = await ctr.allowance(bsc.addr, bsc.ctrs.tokenredeem.address)
    const decimals = await ctr.decimals()
    console.log('token allowance', tokenAddr, allowance)
    return ethers.utils.formatUnits(allowance, decimals)
}

async function tokenApprove(tokenAddr) {
    const ctr = pbwallet.erc20_contract(tokenAddr)
    const supply = await ctr.totalSupply()
    await ctr.approve(bsc.ctrs.tokenredeem.address, supply.mul(1000)) // 1000x total supply, almost infinite
}

async function tokenRedeem(tokenAddr, amount) {
    const ctr = pbwallet.erc20_contract(tokenAddr)
    const decimals = await ctr.decimals()
    amount = ethers.utils.parseUnits(amount, decimals)
    console.log('redeem amount', amount)
    await bsc.ctrs.tokenredeem.redeem(tokenAddr, amount)
}

async function bindTX(pbx_id, pbt) {
    const pbtId = ethers.utils.hexZeroPad(ethers.utils.hexValue(ethers.BigNumber.from(pbt.id)), 32)
    console.log("pbtid", pbtId, "pbx", pbx_id)
    try {
        const res = await bsc.ctrs.pbx["safeTransferFrom(address,address,uint256,bytes)"](bsc.addr, bsc.ctrs.pbconnect.address, pbx_id, pbtId)
        console.log('bindTX receive', res)
        // await listenEvents()

        return res
    } catch (e) {
        let text = e.message
        if ('data' in e) {
            if ('message' in e.data) {
                text = e.data.message
            }
        }
        return text
    }
}
async function mintPBT() {
    try {
        const mintfee = await bsc.ctrs.pbt.mintFee()
        const options = {}
        if (mintfee[0] == ethers.constants.AddressZero) {
            options.value = mintfee[1]
        } else {
            const ctr = pbwallet.erc20_contract(mintfee[0])
            const allow = await ctr.allowance(bsc.addr, bsc.ctrs.pbt.address)
            console.log(" approve statrt", mintfee[1].gt(allow))
            if (mintfee[1].gt(allow)) {
                const reciept = await ctr.approve(bsc.ctrs.pbt.address, mintfee[1].mul(10000))
                console.log("mint approve", reciept)
            }
        }
        const res = await bsc.ctrs.pbt.mint(options)
        // await listenEvents()

        console.log("mint res", res)
    } catch (e) {
        let text = e.message
        if ('data' in e) {
            if ('message' in e.data) {
                text = e.data.message
            }
        }
        return text
    }
}
async function waitEventDone(tx, done) {
    const ctr = pbwallet.erc721_contract(tx.to)

    ctr.on(ctr.filters.Transfer, function (evt) {
        if (evt.transactionHash == tx.hash) {
            done(tx, evt)
            ctr.off(ctr.filters.Transfer)
        }
    })
}
//查询绑定关系 PBT--PBX 
async function sesrchlist() {

}
async function getPBXaddr(pbtid) {
    try {
        const addrlist = await bsc.ctrs.pbconnect.XAddressList(pbtid)
        console.log('addrlist', addrlist)
        return addrlist
    } catch (e) {
        console.log("e", e.message)
    }
}
// 解除绑定
async function unbind(pbtid, cointype) {
    const pbconnect = bsc.ctrs.pbconnect
    try {
        const pbxlist = await pbconnect.PBXList(pbtid)
        // const cointypes = await bsc.ctrs.pbx.getCoinTypes(pbxlist)
        console.log("pbxlist", pbxlist, typeof pbxlist, "cointypes", cointype)
        if (pbxlist.length >= 1) {
            for (let i = 0; i < pbxlist.length; i++) {
                const pbcoin = await bsc.ctrs.pbx.getCoinTypes([pbxlist[i]])
                console.log("pbcoin", pbcoin)
                if (pbcoin == cointype) {
                    const pbxid = parseInt(pbxlist[i])
                    console.log("unbinding with pbxID", pbcoin, pbxid)
                    const res = await pbconnect.retreat(pbxid)
                    console.log("unbind res", res)
                    return res
                }
            }
        }
        // await listenEvents()
    } catch (e) {
        console.log("onbound error", e.message)
    }

}
export default {
    connect: connect,
    bindTX: bindTX,
    getMyTokenList: getMyTokenList,
    tokenAllowance: tokenAllowance,
    tokenApprove: tokenApprove,
    tokenBalance: tokenBalance,
    tokenRedeem: tokenRedeem,
    unbind: unbind,
    getPBXaddr: getPBXaddr,
    mintPBT: mintPBT,
    waitEventDone: waitEventDone,
}