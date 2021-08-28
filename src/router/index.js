import Vue from "vue"
import VueRouter from "vue-router"

import LandingPage from "../views/LandingPage.vue"
import Home from "../views/Home.vue"
import About from "../views/About.vue"

// cultivar
import CultivarList from "../views/Cultivar/CultivarList.vue"
import CultivarForm from "../views/Cultivar/CultivarForm.vue"

// booking
import DOUpload from "../views/Booking/DOUpload.vue"
import DOUploadList from "../views/Booking/DOUploadList.vue"
import BookingList from "../views/Booking/OrderHistory.vue"
import OrderEdit from "../views/Booking/OrderEdit.vue"
import InvoiceEdit from "../views/Booking/InvoiceEdit.vue"

// SeedInventory
import SeedList from "../views/SeedInventory/SeedList.vue"
import EditSeed from "../views/SeedInventory/EditSeed.vue"
import AddSeed from "../views/SeedInventory/AddSeed.vue"
import NewSeedEntry from "../views/SeedInventory/NewSeedEntry.vue"
import EditedSeedEntry from "../views/SeedInventory/EditedSeedEntry.vue"
import HQSeedInv from "../views/SeedInventory/HQSeedInv.vue"
import FarmSeedInv from "../views/SeedInventory/FarmSeedInv.vue"
import ScanHistory from "../views/SeedInventory/ScanHistory.vue"
import HQScan from "../views/SeedInventory/HQScan.vue"
import FarmScan from "../views/SeedInventory/FarmScan.vue"
import NewScanEntry from "../views/SeedInventory/NewScanEntry.vue"

// harvest
import HarvestTable from "../views/Harvest/HarvestTable.vue"
import TransplantList from "../views/Harvest/TransplantList.vue"
import NewHarvest from "../views/Harvest/NewHarvest.vue"
import NewHarvestEntry from "../views/Harvest/NewHarvestEntry.vue"
import HarvestEdit from "../views/Harvest/HarvestEdit.vue"
import EditedHarvestEntry from "../views/Harvest/EditedHarvestEntry.vue"
import CalendarView from "../views/Harvest/CalendarView.vue"
import BorrowForm from "../views/Harvest/BorrowForm.vue"

// location
import LocationList from "../views/Location/LocationList.vue"
import EditLocation from "../views/Location/EditLocation"
import EditedLocationEntry from "../views/Location/EditedLocationEntry"


// task
import StaffDashboard from "../components/LandingDashboard/StaffDashboard"

Vue.use(VueRouter)

const routes = [
  {
    path: "/",
    name: "LandingPage",
    component: LandingPage,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/about",
    name: "About",
    component: About
  },
  {
    path: "/home",
    name: "Home",
    component: Home
  },


  // booking
  {
    path: "/booking/upload",
    name: "DOUpload",
    component: DOUpload,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/booking/DO/list",
    name: "DOUploadList",
    component: DOUploadList,
    meta: {
      requiresAuth: true
    }
  },

  {
    path: "/booking/list",
    name: "BookingList",
    component: BookingList,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/booking/DO/edit",
    name: "OrderEdit",
    component: OrderEdit,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/booking/invoice/edit",
    name: "InvoiceEdit",
    component: InvoiceEdit,
    meta: {
      requiresAuth: true
    }
  },

  // seed inventory
  {
    path: "/seed/list",
    name: "SeedList",
    component: SeedList,
    meta: {
      requiresAuth: true
    }
  },

  {
    path: "/seed/edit",
    name: "EditSeed",
    component: EditSeed,
    meta: {
      requiresAuth: true
    }
  },

  {
    path: "/seed/edit/entry",
    name: "EditedSeedEntry",
    component: EditedSeedEntry,
    props: true,
    meta: {
      requiresAuth: true
    }
  },

  {
    path: "/seed/new",
    component: AddSeed,
    meta: {
      requiresAuth: true
    }
  },

  {
    path: "/seed/new/entry",
    name: "NewSeedEntry",
    component: NewSeedEntry,
    props: true,
    meta: {
      requiresAuth: true
    }
  },

  {
    path: "/seed/inventory/hq/scan/",
    name: "HQScan",
    component: HQScan,
    props: true,
    meta: {
      requiresAuth: true
    }
  },

  {
    path: "/seed/inventory/farm/scan",
    name: "FarmScan",
    component: FarmScan,
    props: true,
    meta: {
      requiresAuth: true
    }
  },

  {
    path: "/seed/inventory/hq/list",
    name: "HQSeedInv",
    component: HQSeedInv,
    props: true,
    meta: {
      requiresAuth: true
    }
  },

  {
    path: "/seed/inventory/farm/list",
    name: "FarmSeedInv",
    component: FarmSeedInv,
    props: true,
    meta: {
      requiresAuth: true
    }
  },

  {
    path: "/seed/inventory/scan/list",
    name: "ScanHistory",
    component: ScanHistory,
    props: true,
    meta: {
      requiresAuth: true
    }
  },

  {
    path: "/seed/inventory/scan/entry/",
    name: "NewScanEntry",
    component: NewScanEntry,
    props: true,
    meta: {
      requiresAuth: true
    }
  },

  // harvest
  {
    path: "/harvest/transplant/new",
    name: "NewHarvest",
    component: NewHarvest,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/harvest/transplant/list",
    name: "TransplantList",
    component: TransplantList,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/harvest/transplant/edit",
    name: "HarvestEdit",
    component: HarvestEdit,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/harvest/transplant/edit/entry",
    name: "EditedHarvestEntry",
    component: EditedHarvestEntry,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/harvest/transplant/new/entry",
    name: "NewHarvestEntry",
    component: NewHarvestEntry,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/harvest/table",
    name: "HarvestTable",
    component: HarvestTable,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/harvest/borrow/new",
    name: "BorrowForm",
    component: BorrowForm,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/harvest/calendar",
    name: "CalendarView",
    component: CalendarView,
    meta: {
      requiresAuth: true
    }
  },

  // cultivar

  {
    path: "/cultivar/new",
    name: "CultivarForm",
    component: CultivarForm,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/cultivar/list",
    name: "CultivarList",
    component: CultivarList,
    meta: {
      requiresAuth: true
    }
  },

  // location
  {
    path: "/location/list",
    name: "  LocationList",
    component: LocationList,
    props: true,
    meta: {
      requiresAuth: true
    }
  },

  {
    path: "/location/edit",
    component: EditLocation,
    name: "EditLocation",
    props: true,
    meta: {
      requiresAuth: true
    }
  },

  {
    path: "/location/edit/entry",
    component: EditedLocationEntry,
    name: "EditedLocationEntry",
    props: true,
    meta: {
      requiresAuth: true
    }
  },

  {
    path: "/manager/staff-dashboard",
    component: StaffDashboard,
    name: "StaffDashboard",
    props: true,
    meta: {
      requiresAuth: true
    }
  },
]

const router = new VueRouter({
  mode: "history",
  scrollBehavior: function (to, from, savedPosition) {
    if (to.hash) {
      console.log(from, savedPosition)
      return { selector: to.hash }
    }

    else {
      return { x: 0, y: 0 }
    }
  },
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  // this function is never called when refreshing the page
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (router.app.$keycloak.authenticated) {
      next()
    } else {
      router.app.$keycloak.login({ redirectUri: process.env.VUE_APP_BASE_URL })
    }
  } else {
    next()
  }
})

export default router
