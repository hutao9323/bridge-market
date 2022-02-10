import Vue from 'vue'
import Vuex from 'vuex'

// import LoadScript from 'vue-plugin-load-script'

// import PulseLoader from 'vue-spinner/src/PulseLoader.vue'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import "../theme/index.css"
import "./assets/main.css"
import store from './store'
// import "/js/chia-utils.js"


import App from './App.vue'

Vue.use(Vuex)
// Vue.use(LoadScript)
// Vue.LoadScript("https://app.plotbridge.net/js/chia-utils.js")
// Vue.component('pluse-loader', PulseLoader)
Vue.use(ElementUI)
Vue.config.productionTip = false

new Vue({
    render: h => h(App),
    store: store,
}).$mount('#app')