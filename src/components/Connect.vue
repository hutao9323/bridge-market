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
              <li
                draggable="true"
                @dragstart="dragstart($event, nft)"
                @dragend="dragend"
                v-for="nft in PBTlists"
                :key="nft.id"
              >
                <el-button class="nftlist" @click="openNFT(nft)">
                  <img v-if="nft.meta" :src="nft.meta.image" />
                  {{ nft.id }}
                </el-button>
              </li>
            </ul>
            <el-button size="medium">mint</el-button>
          </el-col>
          <el-col class="userW">
            <p>PBX</p>
            <ul>
              <li
                v-for="nft in PBXlists"
                :key="nft.uri"
                @drop="drop"
                @dragover.prevent
              >
                <el-button @click="openNFT(nft)" class="nftlist">
                  <img v-if="nft.meta" :src="nft.meta.image" />
                  {{ nft.id }}
                  <p v-if="dragData">{{ dragData }}</p>
                </el-button>
              </li>
            </ul>
          </el-col>
          <el-col><Redeem /> </el-col>
        </el-col>
        <el-dialog title="NFTinfo" :visible.sync="diaNFT">
          <el-card v-if="curNFT && curNFT.meta">
            <img :src="curNFT.meta.image" :alt="curNFT.id" />
            <p>id: {{ curNFT.id }}</p>
            <p>{{ dragData }}</p>
          </el-card>
        </el-dialog>
      </el-col>
    </el-col>
  </el-col>
</template>

<script>
import { mapState } from "vuex";
import market from "../market";
import Redeem from "./Redeem.vue";

export default {
  components: {
    Redeem,
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
      rAmount: 0,
      dragData: null,
    };
  },
  methods: {
    dragstart: function (event, nft) {
      event.dataTransfer.setData("nft", nft.id);
    },
    drop: function (event) {
      this.dragData = event.dataTransfer.getData("nft");
    },
    dragend: function (event) {
      event.dataTransfer.clearData();
    },
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

    openNFT: async function (nft) {
      this.$store.commit("setCurNFT", nft);
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

    mintNFT: async function () {
      //铸造NFT====PBT
    },
    refreshList: async function () {
      await this.getlist();
    },
  },
};
</script>
