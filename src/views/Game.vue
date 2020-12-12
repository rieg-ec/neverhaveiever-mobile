<template>
  <ion-page>
    <ion-content :scrollY="false">

      <div v-if="status.questionsStage" class="h-full w-full flex flex-col items-center">

        <div class="w-full h-70h" :class="$style['gradient-content']">
          <div class="w-full h-full">
            <ion-slides pager="true" class="h-full pt-12">

              <ion-slide>
                <div class="h-full pt-32">
                  <ion-text
                  color="light"
                  >
                    <h1 class="text-lg font-bold">"{{ question }}"</h1>
                  </ion-text>
                </div>
              </ion-slide>

              <ion-slide class="flex flex-col">
                <div
                class="h-full pt-32"
                v-if="getUsersNotReady.length == 1 && getUsersNotReady.includes(username)"
                >
                  <ion-text
                  class="pt-32"
                  color="light"
                  >
                    <h1 class="text-lg font-bold uppercase">Solo faltas tu :D</h1>
                  </ion-text>
                </div>

                <div v-else-if="getUsersNotReady.length > 0" class="h-50h mb-16">
                  <ion-text color="light"><h1 class="text-lg font-bold uppercase mb-4">Esperando a:</h1></ion-text>
                  <div class="max-h-50h overflow-y-scroll">
                    <UserCardList :users="getUsersNotReady"/>
                  </div>
                </div>
              </ion-slide>

            </ion-slides>
          </div>
        </div>

        <div class="w-full h-30h flex items-center justify-center">
          <BaseButtonPrimary
          v-if="!status.readyForNextQuestion"
          @clicked="handleReady"
          text="listo"
          class="mb-6"
          />

          <div
          v-else-if="status.questionsStage"
          class="text-gray-400 font-size text-2xl text-center px-4"
          >
            Espera al resto de los jugadores
          </div>

        </div>
      </div>

      <div v-else class="w-full h-full">
        <div v-if="!status.submittedQuestion" class="w-full h-full flex flex-col items-center">
          <div class="pt-8 flex-grow flex items-end">
            <ion-item color="transparent">
              <ion-label position="floating" color="dark">
                <div class="text-gray-600">Yo nunca nunca...</div>
              </ion-label>
              <ion-input type="text" enterkeyhint="enter" v-model="question"></ion-input>
            </ion-item>
          </div>

          <div class="flex-grow-2 flex items-center">
            <BaseButtonPrimary
            @clicked="handleQuestion"
            text="enviar"
            />
          </div>

        </div>

        <div
        v-else
        class="flex flex-col w-full h-full px-4 py-12"
        >
          <div class="w-full flex-grow-2 flex flex-col text-center rounded-xl shadow-2xl" :class="$style['gradient-content']">
            <div class="my-8 font-bold text-2xl text-white">Esperando a:</div>
            <div class="mb-4 overflow-y-scroll">
              <UserCardList :users="getUsersWithoutQuestion" />
            </div>

          </div>
        </div>
      </div>

    </ion-content>
  </ion-page>
</template>

<script>
import {
  IonContent, IonPage, IonText, IonItem, IonInput, IonLabel, IonSlides,
  IonSlide,
} from '@ionic/vue';
import { ref, computed, onBeforeMount } from 'vue';
import { useRouter } from 'vue-router';
import useRoom from '@/use/room';
import useAlert from '@/use/alert';
import useLoading from '@/use/loading';
import useSocket from '@/use/socket';
import BaseButtonPrimary from '@/components/BaseButtonPrimary';
import UserCardList from '@/components/UserCardList';

export default {
  name: 'Home',
  components: {
    IonContent,
    IonPage,
    IonText,
    IonItem,
    IonInput,
    IonLabel,
    IonSlide,
    IonSlides,
    BaseButtonPrimary,
    UserCardList,
  },
  setup() {
    const {
      roomID, connectedUsers, connectedUsersUsernames, username,
    } = useRoom();
    const presentAlert = useAlert();
    const socket = useSocket();
    const status = ref({});
    const question = ref('');

    /*
      STATES:
        - submittedQuestion
        - readyForNextQuestion
        - questionsStage
    */
    const usersWithoutQuestion = ref(connectedUsers.value.map(u => u.username));
    const usersNotReady = ref(connectedUsers.value.map(u => u.username));

    const getUsersWithoutQuestion = computed(
      () => usersWithoutQuestion.value
            .filter(user => connectedUsersUsernames.value.includes(user))
    );

    const getUsersNotReady = computed(
      () => usersNotReady.value
              .filter(user => connectedUsersUsernames.value.includes(user))
    );

    async function handleQuestion() {
      if (question.value.length) {
        if (getUsersWithoutQuestion.value.length > 1) {
          status.value = { submittedQuestion: true };
        }
        socket.emit('submit_statement', question.value, roomID.value);
      } else {
        await presentAlert('Pregunta vacia');
      }
    }

    function handleReady() {
      if (getUsersNotReady.value.length > 1) {
        status.value = {
          questionsStage: true,
          readyForNextQuestion: true,
        };
      }
      socket.emit('ready_for_next_statement', roomID.value);
    }

    onBeforeMount(() => {
      socket.on('users_without_statement', async (users) => {
        usersWithoutQuestion.value = users;
      });

      socket.on('users_not_ready', (users) => {
        usersNotReady.value = users;
      });

      socket.on('new_statement', (_question) => {
        question.value = _question;
        status.value = { questionsStage: true };
        usersNotReady.value = connectedUsers.value.map(u => u.username);
      });

      socket.on('start_game', async () => {
        // TODO: find better way to reset component
        status.value = {};
        question.value = '';
        usersWithoutQuestion.value = connectedUsers.value.map(u => u.username);
        usersNotReady.value = connectedUsers.value.map(u => u.username);
        usersNotReady.value = [];
      });
    });

    return {
      status,
      username,
      handleQuestion,
      question,
      getUsersWithoutQuestion,
      getUsersNotReady,
      handleReady,
    };
  },
};
</script>

<style module>
.gradient-content {
  background: var(--gradient-primary);
}
</style>

<style>
.swiper-pagination-bullet-active {
  background: white;
  opacity: 0.8;
}
</style>
