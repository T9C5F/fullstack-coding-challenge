//main.js
import Vue from "vue";
import App from "./App.vue";
import Vuetify from "vuetify";
import "vuetify/dist/vuetify.min.css";
import "@mdi/font/css/materialdesignicons.css";

Vue.config.productionTip = false;

Vue.use(Vuetify);
const vuetify = new Vuetify({
  icons: {
    iconfont: "mdi", // default - only for display purposes
  },
  theme: {
    dark: false,
  },
});

new Vue({
  vuetify,
  render: (h) => h(App),
}).$mount("#app");
