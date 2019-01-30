// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

import 'onsenui/css/onsenui.css';
import 'onsenui/css/onsen-css-components.css';
import VueOnsen from 'vue-onsenui';

// VueOnsen set here as plugin to VUE. Done automatically if a call to window.Vue exists in the startup code.
Vue.use(VueOnsen);

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  data: {
    baseUrl: 'http://localhost:3000',
    index: 0
  },
  router,
  components: { App },
  template: '<App/>'
})

VueOnsen.ready( nani => {
  console.log('Ok')
})
