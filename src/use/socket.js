import { reactive, computed } from 'vue';
import io from 'socket.io-client';
import useRoom from './room';

const { connectedUsers } = useRoom();

const BACKEND_URL = process.env.VUE_APP_BACKEND_URL || 'http://localhost:3000';
// const BACKEND_URL = process.env.VUE_APP_BACKEND_URL || '192.168.1.86:3000';
const socket = io(BACKEND_URL);

socket.on('connected_users', (users) => {
  console.log('dfsdfsdfs connected lsdkfgkl userss');
  connectedUsers.value = users;
});

// TODO: when kicked create alert with useAlert
// socket.on('kicked', () => { store.dispatch('socket/kicked'); });

export default function useSocket() {
  return socket;
}
