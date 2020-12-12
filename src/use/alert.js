import { alertController } from '@ionic/vue';

async function presentAlert(message) {
  const alert = await alertController
    .create({
      header: 'Alert',
      subHeader: 'Subtitle',
      message,
      buttons: ['OK'],
    });

  return alert.present();
}

export default function useAlert() {
  return presentAlert;
}
