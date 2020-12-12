import { createRouter, createWebHistory } from '@ionic/vue-router';
import Home from '@/views/Home.vue';
import Room from '@/views/Room.vue';
import Game from '@/views/Game.vue';
import useRoom from '@/use/room';

const { inRoom } = useRoom();

const routes = [
  {
    path: '/',
    redirect: '/home',
  },
  {
    path: '/home',
    name: 'Home',
    component: Home,
  },
  {
    path: '/room',
    name: 'Room',
    component: Room,
  },
  {
    path: '/game',
    name: 'Game',
    component: Game,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  // prevent users from visiting views when they're not connected to a room
  if (!inRoom.value && to.name !== 'Home') {
    next({ name: 'Home', replace: true });
  } else { next(); }
});

export default router;
