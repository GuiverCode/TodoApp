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
          <template v-for="(item, index) in tareas">
            <v-list-tile :key="item.id">
              <v-list-tile-action>
                <v-checkbox v-model="item.completado"></v-checkbox>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title v-html="item.nombre" :class="{completado:item.completado}"></v-list-tile-title>
                <v-list-tile-sub-title v-if="item.fechaVencimiento">Fecha: {{item.descripcion}}</v-list-tile-sub-title>
              </v-list-tile-content>
              <v-list-tile-action>
                <v-icon @click="hacerAlgo">delete</v-icon>
              </v-list-tile-action>
            </v-list-tile>
            <v-divider :key="index"></v-divider>
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
// @ is an alias to /src

export default {
  name: "tareas",
  components: {
    //HelloWorld
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
    // obtiene el usuario logeado
    this.usuario = JSON.parse(window.localStorage.getItem("TodoUser") || null);
    // obtiene las tareas del usuario
    this.getTareas();
  },
  methods: {
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
          }
        );
    },
    hacerAlgo() {
      window.console.log("Hacer algo");
    },
    cambiarEstadoTarea(n) {
      var id = n.id;
      let tareaActualizada = {};

      tareaActualizada.nombre = n.nombre;
      tareaActualizada.descripcion = n.descripcion;
      tareaActualizada.completado = n.completado;
      tareaActualizada.idUsuario = this.usuario.id;

      this.$http
        .put(`${process.env.VUE_APP_ROOT_API}todo/` + id, tareaActualizada)
        .then(
          function(response) {
            this.snackbar.message = tareaActualizada.completado
              ? "Completaste: " + tareaActualizada.nombre
              : "Pendiente: " + tareaActualizada.nombre;
            this.snackbar.visible = true;
            this.snackbar.color = tareaActualizada.completado ? "info" : "green";
          },
          () => {
            this.snackbar.message =
              "Ocurrió un error. Revise su conexión en inténtelo de nuevo";
            this.snackbar.visible = true;
            this.snackbar.color = "error";
          }
        );
    }
  },
  computed: {
    vacio() {
      return this.ok && this.tareas.length == 0;
    }
  },
  watch: {
    tareas: {
      handler(val, oldVal) {
        if (oldVal.length != 0) {
          // la 1ra vez oldVal esta vacio
          this.$http
            .get(`${process.env.VUE_APP_ROOT_API}todo/user/` + this.usuario.id)
            .then(response => response.json())
            .then(
              tareas => {
                var tareasDb = tareas;
                var n, i, j;
                // buscamos la nota que acaba de ser actualizada, comparando con la bd.
                for (i = 0; i < tareasDb.length; i++) {
                  for (j = 0; j < tareasDb.length; j++) {
                    if (
                      tareasDb[i].id == this.tareas[j].id &&
                      tareasDb[i].completado != this.tareas[j].completado
                    ) {
                      n = this.tareas[j]; // la nota que cambio de estado
                    }
                  }
                }
                this.cambiarEstadoTarea(n);
              },
              () => {
                this.snackbar.message =
                  "Ocurrió un error. Revise su conexión en inténtelo de nuevo";
                this.snackbar.visible = true;
                this.snackbar.color = "error";
              }
            );
        }
      },
      deep: true
    }
  }
};
</script>
<style>
.completado {
  text-decoration: line-through;
}
</style>
