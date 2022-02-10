<template>
  <el-col>
    <el-col v-if="!baddr" class="user">
      <GetAllInfo />
    </el-col>
    <el-container v-else>
      <el-aside width="360px">
        <MineNFT />
      </el-aside>
      <el-main>
        <el-col class="userW">
          <p>
            <span>PBT Market</span>
            <el-button @click="mintNFT" size="mini">Mint PBT</el-button>
          </p>
          <ul>
            <li v-for="(nft, name) in PBTSellingLists" :key="name">
              <el-button class="nftlist">
                <i>#{{ nft.id }}</i>
                <img v-if="nft.meta" :src="nft.meta.image" alt="img" />
                <el-badge
                  v-if="nft.pbxs"
                  :value="Object.keys(nft.pbxs).length"
                  class="item"
                >
                </el-badge>
              </el-button>
            </li>
          </ul>
        </el-col>
        <el-col>
          <el-col>
            <el-button
              @click="load_lists"
              class="el-icon-refresh refresh"
              circle
            ></el-button>
          </el-col>
          <el-col class="userW">
            <p>PBT</p>
            <ul>
              <li
                @drop="drop($event, nft)"
                @dragover.prevent
                v-for="(nft, name) in PBTlists"
                :key="name"
              >
                <el-button class="nftlist" @click="openNFT(nft)">
                  <span>#{{ nft.id }}</span>
                  <img v-if="nft.meta" :src="nft.meta.image" alt="IMG" />
                  <el-badge
                    v-if="nft.pbxs"
                    :value="Object.keys(nft.pbxs).length"
                    class="item"
                  >
                  </el-badge>
                </el-button>
              </li>
            </ul>
            <el-button size="medium" @click="mintNFT">mint</el-button>
          </el-col>
          <el-col class="userW">
            <p>PBX</p>
            <ul>
              <li
                v-for="(nft, name) in PBXlists"
                :key="name"
                @dragstart="dragstart($event, nft)"
              >
                <el-button @click="openNFT(nft)" class="nftlist">
                  <img v-if="nft.meta" :src="nft.meta.image" alt="IMG" />
                  #{{ nft.id }}
                </el-button>
              </li>
            </ul>
          </el-col>
          <el-col><Redeem /> </el-col>
        </el-col> </el-main
    ></el-container>
  </el-col>
</template>

<script>
import { mapState } from "vuex";
import market from "../market";
import GetAllInfo from "./GetAllInfo.vue";
import Redeem from "./Redeem.vue";
import BindWaddr from "./BindWaddr.vue";
import MineNFT from "./MineNFT.vue";

export default {
  components: {
    GetAllInfo,
    Redeem,
    BindWaddr,
    MineNFT,
  },
  computed: mapState({
    coin: "coin",
    baddr: "baddr",
    curNFT: "curNFT",
    PBTlists: "PBTlists",
    PBXlists: "PBXlists",
    PBXSellingLists: "PBXSellingLists",
    PBTSellingLists: "PBTSellingLists",
    PBTMySaleLists: "PBTMySaleLists",
    WBalance: "WBalance",
  }),
  watch: {
    PBTlists: function (newLists) {
      this.$store.commit("setPBTlists", newLists);
    },
    deep: true,
    PBXlists: function (newLists) {
      this.$store.commit("setPBXlists", newLists);
    },
    deep: true,
  },
  data() {
    return {
      loading: false,
      openMint: false,
      diaNFT: false,
      rAmount: 0,
      dragData: null,
      withdrawAmount: 0,
      x_address: "",
    };
  },
  methods: {
    get_lists: async function () {
      const tlist = await market.getMyTokenList("PBT", this.baddr);
      this.$store.commit("setPBTlists", tlist);

      const xlist = await market.getMyTokenList("PBX", this.baddr);
      this.$store.commit("setPBXlists", xlist);

      console.log("xlists", this.$store.state.PBXlists);

      const oldToken = "0x134315EF3D11eEd8159fD1305af32119a046375A";
      const otBalance = await market.tokenBalance(oldToken);
      const otAllowance = await market.tokenAllowance(oldToken);
      this.$store.commit("setRedeemBalance", otBalance);
      this.$store.commit("setRedeemAllowance", otAllowance);
    },
    dragstart: function (event, nft) {
      event.dataTransfer.clearData("nft_id");
      event.dataTransfer.setData("nft_id", nft.id);
    },
    drop: async function (event, nft) {
      const pbxId = event.dataTransfer.getData("nft_id");
      const loading = this.$loading({
        lock: true,
        spinner: "el-icon-loading",
        background: "rgba(200,230,200,0.6)",
      });
      try {
        const tx = await market.bindTX(pbxId, nft);
        const obj = this;
        await market.waitEventDone(tx, async function (tx, evt) {
          // await obj.get_lists();
        });
      } catch (e) {
        console.log("bind err", e.message);
        loading.close();
      }
      loading.close();
    },
    unbind: async function (item) {
      console.log("unbinddddd", item);
      const loading = this.$loading({
        lock: true,
        spinner: "el-icon-loading",
        background: "rgba(200,230,200,0.6)",
      });
      try {
        const tx = await market.unbind(item);
        // const obj = this;
        market.waitEventDone(tx, async function (tx, evt) {
          // await obj.get_lists();
        });
      } catch (e) {
        if (e.data.code == 3) {
          console.log("unbind err", e.data.message);
        }
        console.log(e.message);
      }
      loading.close();
      this.diaNFT = false;
    },
    withdraw: async function () {
      const amount = this.withdrawAmount;
      console.log("to withdraw", amount);
      await market.burnWXCC(amount);
    },
    openNFT: async function (nft) {
      console.log("open NFT", nft);
      // const loading = this.$loading({
      //   lock: true,
      //   spinner: "el-icon-loading",
      //   background: "rgba(200,230,200,0.6)",
      // });
      this.$store.commit("setCurNFT", nft);

      // if (!nft.coinTypes) {
      //   loading.close();
      //   this.diaNFT = true;
      //   return false;
      // } else {
      //   try {
      //     const addr = await market.getPBXaddr(nft.id);
      //     this.x_address = addr[1];
      //     console.log("pbx addrs", addr);
      //   } catch (e) {
      //     console.log("nft addr", e.message);
      //   }
      // }
      // loading.close();
      this.diaNFT = true;
    },

    load_lists: async function () {
      const loading = this.$loading({
        lock: true,
        spinner: "el-icon-loading",
        background: "rgba(200,230,200,0.6)",
      });
      try {
        await this.get_lists();
      } catch (e) {
        this.$message(e.message);
        loading.close();
      }
      loading.close();
    },

    mintNFT: async function () {
      try {
        await market.mintPBT();
      } catch (e) {
        this.$message(e.data.message);
        console.log("mint err", e.message);
      }
    },
  },
};
</script>
