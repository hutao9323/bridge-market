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
  </el-col>
</template>

<script>
import { mapState } from "vuex";
import connect from "../connect";

export default {
  components: {
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
