<template>
  <div>
    <v-list-tile :key="tarea.id">
      <v-list-tile-action>
        <v-checkbox v-model="tarea.completado"></v-checkbox>
      </v-list-tile-action>
      <v-list-tile-content>
        <v-list-tile-title v-html="tarea.nombre" :class="{completado:tarea.completado}"></v-list-tile-title>
        <v-list-tile-sub-title v-if="tarea.fechaVencimiento">Fecha: {{tarea.descripcion}}</v-list-tile-sub-title>
      </v-list-tile-content>
      <v-list-tile-action>
        <v-icon @click="eliminar">delete</v-icon>
      </v-list-tile-action>
    </v-list-tile>
    <v-divider></v-divider>
  </div>
</template>

<script>
export default {
  name: "NotaItem",
  model: {
    prop: "tarea",
    event: "change"
  },
  props: {
    tarea: {
      type: Object,
      required: true,
    },
  },
   data() {
    return {
      usuario: {},
      snackbar: {
        visible: false,
        message: null,
        color: "info"
      }
    };
  },
  methods: {
    eliminar(){
      window.console.log("TODO: eliminar tarea");
    },
    cambiarEstado(){
      var id = this.tarea.id;
      var tarea = {};
      tarea.nombre = this.tarea.nombre;
      tarea.descripcion = this.tarea.descripcion;
      tarea.completado = this.tarea.completado;
      tarea.idUsuario = this.tarea.idUsuario;
      tarea.fechaVencimiento = this.tarea.fechaVencimiento;
      
      this.$http
        .put(`${process.env.VUE_APP_ROOT_API}todo/`+ id, tarea)
        .then(response => {
          window.console.log(tarea.nombre + "cambió a: " + tarea.completado);
        }, () =>{
          window.console.log("Ocurrió un error")
        });
    },
  },
  watch: {
    tarea: {
      handler(){
        window.console.log(this.tarea);
        this.cambiarEstado();
      },
      deep: true
    },
  }
}
</script>

<style scoped>
</style>