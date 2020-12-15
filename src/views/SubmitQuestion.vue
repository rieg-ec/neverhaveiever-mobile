<template>
  <ion-page>
    <ion-content :scrollY="false" fullscreen="true">
      <div v-if="!submittedQuestion" class="w-full h-full flex flex-col items-center">
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

      <div v-else class="h-full mx-2">
        <GradientLayout class="mt-20 rounded-2xl">
          <div class="w-full flex flex-col text-center">
            <div class="my-10 font-bold text-2xl text-white">Esperando a:</div>
            <UserCardList :users="getUsersWithoutQuestion" maxHeight="55h"/>
          </div>
        </GradientLayout>
      </div>
    </ion-content>
  </ion-page>
</template>

<script>
import { IonContent, IonPage, IonInput, IonLabel, IonItem } from '@ionic/vue';
import { ref, computed } from 'vue';
import { useRouter, onBeforeRouteLeave } from 'vue-router';
import useRoom from '@/use/room';
import useAlert from '@/use/alert';
import useLoading from '@/use/loading';
import useSocket from '@/use/socket';
import BaseButtonPrimary from '@/components/BaseButtonPrimary';
import UserCardList from '@/components/UserCardList';
import GradientLayout from '@/components/GradientLayout';

export default {
  name: 'SubmitQuestion',
  components: {
    IonContent,
    IonPage,
    IonItem,
    IonInput,
    IonLabel,
    BaseButtonPrimary,
    UserCardList,
    GradientLayout,
  },
  setup() {
    const router = useRouter();
    const { roomID, connectedUsers, username } = useRoom();
    const presentAlert = useAlert();
    const socket = useSocket();
    const submittedQuestion = ref(false);
    const question = ref('');
    /*
      STATES:
        - submittedQuestion
    */
    const usersWithoutQuestion = ref(connectedUsers.value.map(u => u.username));
    const connectedUsersUsernames = computed(
      () => connectedUsers.value.map(user => user.username)
    );
    const getUsersWithoutQuestion = computed(
      () => usersWithoutQuestion.value
            .filter(user => connectedUsersUsernames.value.includes(user))
    );

    async function handleQuestion() {
      if (question.value.length) {
        if (getUsersWithoutQuestion.value.length > 1) {
          submittedQuestion.value = true;
        }
        socket.emit('submit_statement', question.value, roomID.value);
      } else {
        await presentAlert('Pregunta vacia');
      }
    }

    socket.on('users_without_statement', (users) => {
      usersWithoutQuestion.value = users;
    });

    socket.on('start_statements', () => {
      router.push({ name: 'QuestionsRound' });
    });

    onBeforeRouteLeave(() => {
      usersWithoutQuestion.value = connectedUsers.value.map(u => u.username);
      question.value = '';
      submittedQuestion.value = false;
    });

    return {
      username,
      handleQuestion,
      question,
      submittedQuestion,
      getUsersWithoutQuestion,
    };
  },
};
</script>
