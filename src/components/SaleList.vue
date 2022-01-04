<template>
  <el-col>
    <el-col v-if="baddr">
      <!-- <p>
        <span>{{ baddr.substr(0, 6) + "..." + baddr.substr(-4, 4) }}</span>
      </p> -->
      <el-col>
        <p>Market On Sale</p>
        <ul>
          <li v-for="nft in nftList" :key="nft.token_id">
            <el-button
              class="nftlist"
              @click="openNFT(nft)"
              v-if="nft.price != 0.0"
            >
              <img :src="nft.meta.image" />
              <el-badge v-if="nft.seller" value="Mine" class="item">
                <span>{{ nft.id }}</span>
              </el-badge>
              <span v-else>{{ nft.id }}</span>
            </el-button>
          </li>
        </ul>
      </el-col>
    </el-col>
    <el-col class="nftInfo">
      <el-dialog title="Now Selling" :visible.sync="selling">
        <el-card><NFTinfo /></el-card>
      </el-dialog>
    </el-col>
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
    nftList: "saleList",
    nftDialog: false,
    curNFT: "curNFT",
  }),
  data() {
    return {
      selling: false,
    };
  },
  methods: {
    openNFT: async function (nft) {
      if (nft.seller || parseFloat(nft.price) > 0) {
        this.$store.commit("setCurNFT", nft);
        console.log("setCurNFT", this.$store.state.curNFT);
        this.selling = true;
      } else {
        this.$alert("价格为0,不可购买。请联系卖家修改价格。");
      }
    },
  },
};
</script>
