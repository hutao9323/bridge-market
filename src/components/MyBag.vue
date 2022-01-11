<template>
  <el-row>
    <el-col>
      <!-- <p>{{ coin }}</p> -->
      <el-col class="userW">
        <ul>
          <li v-for="nft in NFTlists[0]" :key="nft.token_id">
            <el-button class="nftlist" @click="openNFT(nft)">
              <img :src="nft.meta.image" />
              {{ nft.id }}
            </el-button>
          </li>
        </ul>
      </el-col>
    </el-col>
    <el-col class="nftInfo">
      <el-dialog
        title="NFT Info"
        :visible="NFTinfo"
        width="50%"
        height="500px"
        :show-close="false"
        :modal-append-to-body="false"
      >
        <el-card><NFTinfo /></el-card>
      </el-dialog>
    </el-col>
  </el-row>
</template>
<script>
import NFTinfo from "./NFTinfo.vue";
import market from "../market";
import { mapState } from "vuex";
export default {
  components: {
    NFTinfo,
  },
  computed: mapState({
    curNFT: "curNFT",
    coin: "coin",
    NFTinfo: "NFTinfo",
    NFTlists: "NFTlists",
  }),
  watch: {
    NFTlists: async function (newList) {
      this.$store.commit("setNFTlists", newList);
    },
  },
  data() {
    return {
      showC: false,
    };
  },
  methods: {
    
    openNFT: async function (nft) {
      this.$store.commit("setCurNFT", nft);
      this.$store.commit("setNFTinfo", true);
    },
  },
};
</script>