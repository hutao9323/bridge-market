<template>
  <el-col>
    <img :src="curNFT.meta.image" />
    <div>
      <p>id : {{ curNFT.id }}</p>

      <div v-if="curNFT.price">
        <p>price: {{ curNFT.price }} BNB</p>
        <div v-if="curNFT.desc">
          <p>description : {{ curNFT.desc }}</p>
        </div>
        <div v-else>
          <p>description : nothing</p>
        </div>
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
    curNFT: "curNFT",
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
      await market.sendToMarket(id);
    },
    sell: async function () {
      const curNFT = this.$store.state.curNFT;
      const id = curNFT.id;
      if (this.nftPrice === 0 || this.nftPrice == null) {
        this.$message("price is empty");
      }
      await market.setSellInfo(id, this.nftPrice, this.nftDesc);
    },
    buy: async function () {
      const curNFT = this.$store.state.curNFT;
      await market.buyNFT(curNFT);
    },
    retreat: async function () {
      const curNFT = this.$store.state.curNFT;
      await market.retreatNFT(curNFT);
    },
  },
};
</script>
