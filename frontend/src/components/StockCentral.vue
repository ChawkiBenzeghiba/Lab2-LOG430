<template>
  <div class="stock-central">
    <div class="reappro-form">
      <h3>Demande de réapprovisionnement</h3>
      <label>
        Produit :
        <select v-model="selProduit">
            <option disabled value="">-- Choisissez un produit --</option>
            <option v-for="item in stockData" :key="item.id" :value="item.id">
                {{ item.nom }} ({{ item.quantite }})
            </option>
        </select>
      </label>
      <label>
        Quantité :
        <input type="number" v-model.number="reqQte" min="1" />
      </label>
      <button @click="demanderReappro" :disabled="!selProduit || reqQte < 1">
        Envoyer la demande
      </button>
      <div v-if="msg" class="msg">{{ msg }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const stockData = ref([])
const loading   = ref(false)
const error     = ref('')
const selProduit= ref('')
const reqQte    = ref(1)
const msg       = ref('')

async function chargerStock() {
  loading.value  = true
  error.value    = ''
  stockData.value= []
  try {
    const res = await fetch('/api/stock-central?ts=' + Date.now())
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    stockData.value = await res.json()
  } catch (err) {
    error.value = 'Erreur : ' + err.message
  } finally {
    loading.value = false
  }
}

onMounted(chargerStock)

async function demanderReappro() {
  msg.value = ''
  try {
    const res = await fetch('/api/reapprovisionnement', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        produitId: selProduit.value,
        quantiteDemandee: reqQte.value
      })
    })
    const json = await res.json()
    if (!res.ok) throw new Error(json.error || 'Erreur inconnue')
    // Met à jour l’affichage
    stockData.value = json.inventaire
    await chargerStock()
    msg.value       = json.message
  } catch (err) {
    msg.value = 'Erreur : ' + err.message
  }
}
</script>

<style scoped>

.reappro-form {
  margin-top: 2em;
  padding: 1em;
  border: 1px solid #ddd;
  border-radius: 4px;
  max-width: 400px;
  margin-left: auto;
  margin-right: auto;
}
.reappro-form h3 {
  margin-top: 0;
  text-align: center;
}
.reappro-form label {
  display: block;
  margin-bottom: 0.5em;
}
.reappro-form select,
.reappro-form input {
  width: 100%;
  padding: 0.4em;
  margin-top: 0.2em;
  box-sizing: border-box;
}
.reappro-form button {
  display: block;
  margin: 1em auto;
  padding: 0.5em 1em;
  cursor: pointer;
}
.msg {
  text-align: center;
  margin-top: 0.5em;
  color: green;
}
</style>
