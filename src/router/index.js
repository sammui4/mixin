import Vue from 'vue'
import Router from 'vue-router'
// import HelloWorld from '@/components/HelloWorld'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: ()=> import ('@/components/HelloWorld')
    },
    {
      path: '/int',
      name: 'int',
      component: ()=> import ('@/components/int')      
    },
    {
      path: '/one',
      name: 'one',
      component: ()=> import ('@/components/one')      
    }
  ]
})
