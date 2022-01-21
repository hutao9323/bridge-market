<template>
  <el-col id="BindWaddr">
    <el-card>
      <el-input placeholder="请输入取款地址" v-model="waddr"></el-input>
      <el-button @click="bindWaddr"> Bind Withdraw Address</el-button>
    </el-card>
  </el-col>
</template>
<script>
import { mapState } from "vuex";
import market from "../market";
export default {
  name: "BindWaddr",
  computed: mapState({
    balance: "balance",
    curNFT: "curNFT",
    PBTlists: "PBTlists",
    PBXlists: "PBXlists",
    baddr: "baddr",
  }),
  data() {
    return {
      waddr: "",
    };
  },
  methods: {
    bindWaddr: async function () {
      console.log("curNFT", this.curNFT);
      //根据输入的地址前缀xcc/xch/hdd 生成 cointype 从而找到需要绑定取款地址的id
      let key = "";
      const prefix = this.waddr.substr(0, 3);
      console.log("prefix", prefix);
      if (prefix == "xcc") {
        key = "3";
      } else if (prefix == "xch") {
        key = "1";
      } else if (prefix == "hdd") {
        key = "2";
      } else {
        return false;
      }
      //   const pbxId = this.curNFT.pbxs[key].id;
      const pbxId = this.curNFT.id;
      const addr = this.waddr;
      console.log("pbxID", pbxId, addr);
      //   try {
      await market.bindAddr(addr, pbxId);
      //   } catch (e) {
      // console.log("bindaddr err", e.messaeg);
      //   }
    },
  },
};
</script>