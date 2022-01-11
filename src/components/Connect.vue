<template>
  <el-col>
    <el-col v-if="!baddr" class="user">
      <el-button round @click="connect_wallet" class="connect">
        connect wallet
      </el-button>
    </el-col>
    <el-col v-else class="user">
      <el-col>
        <el-col>
          <el-button
            @click="load_lists"
            class="el-icon-refresh refresh"
            circle
          ></el-button>
          <el-col class="userW">
            <p>PBT</p>
            <ul>
              <li draggable="true" v-for="nft in PBTlists[0]" :key="nft.id">
                <el-button class="nftlist" @click="openNFT(nft)">
                  <img :src="nft.meta.image" />
                  {{ nft.id }}
                </el-button>
              </li>
            </ul>
            <el-button size="medium">mint</el-button>
          </el-col>
          <el-col class="userW">
            <p>PBX</p>
            <ul>
              <li v-for="nft in PBXlists[0]" :key="nft.uri">
                <el-button @click="openNFT(nft)" class="nftlist">
                  <img :src="nft.meta.image" />
                  {{ nft.id }}
                </el-button>
              </li>
            </ul>
          </el-col>
        </el-col>
      </el-col>
      <!-- <el-col class="user">
        <el-tabs type="border-card">
          <el-tab-pane>
            <span slot="label"> Market </span>
            <SaleList />
          </el-tab-pane>
          <el-tab-pane>
            <span slot="label"> My Sale </span>
            <MySale />
          </el-tab-pane>
        </el-tabs>
      </el-col> -->
    </el-col>
  </el-col>
</template>

<script>
import { mapState } from "vuex";
import market from "../market";
import NFTinfo from "./NFTinfo";

export default {
  components: {
    NFTinfo
  },
  computed: mapState({
    coin: "coin",
    baddr: "baddr",
    curNFT: "curNFT",
    PBTlists: "PBTlists",
    PBXlists: "PBXlists",
  }),
  watch: {
    PBTlists: function (newLists) {
      this.$store.commit("setPBTlists", newLists);
    },
    PBXlists: function (newLists) {
      this.$store.commit("setPBXlists", newLists);
    },
  },
  data() {
    return {
      loading: false,
      openMint: false,
      diaNFT: false,
    };
  },
  methods: {
    get_lists: async function () {
      const list = await market.getMyTokenList("PBT", this.baddr);
      const slist = await market.getSaleList("PBT");
      let mSlist = [];
      for (let i = 0; i < slist.length; i++) {
        if (slist[i].seller == "-self") {
          mSlist.push(slist[i]);
        }
      }
      const tlists = [];
      tlists.push(list, slist, mSlist);
      this.$store.commit("setPBTlists", tlists);

      const xlist = await market.getMyTokenList("PBX", this.baddr);
      const xSlist = await market.getSaleList("PBX");
      let xMSlist = [];
      for (let i = 0; i < xSlist.length; i++) {
        if (xSlist[i].seller == "-self") {
          xMSlist.push(xSlist[i]);
        }
      }
      const xlists = [];
      xlists.push(xlist, xSlist, xMSlist);
      this.$store.commit("setPBXlists", xlists);

      console.log("xlists", this.$store.state.PBXlists);
    },

    openNFT: async function (nft) {
      this.$store.commit("setCurNFT", nft);
      this.$store.commit("setNFTinfo", true);
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
    connect_wallet: async function () {
      const commit = this.$store.commit;
      const loading = this.$loading({
        lock: true,
        spinner: "el-icon-loading",
        background: "rgba(200,230,200,0.6)",
      });
      try {
        const addr = await market.connect();
        if (addr) {
          commit("setBaddr", addr);
          await this.get_lists();
        }
      } catch (e) {
        this.$message(e.message);
        loading.close();
      }
      loading.close();
    },

    openItem: function (item) {
      this.diaNFT = true;
      this.$store.commit("setCurNFT", item);
    },
    sell: async function () {
      const curNFT = this.$store.state.curNFT;
      const id = curNFT.id;
      await market.sendToMarket(id);
    },

    mintNFT: async function () {
      //铸造NFT====PBT
    },
    refreshList: async function () {
      this.getlist();
    },
  },
};
</script>
