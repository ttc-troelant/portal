<script setup lang="ts">
</script>

<template>
  <nav>
    <h1>TTC Troelant Admin</h1>
    <RouterLink class="routerlink" to="/">Activiteiten</RouterLink>
    <RouterLink class="routerlink" to="/users">Gebruikers</RouterLink>
    <RouterLink class="routerlink" to="/login">Login</RouterLink>
  </nav>
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
