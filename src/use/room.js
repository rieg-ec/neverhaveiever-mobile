import { reactive, computed } from 'vue';


const state = reactive({
  inRoom: false,
  username: '',
  roomID: '',
  connectedUsers: [],
  statement: '',
});

const resetRoomState = () => {
  // TODO: find better way to reset a reactive object (must be deep clone, not shallow copy)
  state.inRoom = false;
  state.username = '';
  state.roomID = '';
  state.connectedUsers = [];
  state.statement = '';
};

const inRoom = computed({
  get: () => state.inRoom,
  set: value => { state.inRoom = value; },
});

const admin = computed(() => {
  const match = state.connectedUsers.find(u => u.status.isAdmin);
  if (match) return match.username;
  return undefined;
});

const username = computed({
  get: () => state.username,
  set: value => { state.username = value; },
});

const roomID = computed({
  get: () => state.roomID,
  set: value => { state.roomID = value; },
});

const connectedUsers = computed({
  get: () => state.connectedUsers,
  // set: (value) => state.connectedUsers.push(...value),
  set: (users) => { state.connectedUsers = users; },
});

const connectedUsersUsernames = computed(
  () => state.connectedUsers.map(u => u.username)
);

export default function useRoom() {
  return {
    inRoom,
    admin,
    username,
    roomID,
    connectedUsers,
    connectedUsersUsernames,
    resetRoomState,
  };
}
