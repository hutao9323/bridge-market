import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from "@/views/Home"
import Bridge from "@/views/Bridge"
import Market from "@/views/Market"
import SwapMain from "@/components/SwapMain"
import Doc from "@/views/Doc"
import RoadMap from "../components/document/RoadMap"
import Contact from "../components/document/Contact"
import GuideforMarket from "@/components/document/GuideforMarket"
import GuideforWallet from "@/components/document/GuideforWallet"
import GuideforBridge from "@/components/document/GuideforBridge"
import Introduction from "@/components/document/Introduction"
import MintPBT from "@/components/market/MintPBT"

Vue.use(VueRouter)

const routes = [{
    path: "/",
    redirect: "/Home",
    component: Home,
  }, {
    path: '/Home',
    name: 'Home',
    component: Home,
  },
  {
    path: '/Bridge',
    name: 'Bridge',
    component: Bridge,
  },
  {
    path: '/Market',
    name: 'NFT Market',
    component: Market,
    children: [{
      path: "/MintPBT",
      component: MintPBT,
      name: "MintPBT"
    }]
  },{
      path: '/swap',
      name: 'Swap',
      component: SwapMain,
  },{
    path: '/Doc',
    name: 'Doc',
    component: Doc,
    redirect: "/Doc/Introduction",
    children: [{
        path: '/Doc/Introduction',
        component: Introduction,
        name: "Introduction"
      },
      {
        path: '/Doc/RoadMap',
        component: RoadMap,
        name: "RoadMap"
      },
      {
        path: '/Doc/contact',
        component: Contact,
        name: "Contact"
      },
      {
        path: '/Doc/GuideforMarket',
        component: GuideforMarket,
        name: "GuideforMarket"
      },
      {
        path: '/Doc/GuideforBridge',
        component: GuideforBridge,
        name: "GuideforBridge"
      },
      {
        path: '/Doc/GuideforWallet',
        component: GuideforWallet,
        name: "GuideforWallet"
      }
    ]
  },
]

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes
})

export default router
