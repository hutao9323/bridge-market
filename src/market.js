import {
    ethers
} from 'ethers'
import pb_abi from './pb-abi.json'
import market_abi from './market-abi.json'

const bsc = {}

const bconst = {}



const USE_TESTNET = true
if (USE_TESTNET) {
    bconst.chainId = "0x61"
    bconst.chainName = 'BSC Testnet'
    bconst.chainNetName = 'bnbt'
    bconst.chainNCSymbol = 'TBNB'
    bconst.pbt_address = "0x050fe2d85B12e394D190aC20939CC6f12B0012B2"
    bconst.pbx_address = "0x586B2Fb0d0D22E86acEf622A1F9170312182f7a7"
    bconst.chainRpcUrl = 'https://data-seed-prebsc-1-s1.binance.org:8545/'
    bconst.chainExplorerUrl = 'https://testnet.bscscan.com'
    bconst.market_address = '0x43210194d8f939Ab57A2d18c6775e9Cb60cfE33d'
} else {
    // const b_chainId = '0x38'
    // const b_chainName = 'BSC Mainnet'
    // const b_chainNetName = 'bnb'
    // const b_chainNCSymbol = 'BNB'
    // const b_chainRpcUrl = 'https://bsc-dataseed.binance.org'
    // const b_chainExplorerUrl = 'https://bscscan.com'
}
const b_addresses = {
    "PBX": bconst.pbx_address,
    "PBT": bconst.pbt_address
}
async function switch_network() {
    try {
        console.log(parseInt(bconst.chainId))
        await bsc.provider.send('wallet_switchEthereumChain', [{
            chainId: bconst.chainId
        }])
    } catch (switchError) {
        const ChainNotExist = 4902
        // This error code indicates that the chain has not been added to MetaMask.
        if (switchError.code === ChainNotExist) {
            try {
                await bsc.provider.send(
                    'wallet_addEthereumChain',
                    [{
                        chainId: bconst.chainId,
                        chainName: bconst.chainName,
                        nativeCurrency: {
                            name: bconst.chainNCSymbol,
                            symbol: bconst.chainNCSymbol,
                            decimals: 18
                        },
                        rpcUrls: [bconst.chainRpcUrl],
                        blockExplorerUrls: [bconst.chainExplorerUrl]
                    }])
            } catch (err) {
                // console.log('addError',err)
                return addError
            }
        } else {
            console.log('switchError')
            return switchError
        }
    }
    return false
}

async function ensure_network() {
    const network = await bsc.provider.getNetwork()
    bsc.provider.on('network', (newNetwork, oldNetwork) => {
        if (oldNetwork) {
            window.location.reload()
            return false
        }
    })
    if (network.chainId != parseInt(bconst.chainId)) {
        const err = await switch_network()
        if (err) return err
    }
    if (network.chainId == parseInt(bconst.chainId) && network.name == bconst.chainNetName) {
        return false
    }
}

async function connect(coin, commit) {
    if (typeof window.ethereum !== 'undefined') {
        bsc.provider = new ethers.providers.Web3Provider(window.ethereum, "any")
        const neterr = await ensure_network()
        if (neterr) throw neterr
        await bsc.provider.send("eth_requestAccounts", [])
        bsc.signer = bsc.provider.getSigner()
        bsc.addr = await bsc.signer.getAddress()
        console.log(b_addresses)
        bsc.nft_addr = b_addresses[coin]
        console.log("nft_addr", bsc.nft_addr)
        bsc.market = new ethers.Contract(bconst.market_address, market_abi, bsc.signer)
        bsc.pb = {}
        bsc.coin = coin
        for (coin in b_addresses) {
            bsc.pb[coin] = new ethers.Contract(bsc.nft_addr, pb_abi, bsc.signer)
            console.log("bsc.pb" + [coin], bsc.pb[coin])
        }
        console.log("bsc.pb", bsc.pb)
        if (coin in b_addresses) {
            console.log("coin", coin)
            bsc.nft_addr = b_addresses[coin]
        } else {
            return false
        }
        // const pb_address = bconst.pbt_address
        // console.log('pb-addr', pb_address)
        // bsc.pb = new ethers.Contract(bsc.nft_addr, pb_abi, bsc.signer)
        console.log('market', bsc.market)
        if (commit) {
            commit("setBaddr", bsc.addr)
            commit("setCoin", coin)
        }
        return bsc.addr
    }
    return false
}

async function getMySaleList() {
    // TODO: show tokens selling by me
}

async function getUserTokenList(addr) {
    const coin = bsc.coin
    const pb = bsc.pb[coin]
    console.log("111", addr, pb)
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
            console.log(bsc.nft_addr)

            const sinfo = await bsc.market.getSaleInfo(bsc.nft_addr, idx)
            console.log(1)

            info.price = ethers.utils.formatEther(sinfo[0])
            console.log(2)

            info.desc = sinfo[1]
            info.seller = sinfo[2]
            info.owner = 'market'
            console.log(3)

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

async function sendToMarket(id) {
    const coin = bsc.coin
    const pb = bsc.pb[coin]
    const res = await pb["safeTransferFrom(address,address,uint256)"](bsc.addr, bconst.market_address, id)
    console.log('transfer receipt', res)
}

async function setSellInfo(id, price, desc) {
    const res = await bsc.market.onSale(bsc.nft_addr, id, ethers.utils.parseEther(price), desc)
    console.log('set sell info receipt', res)
}


async function buyNFT(nft) {
    const price = await ethers.utils.parseEther(nft.price)
    const id = ethers.BigNumber.from(nft.id)
    const res = await bsc.market.buy(bsc.nft_addr, id, {
        value: price
    })
    console.log('buy receipt', res)
}

async function retreatNFT(nft) {
    const res = await bsc.market.offSale(bsc.nft_addr, nft.id)
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