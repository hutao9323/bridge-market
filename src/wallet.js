import {
    ethers
} from 'ethers'
import pb_abi from './pb-abi.json'
import market_abi from './market-abi.json'

const bsc = {}

const bconst = {}

const USE_TESTNET = true

if(USE_TESTNET){
    bconst.chainId = "0x61"
    bconst.chainName = 'BSC Testnet'
    bconst.chainNetName = 'bnbt'
    bconst.chainNCSymbol = 'TBNB'
    bconst.chainRpcUrl = 'https://data-seed-prebsc-1-s1.binance.org:8545/'
    bconst.chainExplorerUrl = 'https://testnet.bscscan.com'
    bconst.market_address = '0xb8EE32c0fe5C7ec0E400c9c7140Ef278168BD308'
}else{
    // const b_chainId = '0x38'
    // const b_chainName = 'BSC Mainnet'
    // const b_chainNetName = 'bnb'
    // const b_chainNCSymbol = 'BNB'
    // const b_chainRpcUrl = 'https://bsc-dataseed.binance.org'
    // const b_chainExplorerUrl = 'https://bscscan.com'
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
                console.log("111")
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
                    console.log('333')
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
        bsc.prefix = coin.toLowerCase()
        bsc.provider = new ethers.providers.Web3Provider(window.ethereum, "any")
        const neterr = await ensure_network()
        if (neterr) throw neterr
        await bsc.provider.send("eth_requestAccounts", [])
        if (coin in b_xaddresses) {
            bsc.wcoin_address = b_xaddresses[coin]
        } else {
            return false
        }
        if (coin in coin_types) {
            bsc.coin_type = coin_types[coin]
        } else {
            return false
        }
        bsc.signer = bsc.provider.getSigner()
        bsc.addr = await bsc.signer.getAddress()
        bsc.market = new ethers.Contract(bconst.market_address, market_abi, bsc.signer)
        const pb_address = await bsc.market.tokenAddress()
        bsc.pb = new ethers.Contract(pb_address, pb_abi, bsc.signer)
        console.log('pb', bsc.pb)
        console.log('market', bsc.market)
        if(commit){
            commit("setBaddr", bsc.addr)
        }
        return bsc.addr
    }
    return false
}

export default {
    connect: connect
}
