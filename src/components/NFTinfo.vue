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
        <img
          :src="
            'https://nft-info.plotbridge.io/timg/' +
            this.$store.state.curNFT.id +
            '.svg'
          "
          alt="nft"
        />
        <div>
          <p>id : {{ this.$store.state.curNFT.id }}</p>
          <p>discription : text-discription</p>
          <p>info : nftInfo</p>
        </div>
        <el-button>sale</el-button>
      </el-card>
    </el-col>
  </el-col>
</template>
<script>
import { mapState } from "vuex";
export default {
  computed: mapState({
    coin: "coin",
    baddr: "baddr",
    userList: [],
    nftDialog: false,
    curNFT: {},
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
  },
};
</script>