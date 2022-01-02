<template>
  <el-col>
    <el-col v-if="showInfo">
      <el-col>
        <h5>
          nftInfo
          <el-button
            size="mini"
            class="el-icon-close"
            @click="closeNFT"
          ></el-button>
        </h5>
      </el-col>
      <el-card>
        <img :src="curNFT.meta.image" />
        <div>
          <p>id : {{ curNFT.id }}</p>
          <p>description : {{ curNFT.desc }}</p>
          <p v-if="curNFT.price">price: {{ curNFT.price }} </p>
        </div>
        <div v-if="curNFT.owner">
            <div v-if="curNFT.seller">
                <el-button @click="sale">sale</el-button>
                <el-button @click="retreat">Retreat</el-button>
            </div>
            <div v-else>
                <el-button @click="buy">Buy</el-button>
            </div>
        </div>
        <div v-else>
            <el-button @click="send">send</el-button>
        </div>
      </el-card>
    </el-col>
  </el-col>
</template>
<script>
import { mapState } from "vuex";
import market from '../market';
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
    };
  },
  methods: {
    closeNFT: function () {
      this.showInfo = true;
    },
    send: async function () {
        const id = this.curNFT.id
        console.log('id', id)
        await market.sendToMarket(id)
    },
    sale: async function () {
        const id = this.curNFT.id
        console.log('id', id)
        await market.setSellInfo(id, '0.01', 'A good start')
    },
    buy: async function () {
        console.log('buy id', this.curNFT.id)
        await market.buyNFT(this.curNFT)
    },
    retreat: async function () {
        console.log('retreat id', this.curNFT.id)
        await market.retreatNFT(this.curNFT)
    }
  },
};
</script>
