<template>
  <ion-button
  :disabled="disabled"
  @click="this.$emit('clicked')"
  class="w-48 sm:w-64 sm:h-13 uppercase font-medium"
  color="gradient"
  >
  {{ text }}
  </ion-button>
</template>

<script>
import { IonButton } from '@ionic/vue';
// TODO: changedefault disabled to true
export default {
  name: 'BaseButtonPrimary',
  components: { IonButton },
  props: {
    text: { type: String, required: true },
    disabled: { type: Boolean, default: false },
  },
};
</script>

<style media="screen">
ion-button {
  --box-shadow: 1px 2px 10px 2px rgba(0, 0, 0, 0.2);
}
</style>
