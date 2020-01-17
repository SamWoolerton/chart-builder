import Vue from "vue"

import App from "./App.vue"
import router from "./router"
import vuetify from "./plugins/vuetify"
import baseComponents from "./base-components"

Vue.config.productionTip = false

baseComponents.forEach(({ name, component }) => Vue.component(name, component))

new Vue({
  router,
  vuetify,
  render: h => h(App),
}).$mount("#app")
