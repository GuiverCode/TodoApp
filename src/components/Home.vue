<template>
  <div class="home">
    <v-card>
      <v-toolbar class="white--text" color="info"><h1>Pendientes</h1></v-toolbar>
      
      <v-card-text>Aquí verás tu lista de tareas pendientes.</v-card-text>
    </v-card>
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: 'home',
  components: {
    //HelloWorld
  },
  data() {
    return {
      usuario: {},
    }
  },
  mounted() {
    this.usuario = JSON.parse(window.localStorage.getItem('TodoUser') || null);
  },

}
</script>
<style>
</style>
