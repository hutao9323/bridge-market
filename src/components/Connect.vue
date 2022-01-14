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
                @drop="drop($event, nft)"
                @dragover.prevent
                v-for="nft in PBTlists"
                :key="nft.id"
              >
                <el-button class="nftlist" @click="openNFT(nft)">
                  <span>{{ nft.id }}</span>
                  <img v-if="nft.meta" :src="nft.meta.image" />
                  <el-badge
                    v-if="nft.coinTypes"
                    :value="nft.coinTypes.length"
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
                v-for="nft in PBXlists"
                :key="nft.uri"
                @dragstart="dragstart($event, nft)"
              >
                <el-button @click="openNFT(nft)" class="nftlist">
                  <img v-if="nft.meta" :src="nft.meta.image" />
                  {{ nft.id }}
                </el-button>
              </li>
            </ul>
          </el-col>
          <el-col><Redeem /> </el-col>
        </el-col>
        <el-dialog title="NFTinfo" :visible.sync="diaNFT" width="80%">
          <el-card v-if="curNFT && curNFT.meta">
            <el-col :span="7">
              <img :src="curNFT.meta.image" :alt="curNFT.id" />
              <p>id: {{ curNFT.id }}</p>
            </el-col>
            <el-col
              style="min-height: 300px"
              v-if="curNFT.coinTypes"
              :span="13"
            >
              <h4>bound:</h4>
              <el-col v-for="coin in curNFT.coinTypes" :key="coin">
                <el-col v-if="coin == 3">
                  <dt>
                    Chives(XCC):
                    <el-button @click="unbind(coin)" size="mini"
                      >Unbind</el-button
                    >
                  </dt>
                  <dd v-if="x_address != null">
                    deposit address : {{ x_address[0] }}
                  </dd>
                </el-col>
                <el-col v-if="coin == 2">
                  <dt>
                    HDDcoin(HDD)<el-button @click="unbind(coin)" size="mini"
                      >Unbind</el-button
                    >
                  </dt>
                  <dd>deposit addr:{{ x_address[0] }}</dd>
                </el-col>
                <el-col v-if="coin == 1">
                  <dt>
                    Chia(XCH)
                    <el-button @click="unbind(coin)" size="mini"
                      >Unbind</el-button
                    >
                  </dt>
                  <dd>deposit:{{ x_address[0] }}</dd>
                </el-col>
              </el-col>
            </el-col>
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
    deep: true,
  },
  data() {
    return {
      loading: false,
      openMint: false,
      diaNFT: false,
      rAmount: 0,
      dragData: null,
      x_address: "",
    };
  },
  methods: {
    dragstart: function (event, nft) {
      event.dataTransfer.clearData("nft");
      // this.clearData();
      event.dataTransfer.setData("nft", nft.id);
      console.log("pbx id = ", nft.id);
    },
    drop: async function (event, nft) {
      const pbxId = event.dataTransfer.getData("nft");
      const loading = this.$loading({
        lock: true,
        spinner: "el-icon-loading",
        backgroundL: "rgba(200,230,200,0.6)",
      });
      //
      const tx = await market.bindTX(pbxId, nft);
      if (tx != "ok") {
        this.$message(tx);
        loading.close();

        return false;
      }
      const obj = this;
      await market.waitEventDone(tx, async function (tx, evt) {
        await obj.get_lists();
      });

      loading.close();
    },
    unbind: async function (coin) {
      const pbtid = this.curNFT.id;
      console.log("unbinddddd", pbtid, coin);
      const loading = this.$loading({
        lock: true,
        spinner: "el-icon-loading",
        background: "rgba(200,230,200,0.6)",
      });
      try {
        const tx = await market.unbind(pbtid, coin);

        const obj = this;
        market.waitEventDone(tx, async function (tx, evt) {
          await obj.get_lists();
          // obj.$store.commit("setNFTinfo")
        });
      } catch (e) {
        if (e.data.code == 3) {
          console.log("unbind err", e.data.message);
        }
        console.log(e.message);
      }
      loading.close();
    },

    openNFT: async function (nft) {
      console.log("open NFT", nft);
      const loading = this.$loading({
        lock: true,
        spinner: "el-icon-loading",
        background: "rgba(200,230,200,0.6)",
      });
      this.$store.commit("setCurNFT", nft);

      if (!nft.coinTypes) {
        loading.close();
        this.diaNFT = true;
        return false;
      } else {
        try {
          const addr = await market.getPBXaddr(nft.id);
          this.x_address = addr[1];
          console.log("pbx addrs", addr);
        } catch (e) {
          console.log("nft addr", e.message);
        }
      }
      loading.close();
      this.diaNFT = true;
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
      }
      loading.close();
    },

    mintNFT: async function () {
      const msg = await market.mintPBT();
      if (msg != "ok") {
        this.$message(msg);
      }
    },
    refreshList: async function () {
      await this.getlist();
    },
  },
};
</script>
