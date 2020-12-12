<template>
  <div class="w-full py-2 rounded shadow-xl bg-white min-w-32 max-w-44">
    <ion-text>{{ user }}</ion-text>
  </div>
</template>

<script>
import { IonText } from '@ionic/vue';

export default {
  name: 'UserCard',
  components: { IonText },
  props: {
    user: { type: String, required: true },
  },
  setup() {
    return {};
  },
};
</script>

<style module>
</style>
