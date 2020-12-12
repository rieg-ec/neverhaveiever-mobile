import { ref, computed } from 'vue';
import { loadingController } from '@ionic/vue';

const loading = ref(false);

const isLoading = computed({
  get: () => loading.value,
  set: (bool) => { loading.value = bool; },
});

async function presentLoading(message) {
  const loader = await loadingController
    .create({
      cssClass: 'my-custom-class',
      message,
      duration: 6000,
    });

  isLoading.value = true;

  await loader.present();
}

function dismissLoading() {
  if (isLoading.value) {
    isLoading.value = false;
    loadingController.dismiss();
  }
}

export default function useLoading() {
  return {
    presentLoading,
    dismissLoading,
    isLoading,
  };
}
