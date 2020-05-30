import Vue from 'vue'
import VueRouter from 'vue-router'
import Root from '@/components/root'
import Content from '@/components/content'
import Home from '@/components/home'

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    redirect: '/home',
    component: Root,
    meta: {
    },
    children:[
      {
        path: 'content/:id',
        component: Content,
        meta: {
        }
      },
      {
        path: 'home',
        component: Home,
        meta: {
        }
      }
    ]
  }   
];

const router = new VueRouter({
  routes:routes
});

export default router;