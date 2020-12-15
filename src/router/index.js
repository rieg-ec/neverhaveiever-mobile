import { createRouter, createWebHistory } from '@ionic/vue-router';
import Home from '@/views/Home';
import WaitRoom from '@/views/WaitRoom';
import SubmitQuestion from '@/views/SubmitQuestion';
import QuestionsRound from '@/views/QuestionsRound';
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
    path: '/wait-room',
    name: 'WaitRoom',
    component: WaitRoom,
  },
  {
    path: '/submit-question',
    name: 'SubmitQuestion',
    component: SubmitQuestion,
  },
  {
    path: '/questions-round',
    name: 'QuestionsRound',
    component: QuestionsRound,
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
