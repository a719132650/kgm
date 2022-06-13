/*
author : Kigooo
verson : 0.0.3
update date : 2022-02-14
*/
// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui'
import router from '@/router/kgIndex'
import kgRange from '@/config/kgRange.js'
import kgConfig from '@/config/kgConfig.js'
import kgApi from '@/api/kgApi.js'
import kgMvc from '@/api/kgMvc.js'
import kgStore from '@/store/kgStore.js'
import kgUtil from '@/util/kgUtil.js'
import kgUtilAuth from '@/util/kgUtil/kgUtilAuth.js'
import kgUtilMenu from '@/util/kgUtil/kgUtilMenu.js'
import kgUtilDate from '@/util/kgUtilDate.js'
import kgMenuTree from '@/components/kgComponents/kgMenuTree'
import kgDialogUserSelect from '@/components/kgComponents/kgDialogUserSelect'
import kgDialogApiSelect from '@/components/kgComponents/kgDialogApiSelect'
import kgDialogRangeSelect from '@/components/kgComponents/kgDialogRangeSelect'

import zuStore from '@/store/zuStore.js'
import zuApi from '@/api/zuApi.js'
import zuConfig from '@/config/zuConfig.js'

import 'element-ui/lib/theme-chalk/index.css'
import './assets/kgUI/kgUI.css'
import './assets/kgUI/kgIcon.css'
import './assets/kgUI/kgFramePlm.scss'

Vue.use(ElementUI)
Vue.config.productionTip = false
Vue.prototype.$kgApi = kgApi
Vue.prototype.$kgRange = kgRange
Vue.prototype.$kgConfig = kgConfig
Vue.prototype.$kgStore = kgStore
Vue.prototype.$kgUtil = kgUtil
Vue.prototype.$kgUtilAuth = kgUtilAuth
Vue.prototype.$kgUtilMenu = kgUtilMenu
Vue.prototype.$kgUtilDate = kgUtilDate

Vue.prototype.$zuStore = zuStore
Vue.prototype.$zuApi = zuApi
Vue.prototype.$zuConfig = zuConfig

Vue.component("kg-menu-tree",kgMenuTree)
Vue.component("kg-dialog-user-select",kgDialogUserSelect)
Vue.component("kg-dialog-api-select",kgDialogApiSelect)
Vue.component("kg-dialog-range-select",kgDialogRangeSelect)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
