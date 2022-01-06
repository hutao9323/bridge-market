<template>
  <el-col>
    <el-col v-if="!baddr" class="user">
      <el-button round @click="connect_wallet" class="connect">
        connect wallet
      </el-button>
    </el-col>
    <el-col v-else>
      {{ baddr }}
    </el-col>
    <!-- <el-col v-else class="user">
      <el-tabs type="border-card">
        <el-tab-pane>
          <span slot="label">
            Market
            <i>
              <el-button
                class="el-icon-refresh"
                circle
                size="mini"
                @click="refreshM"
              ></el-button>
            </i>
          </span>
          <SaleList />
        </el-tab-pane>
        <el-tab-pane>
          <span slot="label">
            My Bag
            <i>
              <el-button
                class="el-icon-refresh"
                circle
                size="mini"
                @click="refreshB"
              ></el-button>
            </i>
          </span>
          <MyBag />
        </el-tab-pane>
        <el-tab-pane>
          <span slot="label">
            My Sale
            <i>
              <el-button
                class="el-icon-refresh"
                circle
                size="mini"
                @click="refreshS"
              ></el-button>
            </i>
          </span>
          <MySale />
        </el-tab-pane>
      </el-tabs>
    </el-col> -->
  </el-col>
</template>

<script>
import { mapState } from "vuex";
import market from "../market";
import NFTinfo from "./NFTinfo";
import SaleList from "./SaleList.vue";
import MyBag from "./MyBag.vue";
import MySale from "./MySale.vue";
import connect from "../connect";

export default {
  components: {
    NFTinfo,
    SaleList,
    MyBag,
    MySale,
  },
  computed: mapState({
    mcoin: "mcoin",
    bcoin: "bcoin",
    baddr: "baddr",
    userList: "userList",
    curNFT: "curNFT",
  }),
  data() {
    return {
      showInfo: false,
      sall: false,
      loading: false,
    };
  },
  methods: {
    connect_wallet: async function () {
      const commit = this.$store.state.commit;
      const state = this.$store.state;
      try {
        await connect.connect_wallet(state.bcoin, state.mcoin, commit);
      } catch (error) {
        console.log("error", error);
      }
    },
  },
};
</script>
