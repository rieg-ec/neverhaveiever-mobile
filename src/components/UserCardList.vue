<template>
  <div class="px-4 grid grid-cols-2">
    <div
    v-for="(user, index) in users" :key="index"
    class="p-2 w-full
          flex items-center justify-center"
    >
      <UserCard :user="user"/>
    </div>
  </div>
</template>

<script>
import UserCard from '@/components/UserCard';

export default {
  name: 'Home',
  components: {
    UserCard,
  },
  props: {
    users: { type: Array, required: true },
  },
  setup() {
    return {
    };
  },
};
</script>
