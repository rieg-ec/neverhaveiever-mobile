<template>
  <ion-app>
    <ion-content>
      <ion-router-outlet />
      <FabSettings v-if="isFabButtonAllowed"/>
    </ion-content>
  </ion-app>
</template>

<script>
import { IonApp, IonRouterOutlet, IonContent } from '@ionic/vue';
import FabSettings from '@/components/FabSettings';
import { computed } from 'vue';
import { useRouter } from 'vue-router';

export default {
  name: 'App',
  components: {
    IonApp,
    IonRouterOutlet,
    IonContent,
    FabSettings,
  },
  setup() {
    const router = useRouter();

    const isFabButtonAllowed = computed(
      () => router.currentRoute.value.name !== 'Home'
    );

    return { isFabButtonAllowed };
  },
};
</script>
