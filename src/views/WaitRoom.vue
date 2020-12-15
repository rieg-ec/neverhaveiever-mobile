<template>
  <ion-page>
    <ion-content :scrollY="false">
      <div class="w-full h-full flex flex-col">
        <GradientLayout>
          <div class="h-full w-full flex flex-col text-center">
            <div class="text-2xl mt-8">
              <h1 class="text-lg text-white font-bold uppercase">ID de sala: {{ roomID }}</h1>
            </div>

            <div class="py-2">
              <h1 class="text-white text-lg font-bold uppercase">jugadores conectados:</h1>
            </div>

            <div class="w-full flex flex-col items-center justify-center my-2">
              <font-awesome-icon icon="crown" style="color: gold;" class="text-6xl mb-1"/>
              <UserCard :user="admin"/>
            </div>

            <div class="mb-4 overflow-y-scroll">
              <UserCardList :users="users" />
            </div>
          </div>
        </GradientLayout>

        <div class="flex-grow flex items-center justify-center">
          <BaseButtonPrimary
            text="empezar"
            @clicked="handleStart"
            v-if="username === admin"
            class="mb-6"
          />
          <div v-else>
            <h1 class="text-gray-400">Espera a que el creador empiece el juego</h1>
          </div>
        </div>
      </div>

    </ion-content>
  </ion-page>
</template>

<script>
import { IonContent, IonPage } from '@ionic/vue';
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import useLoading from '@/use/loading';
import useRoom from '@/use/room';
import useAlert from '@/use/alert';
import useSocket from '@/use/socket';
import BaseButtonPrimary from '@/components/BaseButtonPrimary';
import UserCard from '@/components/UserCard';
import UserCardList from '@/components/UserCardList';
import GradientLayout from '@/components/GradientLayout';

export default {
  name: 'WaitRoom',
  components: {
    IonContent,
    IonPage,
    BaseButtonPrimary,
    UserCard,
    UserCardList,
    GradientLayout,
  },
  setup() {
    const socket = useSocket();
    const router = useRouter();
    const { connectedUsers, roomID, username, admin } = useRoom();
    const { presentLoading, dismissLoading } = useLoading();
    const presentAlert = useAlert();

    const users = computed(() => connectedUsers.value
      .filter(u => !u.status.isAdmin).map(u => u.username));

    const isRoomEmpty = computed(() => connectedUsers.value.length === 0);

    async function handleStart() {
      if (!isRoomEmpty.value) {
        await presentLoading('Empezando...');
        socket.emit('start_game', roomID.value);
      } else { await presentAlert('La sala esta vacia'); }
    }

    socket.on('start_game', async () => {
      await dismissLoading();
      router.push({ name: 'SubmitQuestion' });
    });

    return {
      username,
      roomID,
      admin,
      users,
      handleStart,
    };
  },
};
</script>

<style module>
.top-content {
  background: var(--gradient-primary);
}

.crown {
  color: yellow;
}
</style>
