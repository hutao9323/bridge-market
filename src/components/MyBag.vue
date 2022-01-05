<template>
  <el-row>
    <el-col>
      <p>
        My Bag
        <el-button
          class="el-icon-refresh"
          circle
          size="small"
          type="primary"
          @click="refreshB"
        ></el-button>
      </p>
      <el-col class="userW">
        <ul>
          <li v-for="nft in this.$store.state.userList" :key="nft.token_id">
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
    curNFT: {},
  }),
  data() {
    return {
      nftInfo: false,
    };
  },
  methods: {
    openNFT: async function (nft) {
      this.$store.commit("setCurNFT", nft);
      console.log(this.$store.state.curNFT);
      this.nftInfo = true;
    },
    refreshB: async function () {
      const loading = this.$loading({
        lock: true,
        spinner: "el-icon-loading",
        background: "rgba(200,230,200,0.6)",
      });
      const list = await market.getMyTokenList(this.baddr);
      this.$store.commit("setUserList", list);
      console.log("this user list = ", this.$store.state.userList);
      loading.close();
    },
  },
};
</script>