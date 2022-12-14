<template>
  <div class="greetings">
    <h1 class="greeting">{{ msg }}</h1>
    <h3>New dApp is coming soon!</h3>
  </div>
</template>

<script setup lang="ts">
defineProps({
  msg: {
    type: String,
    required: true,
  },
});
</script>

<style scoped></style>
