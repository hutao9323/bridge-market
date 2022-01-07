<template>
  <el-col>
    <el-col v-if="!baddr" class="user">
      <el-button round @click="connect_wallet" class="connect">
        connect wallet
      </el-button>
    </el-col>
    <el-col v-else>
      <el-col>
        <h4>NFT list</h4>
        <el-col class="userW">
          <ul>
            <li v-for="item in 4" :key="item">
              <el-button @click="openItem(item)">Pbt{{ item }}</el-button>
            </li>
          </ul>
        </el-col>
        <el-button @click="openMint = true">Mint</el-button>
        <!-- <el-button>buy from market</el-button> -->
      </el-col>
      <el-col>
        <el-tabs>
          <el-tabs type="border-card">
            <el-tab-pane label="Market">SaleList</el-tab-pane>
            <el-tab-pane label="my sale">MaSale</el-tab-pane>
          </el-tabs>
        </el-tabs>
      </el-col>

      <el-dialog :visible.sync="openMint" title="Mint NFT">
        <el-button> mint </el-button>
      </el-dialog>
      <el-dialog :visible.sync="diaNFT">
        <el-button>openNFT</el-button>
        <el-button>sale</el-button>
      </el-dialog>
      <dialog></dialog>
    </el-col>
  </el-col>
</template>

<script>
import { mapState } from "vuex";
import con from "../connect.js";
import MySale from "./MySale.vue";
import SaleList from "./SaleList.vue";

export default {
  components: {
    MySale,
    SaleList,
  },
  computed: mapState({
    baddr: "baddr",
  }),
  data() {
    return {
      loading: false,
      openMint: false,
      diaNFT: false,
      bbb: 0,
    };
  },
  methods: {
    connect_wallet: async function () {
      try {
        const bsc = await con.connect_wallet();
        this.$store.commit("setBaddr", bsc.addr);
        const mylist = await con.getMyTokenList();
        console.log("my list ", mylist);
        const sList = await con.getSaleList();
        console.log("market list", sList);
      } catch (error) {
        console.log("error", error);
      }
    },
    openItem: function (item) {
      this.diaNFT = true;
      this.i = item;
    },
  },
};
</script>
