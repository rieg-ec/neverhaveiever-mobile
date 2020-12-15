<template>
  <ion-fab vertical="bottom" horizontal="end" slot="fixed" class="text-white shado mr-2 mb-2">
    <ion-fab-button color="gradient">
      <font-awesome-icon icon="cog"/>
    </ion-fab-button>
    <ion-fab-list side="start">
      <ion-fab-button color="gradient">
        <font-awesome-icon icon="palette"/>
      </ion-fab-button>
      <ion-fab-button color="gradient">
        <font-awesome-icon icon="share-alt" @click="handleShare"/>
      </ion-fab-button>
      <ion-fab-button color="gradient" @click="handleBack" routerLink='/home' routerDirection='back'>
        <font-awesome-icon icon="arrow-left"/>
      </ion-fab-button>
    </ion-fab-list>
  </ion-fab>
</template>

<script>
import { IonFab, IonFabButton, IonFabList, IonIcon } from '@ionic/vue';
import { useRouter } from 'vue-router';
import useSocket from '@/use/socket';
import useRoom from '@/use/room';

export default {
  name: 'FabSettings',
  components: { IonFab, IonFabButton, IonFabList, IonIcon },
  setup() {
    const { resetRoomState } = useRoom();
    const socket = useSocket();
    const router = useRouter();

    function handleBack() {
      socket.emit('leave_room');
      resetRoomState();
    }

    function handleShare() {
      console.log('shared :D');
    }

    return { handleBack, handleShare };
  },
};
</script>

<style module>
.gradient-content {
  background: var(--gradient-primary);
}

ion-fab-button {
  --box-shadow: 1px 2px 10px 2px rgba(0, 0, 0, 0.2);
}
</style>
