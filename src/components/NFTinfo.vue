<template>
  <el-col>
    <el-button class="el-icon-close closeInfo" @click="close"></el-button>
    <el-col>
      <img :src="curNFT.meta.image" />
      <div>
        <p>id : {{ curNFT.id }}</p>

        <div v-if="curNFT.price">
          <p>price: {{ curNFT.price }} {{ curNFT.ptName }}</p>
          <div v-if="curNFT.desc">
            <p>description : {{ curNFT.desc }}</p>
          </div>
          <div v-else>
            <p>description : nothing</p>
          </div>
        </div>
      </div>
      <div v-if="curNFT.owner">
        <div v-if="curNFT.seller">
          <el-button @click="saleDialog = true">Set Price</el-button>
          <el-button @click="retreat">Retreat</el-button>
        </div>
        <div v-else>
          <div v-if="allow < curNFT.price">
            <el-button @click="approve">approve</el-button>
          </div>
          <div v-else>
            <el-button @click="buy">Buy</el-button>
          </div>
        </div>
      </div>
      <div v-else>
        <el-button @click="send">Sell</el-button>
      </div>

      <el-dialog
        :visible.sync="saleDialog"
        title="Setting"
        :append-to-body="true"
        center
      >
        <label for="decription" class="labels">Description</label>
        <el-input
          type="text"
          placeholder="input description"
          v-model="nftDesc"
          maxlength="50"
          show-word-limit
          id="description"
        />
        <label for="price" class="labels"
          >Price
          <el-select v-model="priceToken" class="selectToken">
            <el-option key="BNB" label="BNB" value="BNB"></el-option>
            <el-option key="BUSD" label="BUSD" value="BUSD"></el-option>
          </el-select>
        </label>
        <el-input
          type="text"
          placeholder="input price"
          v-model="nftPrice"
          maxlength="20"
          show-word-limit
          id="price"
        />
        <span slot="footer"> <el-button @click="save">Save</el-button> </span>
      </el-dialog>
    </el-col>
  </el-col>
</template>
<script>
import { mapState } from "vuex";
import market from "../market";
export default {
  computed: mapState({
    coin: "coin",
    baddr: "baddr",
    userList: "userList",
    nftDialog: false,
    curNFT: "curNFT",
    NFTinfo: "NFTinfo",
    allow: "allow",
  }),
  data() {
    return {
      priceToken: "BNB",
      saleDialog: false,
      nftDesc: this.$store.state.curNFT.decs,
      nftPrice: this.$store.state.curNFT.price,
    };
  },
  methods: {
    close: function () {
      this.$store.commit("setNFTinfo", false);
    },
    get_lists: async function () {
      const list = await market.getMyTokenList(this.coin, this.baddr);
      const slist = await market.getSaleList(this.coin);
      let mSlist = [];
      for (let i = 0; i < slist.length; i++) {
        if (slist[i].seller == "-self") {
          mSlist.push(slist[i]);
        }
      }
      const lists = [];
      lists.push(list, slist, mSlist);
      this.$store.commit("setNFTlists", lists);
    },
    send: async function () {
      const curNFT = this.$store.state.curNFT;
      const id = curNFT.id;
      const tx = await market.sendToMarket(this.coin, id);
      const loading = this.$loading({
        lock: true,
        spinner: "el-icon-loading",
        background: "rgba(200,230,200,0.6)",
      });
      const obj = this;
      market.waitSendDone(tx, async function (tx, evt) {
        await obj.get_lists();
        loading.close();
        obj.$store.commit("setNFTinfo", false);
      });
    },
    save: async function () {
      const curNFT = this.$store.state.curNFT;
      const id = curNFT.id;
      if (this.nftPrice === 0 || this.nftPrice == null) {
        this.$message("price is empty");
      }
      await market.setSellInfo(
        this.coin,
        id,
        this.priceToken,
        this.nftPrice,
        this.nftDesc
      );
    },
    approve: async function () {
      const curNFT = this.$store.state.curNFT;
      try {
        await market.approveAllow(curNFT);
      } catch (e) {
        if (e.code == 4001) {
          this.$message(e.message);
        }
        console.log("err", e.message);
      }
    },
    buy: async function () {
      const curNFT = this.$store.state.curNFT;
      try {
        await market.buyNFT(this.coin, curNFT);
      } catch (e) {
        if (e.data.code === 3) {
          this.$message(e.data.message);
        }
        console.log("errr", e.data.message);
        // this.$message("error", e.data.message);
      }
    },
    retreat: async function () {
      const curNFT = this.$store.state.curNFT;
      try {
        await market.retreatNFT(this.coin, curNFT);
      } catch (e) {
        this.$message(e.message);
      }
    },
  },
};
</script>
