import {
    ethers
} from 'ethers'
import token_abi from './token-abi.json'
import market_abi from './market-abi.json'
import pb_abi from './pb-abi.json'

const bconst = {}
const bsc = {}
const bnet = {}

const USE_TESTNET = true
if (USE_TESTNET) {
    bconst.chainId = "0x61"
    bconst.chainName = 'BSC Testnet'
    bconst.chainNetName = 'bnbt'
    bconst.chainNCSymbol = 'TBNB'

    bconst.chainRpcUrl = 'https://data-seed-prebsc-1-s1.binance.org:8545/'
    bconst.chainExplorerUrl = 'https://testnet.bscscan.com'
    bconst.market_address = '0x43210194d8f939Ab57A2d18c6775e9Cb60cfE33d'

    bnet.chainRpcUrl = 'https://bsc-dataseed.binance.org'
    bnet.chainExplorerUrl = 'https://bscscan.com'

    bconst.pbx_address = "0x586B2Fb0d0D22E86acEf622A1F9170312182f7a7"
    bconst.pbt_address = "0x1dE49f4BfAEFA123238eC620792975f0Ee09F404"
    bnet.xcc_address = '0xD98ebD2073b389558005683262B241749B1C5655'
    bnet.xch_address = '0xFdF2F0995663a993A16929CeC5c39B039AB18Ef6'
    bnet.hdd_address = '0xFfB8F22732e7fC4550a8Cda5DB03cCcCF082b357'
} else {
    // bnet.chainId = '0x38'
    // bnet.chainName = 'BSC Mainnet'
    // bnet.chainNetName = 'bnb'
    // bnet.chainNCSymbol = 'BNB'
    // bnet.chainRpcUrl = 'https://bsc-dataseed.binance.org'
    // bnet.chainExplorerUrl = 'https://bscscan.com'
    // b_xcc_address = '0x24D7ec172b331c7636a5Ca604de890996e5e2028'
    // b_xch_address = '0x8fCD852147d1BbA1C4f4dFf07880cCB25DD36DD7'
    // b_hdd_address = '0xfEe42Eff2DBBdB18F3CF5dCe30139fB853A835A2'
}
// 桥的合约地址
const pb_addrs = {
    'XCC': bnet.xcc_address,
    'XCH': bnet.xch_address,
    'HDD': bnet.hdd_address
}
// PBmarket合约地址
const m_addrs = {
    "PBX": bconst.pbx_address,
    "PBT": bconst.pbt_address
}

async function switch_network() {
    try {
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
                        
                        
                        rpcUrl: [bnet.chainRpcUrl],
                        rpcUrl: [bconst.chainRpcUrl],
                        
                        
                        blockExplorerUrl: bconst.chainExplorerUrl,
                    }])
            } catch (addError) {
                console.log('addError', addrError)

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

async function connect_wallet(bcoin, mcoin, commit) {
    if (typeof window.ethereum !== "undefined") {
        bsc.prefix = bcoin.toLowerCase()
        bsc.provider = new ethers.providers.Web3Provider(window.ethereum, "any")
        const neterr = await ensure_network()
        if (neterr) throw neterr
        await bsc.provider.send("eth_requestAccounts", [])
        bsc.signer = bsc.provider.getSigner()
        bsc.addr = await bsc.signer.getAddress()
        console.log("bsc.addr = ", bsc.addr)

        bsc.pb = {}
        bsc.market = new ethers.Contract(bconst.market_address, market_abi, bsc.signer)
        // bcoin ：XCC， XCH， XDD
        // mcoin : PBX, PBT
        bsc.bcoin = bcoin
        bsc.mcoin = mcoin
        if (mcoin in m_addrs) {
            bsc.pb[mcoin] = new ethers.Contract(m_addrs[mcoin], pb_abi, bsc.signer)
        } else {
            console.log('bsc.pbcoin')
            return false
        }
        if (bcoin in b_addrs) {
            bsc.contract_addr = b_addrs[bcoin]
        } else {
            console.log('bsc.contract_addr')
            return false
        }
        bsc.ctr = new ethers.Contract(bsc.contract_addr, token_abi, bsc.signer)
        bsc.decimals = await bsc.ctr.decimals()
        bsc.xbalance = await token_balance(true)


        commit("setXbalance", await token_balance())
        commit("setBcoin", bcoin)
        commit('setMcoin', mcoin)
        commit("setBaddr", bsc.addr)

        return bsc.addr

    }
    return false
}

export default {
    connect_wallet: connect_wallet
}
