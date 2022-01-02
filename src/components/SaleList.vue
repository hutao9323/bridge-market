<template>
  <el-col>
    <el-col v-if="baddr">
      <p>
        <span>{{ baddr.substr(0, 6) + "..." + baddr.substr(-4, 4) }}</span>
      </p>
      <el-col>
        <p>Market On Sale</p>
          <ul>
            <li v-for="nft in nftList" :key="nft.token_id">
              <el-button class="nftlist" @click="openNFT(nft)">
                <img :src="nft.meta.image"/>{{ nft.id }}
              </el-button>
            </li>
          </ul>
      </el-col>
    </el-col>
    <el-col class="nftInfo" v-if="showInfo">
      <NFTinfo />
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
    curNFT: {},
  }),
  data() {
    return {
      showInfo: false,
      sall: false,
    };
  },
  methods: {
    openNFT: async function (nft) {
      this.$store.commit("setCurNFT", nft);
      console.log(this.$store.state.curNFT);
      this.showInfo = true;
    },
  },
};
</script>
