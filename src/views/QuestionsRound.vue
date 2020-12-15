<template>
  <ion-page>
    <ion-content :scrollY="false" fullscreen="true">
      <GradientLayout>
        <ion-slides pager="true" class="h-full pt-12">
          <ion-slide>
            <div class="h-full pt-32">
              <h1 class="text-lg font-bold text-white">"{{ question }}"</h1>
            </div>
          </ion-slide>

          <ion-slide class="flex flex-col">
            <div
            class="h-full pt-32"
            v-if="getUsersNotReady.length == 1 && getUsersNotReady.includes(username)"
            >
              <h1 class="text-white text-lg font-bold uppercase">Solo faltas tu :D</h1>
            </div>

            <div v-else-if="getUsersNotReady.length > 0" class="h-50h mb-16">
              <h1 class="text-lg text-white font-bold uppercase mb-4">Esperando a:</h1>
              <div class="mb-4 overflow-y-scroll">
                <UserCardList :users="getUsersNotReady"/>
              </div>
            </div>
          </ion-slide>
        </ion-slides>
      </GradientLayout>

      <div class="w-full h-30h flex items-center justify-center">
        <BaseButtonPrimary
        v-if="!readyForNextQuestion"
        @clicked="handleReady"
        text="listo"
        class="mb-6"
        />

        <div
        v-else
        class="text-gray-400 font-size text-2xl text-center px-4"
        >
          Espera al resto de los jugadores
        </div>

      </div>
    </ion-content>
  </ion-page>
</template>

<script>
import { IonContent, IonPage, IonSlides, IonSlide } from '@ionic/vue';
import { ref, computed } from 'vue';
import { useRouter, onBeforeRouteLeave } from 'vue-router';
import useRoom from '@/use/room';
import useLoading from '@/use/loading';
import useSocket from '@/use/socket';
import BaseButtonPrimary from '@/components/BaseButtonPrimary';
import UserCardList from '@/components/UserCardList';
import GradientLayout from '@/components/GradientLayout';

export default {
  name: 'QuestionsRound',
  components: {
    IonContent,
    IonPage,
    IonSlide,
    IonSlides,
    BaseButtonPrimary,
    UserCardList,
    GradientLayout,
  },
  setup() {
    const { roomID, connectedUsers, username } = useRoom();
    const socket = useSocket();
    const readyForNextQuestion = ref(false);
    const question = ref('');
    const router = useRouter();
    /*
      STATES:
        - readyForNextQuestion
    */
    const connectedUsersUsernames = computed(
      () => connectedUsers.value.map(user => user.username)
    );
    const usersNotReady = ref(connectedUsers.value.map(u => u.username));
    const getUsersNotReady = computed(
      () => usersNotReady.value
              .filter(user => connectedUsersUsernames.value.includes(user))
    );

    function handleReady() {
      if (getUsersNotReady.value.length > 1) {
        readyForNextQuestion.value = true;
      }
      socket.emit('ready_for_next_statement', roomID.value);
    }

    socket.on('users_not_ready', (users) => {
      usersNotReady.value = users;
    });

    socket.on('new_statement', (_question) => {
      question.value = _question;
      readyForNextQuestion.value = false;
      usersNotReady.value = connectedUsers.value.map(u => u.username);
    });

    socket.on('restart_game', () => {
      router.back();
    });

    onBeforeRouteLeave(() => {
      /*
      for some reason when using router.back() and then navigating
      again to this view, vue creates another component without garbage collecting
      listeners in this one, therefore we need to clean any listeners manually
      */
      const listeners = ['users_not_ready', 'new_statement', 'restart_game'];
      listeners.forEach((listener) => socket.removeAllListeners(listener));
      readyForNextQuestion.value = false;
      question.value = '';
    });

    return {
      readyForNextQuestion,
      username,
      question,
      getUsersNotReady,
      handleReady,
    };
  },
};
</script>

<style>
.swiper-pagination-bullet-active {
  background: white;
  opacity: 0.8;
}
</style>
