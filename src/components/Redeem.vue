<template>
  <el-col class="user">
    <p>redeem-test</p>
    <p>balance:{{ balance }}</p>
    <div v-if="needApprove">
        <el-button @click="approve">Approve</el-button>
    </div>
    <div v-else>
        <el-input placeholder="input amount" v-model="rAmount"></el-input>
        <el-button @click="reAll">All</el-button>
        <el-button @click="redeem">Redeem</el-button>
    </div>
  </el-col>
</template><script>
import market from "../market";
import { mapState } from "vuex";
export default {
  computed: mapState({
    balance: "redeemBalance",
    needApprove(state) {
        const a = parseFloat(state.redeemAllowance)
        const b = parseFloat(state.redeemBalance)
        if(a==0||b>=a){
            return true
        }
        return false
    }
  }),
  data() {
    return {
      rAmount: 0,
    };
  },
  methods: {
    approve: async function () {
        const oldToken = '0x134315EF3D11eEd8159fD1305af32119a046375A'
        await market.tokenApprove(oldToken)
        //TODO: watch tokenRedeem events
    },
    reAll: function () {
      this.rAmount = this.balance;
    },
    redeem: async function () {
      const oldToken = '0x134315EF3D11eEd8159fD1305af32119a046375A'
      await market.tokenRedeem(oldToken, this.rAmount)
        //TODO: watch tokenRedeem events
    },
  },
};
</script>
