<template>
  <el-col>
    <p>
      MY PBT NFT
      <el-button circle icon="el-icon-refresh"></el-button>
    </p>
    <el-col>
      <ul>
        <li v-for="(nft, name) in this.mylist" :key="name">
          <el-button class="nftlist">
            <el-badge
              v-if="nft.pbxs"
              :value="Object.keys(nft.pbxs).length"
              class="item"
            >
              <i>#{{ nft.id }}</i>
              <img v-if="nft.meta" :src="nft.meta.image" alt="img" />
            </el-badge>
            <el-badge v-if="nft.seller == '-self'" value="On Sale" class="item">
              <i>#{{ nft.id }}</i>
              <img v-if="nft.meta" :src="nft.meta.image" alt="img" />
            </el-badge>
          </el-button>
        </li>
      </ul>
    </el-col>
    <el-col>
      <el-pagination
        background
        layout="total,prev,pager,next"
        :total="Object.keys(PBTMyLists).length"
        @current-change="handleCurrentChange"
        :current-page="this.pageNum"
        :page-size="5"
      ></el-pagination>
    </el-col>
  </el-col>
</template>
<script>
import { mapState } from "vuex";
export default {
  computed: mapState({
    coin: "coin",
    baddr: "baddr",
    curNFT: "curNFT",
    PBTlists: "PBTlists",
    PBXlists: "PBXlists",
    PBXSellingLists: "PBXSellingLists",
    PBTSellingLists: "PBTSellingLists",
    PBTMySaleLists: "PBTMySaleLists",
    WBalance: "WBalance",
  }),
  watch: {
    PBTlists: function (newLists) {
      this.$store.commit("setPBTlists", newLists);
    },
    deep: true,
    PBXlists: function (newLists) {
      this.$store.commit("setPBXlists", newLists);
    },
    deep: true,
    PBTMySaleLists: function (newLists) {
      this.$store.commit("setPBTMySaleLists", newLists);
    },
    deep: true,
    PBTMyLists: function (newLists) {
      this.PBTMyLists = newLists;
      console.log("NEW", newLists);
    },
    deep: true,
  },
  mounted() {
    this.$nextTick(function () {
      const state = this.$store.state;
      this.list1 = state.PBTlists;
      this.list2 = state.PBTMySaleLists;
      Object.assign(this.PBTMyLists, this.list1, this.list2);
      this.mylist = Object.fromEntries(
        Object.entries(this.PBTMyLists).slice(0, 5)
      );
    });
    
  },
  data() {
    return {
      list1: {},
      list2: {},
      mylist: {},
      PBTMyLists: {},
      pageNum: 1,
    };
  },
  methods: {
    handleCurrentChange(newPage) {
      console.log("当前页:", newPage);
      this.pageNum = newPage;
      console.log("all pbtlist", this.mylist);
      const start = newPage * 5 - 5;
      const down = newPage * 5;
      this.mylist = Object.fromEntries(
        Object.entries(this.PBTMyLists).slice(start, down)
      );
    },
  },
};
</script>