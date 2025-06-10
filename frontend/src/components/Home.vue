<template>
  <div class="home">
    <h1>Tableau de bord principal</h1>
    <div class="buttons">
      <router-link to="/rapport" class="btn">Voir le Rapport</router-link>
      <router-link to="/stock-central" class="btn">Voir le Stock Central</router-link>
      <!-- Ajoutez d'autres boutons ici pour UC3, UC4, etc. -->
    </div>
  </div>
</template>

<script setup>
// pas de script nécessaire pour l'instant
</script>

<style scoped>
.home {
  text-align: center;
  margin-top: 2em;
  font-family: Arial, sans-serif;
}
.buttons {
  display: flex;
  justify-content: center;
  gap: 1em;
  margin-top: 1.5em;
}
.btn {
  display: inline-block;
  padding: 0.75em 1.5em;
  background: #42b983;
  color: white;
  border-radius: 4px;
  text-decoration: none;
  font-weight: bold;
}
.btn:hover {
  background: #369870;
}
</style>
