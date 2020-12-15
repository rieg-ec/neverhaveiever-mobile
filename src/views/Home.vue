<template>
  <ion-page>
    <ion-content :scrollY="false">
      <div class="m-10h text-2xl flex justify-center">
        <h1>NUNCA NUNCA...</h1>
      </div>

      <div class="flex flex-col items-center my-5h">
        <div class="w-75w flex flex-col justify-center">
          <div>
            <ion-item color="transparent">
              <ion-label position="floating">
                <div :class="[errors.username ? 'text-red-400' : 'text-gray-600' ]">
                  Nombre de usuario
                </div>
              </ion-label>
              <ion-input type="text" v-model="username"></ion-input>
            </ion-item>
          </div>

          <ion-item color="transparent">
            <ion-label position="floating">
              <div :class="[errors.roomID ? 'text-red-400' : 'text-gray-600' ]">
                ID de sala
              </div>
            </ion-label>
            <ion-input type="text" v-model="roomID"></ion-input>
          </ion-item>
        </div>

        <div class="mt-15h">
          <div class="p-2">
            <BaseButtonPrimary
              :disabled="false" text="join"
              @clicked="handleJoin"
            />
          </div>
          <div class="p-2">
            <BaseButtonPrimary
              :disabled="false" text="create"
              @clicked="handleCreate"
            />
          </div>
        </div>

      </div>

    </ion-content>

  </ion-page>
</template>

<script>
import { IonContent, IonPage, IonInput, IonItem, IonLabel } from '@ionic/vue';
import { reactive, watch } from 'vue';
import { useRouter } from 'vue-router';
import useLoading from '@/use/loading';
import useRoom from '@/use/room';
import useAlert from '@/use/alert';
import useSocket from '@/use/socket';
import BaseButtonPrimary from '@/components/BaseButtonPrimary';

export default {
  name: 'Home',
  components: {
    IonContent,
    IonPage,
    IonInput,
    IonItem,
    IonLabel,
    BaseButtonPrimary,
  },
  setup() {
    const { presentLoading, dismissLoading } = useLoading();
    const { username, roomID, inRoom, connectedUsers } = useRoom();
    const presentAlert = useAlert();
    const socket = useSocket();
    const router = useRouter();

    const errors = reactive({
      username: false,
      roomID: false,
    });

    watch([username, roomID], () => {
      errors.username = false;
      errors.roomID = false;
    });

    async function handleCreate() {
      await presentLoading('cargando...');
      socket.emit('create_room', username.value);
    }

    async function handleJoin() {
      await presentLoading('cargando...');
      socket.emit('join_room', roomID.value, username.value);
    }

    socket.on('username_exists', async () => {
      // TODO: maybe by focusing name input after error ux is better
      dismissLoading();
      await presentAlert('usuario existente');
      errors.username = true;
    });

    socket.on('join_room_failure', async () => {
      // TODO: maybe by focusing room id input after error ux is better
      dismissLoading();
      await presentAlert('ID de sala invalido');
      errors.roomID = true;
    });

    socket.on('create_room_failure', async () => {
      dismissLoading();
      await presentAlert('Hubo un error, intentalo de nuevo');
      errors.username = true;
    });

    socket.on('join_room_success', (_roomID) => {
      dismissLoading();
      roomID.value = _roomID;
      inRoom.value = true;
      router.push({ name: 'WaitRoom' });
    });

    socket.on('create_room_success', (_roomID) => {
      dismissLoading();
      connectedUsers.value = [{ username: username.value, status: { isAdmin: true } }];
      // connectedUsers.value = [
      //   { username: username.value, status: { isAdmin: true } },
      //   { username: username.value, status: { isAdmin: false } },
      //   { username: username.value, status: { isAdmin: false } },
      //   { username: username.value, status: { isAdmin: false } },
      //   { username: username.value, status: { isAdmin: false } },
      //   { username: username.value, status: { isAdmin: false } },
      //   { username: username.value, status: { isAdmin: false } },
      //   { username: username.value, status: { isAdmin: false } },
      //   { username: username.value, status: { isAdmin: false } },
      //   { username: username.value, status: { isAdmin: false } },
      //   { username: username.value, status: { isAdmin: false } },
      //   { username: username.value, status: { isAdmin: false } },
      //   { username: username.value, status: { isAdmin: false } },
      //   { username: username.value, status: { isAdmin: false } },
      //   { username: username.value, status: { isAdmin: false } },
      //   { username: username.value, status: { isAdmin: false } },
      //   { username: username.value, status: { isAdmin: false } },
      //   { username: username.value, status: { isAdmin: false } },
      //   { username: username.value, status: { isAdmin: false } },
      //   { username: username.value, status: { isAdmin: false } },
      // ];
      inRoom.value = true;
      roomID.value = _roomID;
      router.push({ name: 'WaitRoom' });
    });

    return {
      handleCreate,
      handleJoin,
      username,
      roomID,
      errors,
    };
  },
};
</script>
