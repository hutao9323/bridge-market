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
            <li v-for="item in userList" :key="item">
              <el-button @click="openItem(item)">
                <img :src="item.meta.image" alt="img" />
                {{ item.id }}
              </el-button>
            </li>
          </ul>
          <el-button @click="mintNFT">Mint</el-button>
        </el-col>
        <!-- <el-button>buy from market</el-button> -->
      </el-col>
      <el-col>
        <el-tabs type="border-card">
          <el-tab-pane label="Market">
            <el-col class="userW">
              <p>
                Market
                <el-button
                  circle=""
                  class="el-icon-refresh"
                  size="mini"
                  @click="refreshList"
                ></el-button>
              </p>
              <ul v-for="item in saleList" :key="item">
                <li v-if="item.price != 0">
                  <el-button @click="openMk(item)">
                    <img :src="item.meta.image" alt="img" />
                    <el-badge v-if="item.seller" value="Mine" class="item">
                      <span>{{ item.id }}</span>
                    </el-badge>
                  </el-button>
                </li>
              </ul>
            </el-col>
          </el-tab-pane>
          <el-tab-pane label="My sale">
            <el-col class="userW">
              <p>
                My Sale
                <el-button
                  circle=""
                  class="el-icon-refresh"
                  size="mini"
                  @click="refreshList"
                ></el-button>
              </p>
              <ul>
                <li v-for="item in mySaleList" :key="item">
                  <el-button @click="openMk(item)">
                    <img :src="item.meta.image" alt="img" />
                    {{ item.id }}
                  </el-button>
                </li>
              </ul>
            </el-col>
          </el-tab-pane>
        </el-tabs>
      </el-col>

      <el-dialog :visible.sync="openMint" title="Mint NFT">
        <el-button> mint </el-button>
      </el-dialog>
      <el-dialog :visible.sync="diaNFT">
        <el-button>Open</el-button>
        <el-button @click="sell">Sell</el-button>
      </el-dialog>
      <el-dialog :visible.sync="marketNFT" title="info">
        <el-card><NFTinfo /></el-card>
      </el-dialog>
    </el-col>
  </el-col>
</template>

<script>
import { mapState } from "vuex";
import con from "../connect.js";
import NFTinfo from "./NFTinfo.vue";

export default {
  components: {
    NFTinfo,
  },
  computed: mapState({
    baddr: "baddr",
    curNFT: "curNFT",
    userList: "userList",
    saleList: "saleList",
    mySaleList: "mySaleList",
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
    getlist: async function () {
      const commit = this.$store.commit;
      const mylist = await con.getMyTokenList();
      commit("setUserList", mylist);
      const sList = await con.getSaleList();
      commit("setSaleList", sList);
      let mSlist = [];
      const sl = this.$store.state.saleList;
      for (let i = 0; i < sl.length; i++) {
        if (sl[i].seller == true) {
          mSlist.push(sl[i]);
          commit("setMySaleList", mSlist);
        }
      }
      console.log("0000");
    },
    connect_wallet: async function () {
      try {
        const commit = this.$store.commit;
        const bsc = await con.connect_wallet();
        commit("setBaddr", bsc.addr);
        this.getlist();
      } catch (error) {
        console.log("error", error);
      }
    },
    openItem: function (item) {
      this.diaNFT = true;
      this.$store.commit("setCurNFT", item);
    },
    sell: async function () {
      const curNFT = this.$store.state.curNFT;
      const id = curNFT.id;
      await con.sendToMarket(id);
    },

    mintNFT: async function () {
      //铸造NFT====PBT
    },
    refreshList: async function () {
      this.getlist();
    },
  },
};
</script>
