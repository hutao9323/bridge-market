<template>
  <el-col>
    <el-col>
      <ul>
        <li
          v-for="nft in this.$store.state.mySaleList"
          :key="nft.id"
          @click="openNFT(nft)"
        >
          <el-button>
            <img :src="nft.meta.image" :alt="nft.id" />{{ nft.id }}</el-button
          >
        </li>
      </ul>
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
      console.log(this.$store.state.curNFT);
      this.mysale = true;
    },
  },
};
</script>