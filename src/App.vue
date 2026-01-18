<script setup lang="ts">
</script>

<template>
  <AppMenuBar />
  <main>
    <RouterView />
  </main>
</template>

<style scoped>
main {
  padding: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
}

.routerlink {
  margin-right: 1rem;
}
</style>
