import Vue from 'vue'
import Router from 'vue-router'
import MainNavigator from '@/components/MainNavigator'
import NovaRegra from '@/components/NovaRegra'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'MainNavigator',
      component: MainNavigator
    },
    {
      path: '/nova-regra',
      name: 'nova_regra',
      component: NovaRegra
    }
  ]
})
