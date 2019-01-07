<template>
  <div class="home">
    <v-card>
      <v-toolbar class="white--text" color="info">
        <v-toolbar-title>Notas</v-toolbar-title>
      </v-toolbar>

      <v-card-text class="text-xs-center" v-if="cargandoNotas">
        <div class="text-xs-center">
          <v-progress-circular indeterminate color="primary"></v-progress-circular>
        </div>
        <p>Cargando...</p>
      </v-card-text>

      <v-card-text v-else-if="error" class="text-xs-center">
        <v-icon large color="error">error</v-icon>
        <br>Por favor, revise su conexión e intente nuevamente.
      </v-card-text>

      <v-card-text v-else-if="vacio">No hay notas pendientes.</v-card-text>

      <v-card-text v-else>
        <!--hay notas-->
        <v-list>
          <template v-for="(item, index) in notas">
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
  name: "notas",
  components: {
    //HelloWorld
  },
  data() {
    return {
      usuario: {},
      ok: false,
      notas: [],
      cargandoNotas: false,
      error: false,
      checkbox: true,
      idNotaActualizada: -1,
      snackbar: {
        visible: false,
        message: null,
        color: "info"
      }
    };
  },
  mounted() {
    this.usuario = JSON.parse(window.localStorage.getItem("TodoUser") || null);
    this.getTareas();
  },
  methods: {
    getTareas() {
      this.cargandoNotas = true;
      this.$http
        .get(`${process.env.VUE_APP_ROOT_API}todo/user/` + this.usuario.id)
        .then(response => response.json())
        .then(
          notas => {
            this.notas = notas;
            this.ok = true;
            this.cargandoNotas = false;
          },
          () => {
            this.error = true;
            this.notas = [];
            this.cargandoNotas = false;
          }
        );
    },
    hacerAlgo() {
      window.console.log("Hacer algo");
    },
  },
  computed: {
    vacio() {
      return this.ok && this.notas.length == 0;
    }
  },
  watch: {
    notas: {
      handler(val, oldVal) {
        if (oldVal.length != 0) {
          //obtenenemos las notas de la bd para actualizar los cambios.
          this.$http
            .get(`${process.env.VUE_APP_ROOT_API}todo/user/` + this.usuario.id)
            .then(response => response.json())
            .then(
              notas => {
                var notasDb = notas;
                //comparamos las notas actuales con las notas de la bd
                const index = notasDb.findIndex(function(t, i) {
                  return t.completado !== val[i].completado;
                });
                console.log(index);
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
