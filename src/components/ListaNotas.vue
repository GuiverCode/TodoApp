<template>
  <div class="home">
    <v-card>
      <v-toolbar class="white--text" color="info">
        <v-toolbar-title>Notas</v-toolbar-title>
      </v-toolbar>

      <v-card-text class="text-xs-center" v-if="cargandoTareas">
        <div class="text-xs-center">
          <v-progress-circular indeterminate color="primary"></v-progress-circular>
        </div>
        <p>Cargando...</p>
      </v-card-text>

      <v-card-text v-else-if="error" class="text-xs-center">
        <v-icon large color="error">error</v-icon>
        <br>Por favor, revise su conexión e intente nuevamente.
      </v-card-text>

      <v-card-text v-else-if="vacio">No hay tareas pendientes.</v-card-text>

      <v-card-text v-else>
        <!--hay tareas-->
        <v-list>
          <template v-for="(tarea, index) in tareas">
            <NotaItem
              :key="index"
              :tarea = "tarea">
            </NotaItem>
          </template>
        </v-list>
      </v-card-text>
    </v-card>
    <v-snackbar
      :timeout="1500"
      bottom
      left
      v-model="snackbar.visible"
      :color="snackbar.color"
    >{{snackbar.message}}</v-snackbar>
  </div>
</template>

<script>
import NotaItem from "./NotaItem";
export default {
  name: "tareas",
  components: {
    NotaItem
  },
  data() {
    return {
      usuario: {},
      ok: false,
      tareas: [],
      cargandoTareas: false,
      error: false,
      checkbox: true,
      tareaActualizada: {},
      snackbar: {
        visible: false,
        message: null,
        color: "info"
      }
    };
  },
  mounted() {
    this.getUsuario();
    this.getTareas();
  },
  methods: {
    getUsuario(){
      this.usuario = JSON.parse(window.localStorage.getItem("TodoUser") || null);
    },
    getTareas() {
      this.cargandoTareas = true;
      this.$http
        .get(`${process.env.VUE_APP_ROOT_API}todo/user/` + this.usuario.id)
        .then(response => response.json())
        .then(
          tareas => {
            this.tareas = tareas;
            this.ok = true;
            this.cargandoTareas = false;
          },
          () => {
            this.error = true;
            this.tareas = [];
            this.cargandoTareas = false;
            this.snackbar.message ="Ocurrió un error al intentar obtener las tareas";
            this.snackbar.color= "error";
            this.snackbar.visible ="true";
          }
        );
    },
  },
  computed: {
    vacio() {
      return this.ok && this.tareas.length == 0;
    }
  },
};
</script>
<style>
.completado {
  text-decoration: line-through;
}
</style>
