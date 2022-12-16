<template>
  <div class="greetings">
    <h1 class="greeting">{{ msg }}</h1>
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
