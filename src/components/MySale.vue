<template>
  <el-col>
    <el-col>
      <ul>
        <li v-for="li in this.$store.state.mySaleList" :key="li.id"></li>
      </ul>
    </el-col>
    <el-col>
      <el-dialog title="saling" :visible.sync="mysall">
        <el-card>
          <p>img</p>
          <p>amount</p>
          <p>description</p>
        </el-card>
      </el-dialog>
    </el-col>
  </el-col>
</template>
<script>
import market from "../market";
import { mapState } from "vuex";
export default {
  computed: mapState({
    curNFT: "curNFT",
  }),
  data() {
    return {
      mysall: false,
    };
  },
  methods: {
    openNFT: async function (nft) {
      this.$store.commit("setCurNFT", nft);
      console.log(this.$store.state.curNFT);
      //   this.showInfo = true;
    },
  },
};
</script>