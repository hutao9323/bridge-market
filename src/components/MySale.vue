<template>
  <el-col>
    <el-col>
      <p>
        My Sale
        <el-button
          class="el-icon-refresh"
          circle
          size="small"
          type="primary"
          @click="refreshS"
        ></el-button>
      </p>
      <el-col class="userW">
        <ul>
          <li v-for="nft in this.$store.state.mySaleList" :key="nft.id">
            <el-button class="nftlist" @click="openNFT(nft)">
              <img :src="nft.meta.image" :alt="nft.id" />{{ nft.id }}</el-button
            >
          </li>
        </ul>
      </el-col>
    </el-col>
    <el-col>
      <el-dialog title="Selling" :visible.sync="mysale" center>
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
  }),
  data() {
    return {
      mysale: false,
    };
  },
  methods: {
    openNFT: async function (nft) {
      this.$store.commit("setCurNFT", nft);
      // console.log(this.$store.state.curNFT);
      console.log("nft", nft.desc);
      this.mysale = true;
    },
    refreshS: async function () {
      const loading = this.$loading({
        lock: true,
        spinner: "el-icon-loading",
        background: "rgba(200,230,200,0.6)",
      });
      const slist = await market.getSaleList();
      this.$store.commit("setSaleList", slist);
      console.log("sale", slist);
      let mSlist = [];
      const sl = this.$store.state.saleList;
      for (let i = 0; i < sl.length; i++) {
        if (sl[i].seller == true) {
          mSlist.push(sl[i]);
          // console.log("my sale list =", mSlist);
          this.$store.commit("setMySaleList", mSlist);
        }
      }
      loading.close();
    },
  },
};
</script>