<template>
  <div>
    <h1>Magasin {{ magasinId }}</h1>
    <nav>
      <button @click="onglet = 'liste'">Liste</button>
      <button @click="onglet = 'recherche'">Recherche</button>
      <button @click="onglet = 'vente'">Vente</button>
      <button @click="onglet = 'retour'">Retour</button>
      <button @click="onglet = 'reappro'">Reapprovisionnement</button>
    </nav>

    <div v-if="onglet === 'liste'">
      <ul>
        <li v-for="p in produits" :key="p.id">
          {{ p.nom }} | {{ p.categorie }} | {{ p.prix }}$ | Stock : {{ p.quantite }}
        </li>
      </ul>
    </div>

    <div v-else-if="onglet === 'recherche'">
      <input v-model="searchTerm" placeholder="Nom ou catégorie" />
      <button @click="search()">Rechercher</button>
      <ul>
        <li v-for="p in produits" :key="p.id">
          {{ p.nom }} | {{ p.categorie }} | {{ p.prix }}$ | Stock : {{ p.quantite }}
        </li>
      </ul>
    </div>

    <div v-else-if="onglet === 'vente'">
      <select v-model="selId">
        <option v-for="p in produits" :key="p.id" :value="p.id">{{ p.nom }}</option>
      </select>
      <input type="number" v-model.number="quantVente" />
      <button @click="vendre()">Vendre</button>
      <p v-if="msg">{{ msg }}</p>
    </div>

    <div v-else-if="onglet === 'retour'">
      <select v-model="selId">
        <option v-for="p in produits" :key="p.id" :value="p.id">{{ p.nom }}</option>
      </select>
      <input type="number" v-model.number="quantRetour" />
      <button @click="retourner()">Retour</button>
      <p v-if="msg">{{ msg }}</p>
    </div>

    <div v-else-if="onglet === 'reappro'">
  <h3>Demande de réapprovisionnement</h3>

  <label>
    Produit :
    <select v-model="selProduitReappro">
      <option disabled value="">-- Choisissez un produit --</option>
      <option
        v-for="item in produits"
        :key="item.id"
        :value="item.id"
      >
        {{ item.nom }} ({{ item.quantite }})
      </option>
    </select>
  </label>

  <label>
    Quantité à prélever :
    <input type="number" v-model.number="reqQteReappro" min="1" />
  </label>

  <button
    @click="demanderReappro"
    :disabled="!selProduitReappro || reqQteReappro < 1"
  >
    Envoyer la demande
  </button>

  <p v-if="msgReappro" class="msg">{{ msgReappro }}</p>
  <p v-if="errorReappro" class="error">{{ errorReappro }}</p>
</div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute }    from 'vue-router'

const route = useRoute()
const magasinId = route.params.id
const onglet    = ref('liste')
const produits  = ref([])
const searchTerm= ref('')
const selId     = ref(null)
const quantVente= ref(1)
const quantRetour=ref(1)
const msg       = ref('')
const selProduitReappro = ref(null)
const reqQteReappro     = ref(1)
const msgReappro        = ref('')
const errorReappro      = ref('')

async function demanderReappro() {
  msgReappro.value   = ''
  errorReappro.value = ''
  try {
    const res = await fetch(`/api/${magasinId}/reapprovisionnement`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        produitId        : selProduitReappro.value,
        quantiteDemandee : reqQteReappro.value
      })
    })
    const json = await res.json()
    if (!res.ok) throw new Error(json.error || 'Erreur inconnue')

    // recharge la liste après modif
    await loadAll()
    msgReappro.value = json.message
  } catch (err) {
    errorReappro.value = 'Erreur : ' + err.message
  }
}

async function loadAll() {
  const res = await fetch(`/api/${magasinId}/produits`);
  if (!res.ok) {
    console.error('Erreur chargement produits', res.status);
    return;
  }
  produits.value = await res.json();
}

onMounted(loadAll)

async function search() {
  const q = encodeURIComponent(searchTerm.value)
  const res = await fetch(`/api/${magasinId}/produits/search?${searchTerm.value.includes(' ') ? 'categorie' : 'nom'}=${q}`)
  produits.value = await res.json()
}

async function vendre() {
  msg.value = ''
  const res = await fetch(`/api/${magasinId}/vente`, {
    method: 'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify({produitId: selId.value, quantite:quantVente.value})
  })
  const json = await res.json()
  if (res.ok) {msg.value = json.message;await loadAll();
}
  if (!res.ok) msg.value = json.error
  else { msg.value=json.message; loadAll() }
}

async function retourner() {
  msg.value = ''
  const res = await fetch(`/api/${magasinId}/retour`, {
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify({produitId: selId.value, quantite:quantRetour.value})
  })
  const json = await res.json()
  if (!res.ok) msg.value = json.error
  else { msg.value=json.message; loadAll() }
}
</script>
