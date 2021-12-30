<template>
  <div>
    <el-button round @click="connect" class="connect">
      connect wallet
    </el-button>
  </div>
</template>

<script>
import { mapState } from "vuex";
import wops from "../wallet";
export default {
  computed: mapState({
    baddr: "baddr",
    xbalance: "xbalance",
    coin: "coin",
  }),
  data() {
    return {};
  },
  methods: {
    connect: async function () {
      const commit = this.$store.commit;
      const loading = this.$loading({
        lock: true,
        spinner: "el-icon-loading",
        background: "rgba(200, 230, 200, 0.7)",
      });
      try {
        const addr = await wops.connect(this.$store.state.coin, commit);
        if (!addr) {
          if (!this.coin) {
            this.$message(this.$t("no-coin"));
          } else {
            this.$message(this.$t("connect-faild"));
          }
        }
      } catch (e) {
        if (e.code === -32601) {
          this.$message("wrong network");
        } else {
          this.$message(e.message);
        }
      }
      loading.close();
    },
  },
};
</script>
