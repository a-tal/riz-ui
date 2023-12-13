import { RouteRecordRaw, createRouter, createWebHistory } from 'vue-router';

import HomeView from '../views/HomeView.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/room/:id',
    name: 'room',
    component: () => import('@/views/RoomView.vue'),
    props: true,
  },

  {
    path: '/:pathMatch(.*)*',
    name: 'home',
    component: HomeView,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
