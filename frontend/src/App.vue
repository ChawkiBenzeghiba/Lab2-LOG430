
<!-- frontend/src/App.vue -->
<template>
  <div id="app">
    <!-- C’est ici que Vue Router injecte la page correspondant à l’URL -->
    <router-view />
  </div>
</template>

<script setup>
// Aucune importation de page ici : tout passe par router-view
</script>

<style>
#app {
  font-family: Arial, sans-serif;
  padding: 1em;
}
</style>