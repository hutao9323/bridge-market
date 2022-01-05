<template>
  <el-col>
    <img :src="this.$store.state.curNFT.meta.image" />
    <div>
      <p>id : {{ this.$store.state.curNFT.id }}</p>

      <div v-if="this.$store.state.curNFT.price">
        <p>price: {{ this.$store.state.curNFT.price }} BNB</p>
        <p>description : {{ this.$store.state.curNFT.desc }}</p>
      </div>
    </div>
    <div v-if="this.$store.state.curNFT.owner">
      <div v-if="this.$store.state.curNFT.seller">
        <el-button @click="saleDialog = true">Set Price</el-button>
        <el-button @click="retreat">Retreat</el-button>
      </div>
      <div v-else>
        <el-button @click="buy">Buy</el-button>
      </div>
    </div>
    <div v-else>
      <el-button @click="send">Sale</el-button>
    </div>
    <el-dialog :visible.sync="saleDialog" title="Setting" append-to-body center>
      <label for="decription" class="labels">Description</label>

      <el-input
        type="text"
        placeholder="input description"
        v-model="nftDesc"
        maxlength="50"
        show-word-limit
        id="description"
      />
      <label for="price" class="labels">Price(BNB)</label>
      <el-input
        type="text"
        placeholder="input price"
        v-model="nftPrice"
        maxlength="20"
        show-word-limit
        id="price"
      />
      <el-button @click="sell">Sell</el-button>
    </el-dialog>
  </el-col>
</template>
<script>
import { mapState } from "vuex";
import market from "../market";
export default {
  computed: mapState({
    coin: "coin",
    baddr: "baddr",
    userList: [],
    nftDialog: false,
    curNFT: {},
  }),
  data() {
    return {
      showInfo: true,
      saleDialog: false,
      nftDesc: this.$store.state.curNFT.decs,
      nftPrice: this.$store.state.curNFT.price,
    };
  },
  methods: {
    send: async function () {
      const curNFT = this.$store.state.curNFT;
      const id = curNFT.id;
      console.log("id", id);
      await market.sendToMarket(id);
    },
    sell: async function () {
      const curNFT = this.$store.state.curNFT;
      const id = curNFT.id;
      console.log("id", id);

      if (this.nftDesc == null) {
        this.$message("description is empty");
      }
      if (this.nftPrice === 0 || this.nftPrice == null) {
        this.$message("price is empty");
      }
      await market.setSellInfo(id, this.nftPrice, this.nftDesc);
    },
    buy: async function () {
      const curNFT = this.$store.state.curNFT;
      console.log("buy id", curNFT.id);
      await market.buyNFT(curNFT);
    },
    retreat: async function () {
      const curNFT = this.$store.state.curNFT;

      console.log("retreat id", curNFT.id);
      await market.retreatNFT(curNFT);
    },
  },
};
</script>
