<template>
  <el-col>
    <el-col v-if="!baddr" class="user">
      <el-button round @click="connect" class="connect">
        connect wallet
      </el-button>
    </el-col>
    <el-col v-else class="user">
      <p>
        <span>{{ baddr.substr(0, 6) + "..." + baddr.substr(-4, 4) }}</span>
      </p>
      <el-col>
        <p>My Bag</p>
        <el-col class="userW">
          <ul>
            <li v-for="nft in this.$store.state.userList" :key="nft.token_id">
              <el-button class="nftlist" @click="openNFT(nft)">
                <img
                  :src="
                    'https://nft-info.plotbridge.io/timg/' + nft.id + '.svg'
                  "
                  alt="nft"
                />{{ nft.id }}
              </el-button>
            </li>
          </ul>
          <el-col>
            <el-button @click="sall = true">My Selling</el-button>
          </el-col>
        </el-col>
      </el-col>
      <el-button @click="sale">Sale</el-button>
    </el-col>
    <el-col class="nftInfo" v-if="showInfo">
      <NFTinfo />
    </el-col>
    <el-col>
      <el-dialog title="salling" :visible.sync="sall">
        <el-card>
          <p>img</p>
          <p>amount</p>
          <p>discription</p>
          <el-button>Off Sale</el-button>
        </el-card>
      </el-dialog>
    </el-col>
    <!-- <el-col>
      <el-dialog :visible.sync="nftDialog" title="Wallet">
        <el-button>Sale</el-button>
        <el-button>Open</el-button>
        <el-button>Burn</el-button>
      </el-dialog>
    </el-col> -->
  </el-col>
</template>

<script>
import { mapState } from "vuex";
import market from "../market";
import NFTinfo from "./NFTinfo";
export default {
  components: {
    NFTinfo,
  },
  computed: mapState({
    coin: "coin",
    baddr: "baddr",
    userList: [],
    nftDialog: false,
    curNFT: {},
  }),
  data() {
    return {
      showInfo: false,
      sall: false,
    };
  },
  methods: {
    connect: async function () {
      await market.connect(this.$store.commit);
      const list = await market.getMyTokenList(this.baddr);
      this.$store.commit("setUserList", list);
      console.log("this user list = ", this.$store.state.userList);
      const slist = await market.getSaleList()
      this.$store.commit("setSaleList", slist);
      console.log('sale', slist)
    },
    sale: async function () {
      await market.sendToMarket();
      await market.setSaleInfo();
    },
    openNFT: async function (nft) {
      this.$store.commit("setCurNFT", nft);
      console.log(this.$store.state.curNFT);
      this.showInfo = true;
    },
  },
};
</script>
