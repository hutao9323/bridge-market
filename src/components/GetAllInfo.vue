<template>
  <el-col>
    <!-- 获得所有的list 以及 info -->
    <el-col class="user">
      <el-button round @click="connect_wallet" class="connect">
        connect wallet
      </el-button>
    </el-col>
  </el-col>
</template>
<script>
import { mapState } from "vuex";
import market from "../market";
import allData from "../getAllData";
export default {
  components: {},
  computed: mapState({
    addr: "addr",
    PBTlists: "PBTlists",
    PBXlists: "PBXlists",
    PBTSellingLists: "PBTSellingLists",
    PBXSellingLists: "PBXSellingLists",
  }),
  watch: {
    PBTlists: function (new_list) {
      this.$store.commit("setPBTlists", new_list);
    },
    deep: true,
    PBXlists: function (newLists) {
      this.$store.commit("setPBXlists", newLists);
    },
    deep: true,
    PBTSellingLists: function (newLists) {
      this.$store.commit("setPBTSellingList", newLists);
    },
    deep: true,
    PBXSellingLists: function (newLists) {
      this.$store.commit("setPBXSellingList", newLists);
    },
    deep: true,
  },
  data() {
    return {};
  },
  methods: {
    get_lists: async function () {
      const tlist = await allData.getMyTokenList("PBT", this.baddr);
      this.$store.commit("setPBTlists", tlist);

      const xlist = await allData.getMyTokenList("PBX", this.baddr);
      this.$store.commit("setPBXlists", xlist);

      console.log("tlist--xlists", tlist, xlist);
      //market selling list
      const tSaleList = await allData.getSaleList("PBT");
      this.$store.commit("setPBTSellingLists", tSaleList);
      const xSaleList = await allData.getSaleList("PBX");
      this.$store.commit("setPBXSellingLists", xSaleList);
      console.log("saleList", tSaleList, xSaleList);
      //my Sall list
      const tMySaleList = await allData.getMySaleList("PBT");
      this.$store.commit("setPBTMySaleLists", tMySaleList);
      console.log("PBTMySaleLists", tMySaleList);

      const oldToken = "0x134315EF3D11eEd8159fD1305af32119a046375A";
      const otBalance = await market.tokenBalance(oldToken);
      const otAllowance = await market.tokenAllowance(oldToken);
      this.$store.commit("setRedeemBalance", otBalance);
      this.$store.commit("setRedeemAllowance", otAllowance);
    },
    connect_wallet: async function () {
      const commit = this.$store.commit;
      const loading = this.$loading({
        lock: true,
        spinner: "el-icon-loading",
        background: "rgba(200,230,200,0.6)",
      });
      try {
        const bsc = await allData.connectW();
        if (bsc) {
          commit("setBaddr", this.$store.state.bsc.addr);
          await this.get_lists();
          loading.close();
        }
      } catch (e) {
        this.$message(e.message);
      }
      loading.close();
    },
  },
};
</script>