<template>
  <el-row>
    <el-col>
      <!-- <p>{{ coin }}</p> -->
      <el-col class="userW">
        <ul>
          <li v-for="nft in userList" :key="nft.token_id">
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
        :visible.sync="nftInfo"
        width="50%"
        height="500px"
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
    userList: "userList",
    coin: "coin",
  }),
  data() {
    return {
      nftInfo: false,
    };
  },
  methods: {
    openNFT: async function (nft) {
      this.$store.commit("setCurNFT", nft);
      this.nftInfo = true;
    },
  },
};
</script>