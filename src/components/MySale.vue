<template>
  <el-col>
    <el-col>
      <el-col class="userW">
        <!-- <p>{{ coin }}</p> -->
        <ul>
          <li v-for="nft in mySaleList" :key="nft.id">
            <el-button class="nftlist" @click="openNFT(nft)">
              <img :src="nft.meta.image" :alt="nft.id" />{{ nft.id }}</el-button
            >
          </li>
        </ul>
      </el-col>
    </el-col>
    <el-col>
      <el-dialog
        title="Selling"
        :visible="NFTinfo"
        :show-close="false"
        :modal-append-to-body="false"
      >
        <el-card><NFTinfo /></el-card>
      </el-dialog>
    </el-col>
  </el-col>
</template>
<script>
import market from "../market";
import { mapState } from "vuex";
import NFTinfo from "./NFTinfo.vue";
export default {
  components: {
    NFTinfo,
  },
  computed: mapState({
    curNFT: "curNFT",
    mySaleList: "mySaleList",
    NFTinfo: "NFTinfo",
  }),
  watch: {
    mySaleList: function (newList) {
      this.$store.commit("setMySaleList", newList);
    },
  },
  data() {
    return {
      // showC: false,
    };
  },
  methods: {
    openNFT: async function (nft) {
      this.$store.commit("setCurNFT", nft);
      console.log("nft", nft.desc);
      this.$store.commit("setNFTinfo", true);
    },
  },
};
</script>