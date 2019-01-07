<template>
  <div class="sidenav-base">
    <v-navigation-drawer
      fixed
      :clipped="$vuetify.breakpoint.mdAndUp"
      app
      v-model="drawer"
      mobile-break-point="960"
    >
      <v-list>
        <!--:to="{name: item.name}"-->
        <v-list-tile v-for="item in items" :key="item.title" :to="item.link">
          <v-list-tile-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-tile-action>

          <v-list-tile-content>
            <v-list-tile-title>{{ item.title }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    
    <v-toolbar class="main-toolbar white--text" app color="primary" :clipped-left="true">
      <v-toolbar-side-icon @click.stop="drawer = !drawer" class="white--text">
        <!--<v-icon>menu</v-icon>-->
      </v-toolbar-side-icon>
      <v-toolbar-title
        class="app-toolbar-title"
        :class="{'subheading': $vuetify.breakpoint.smAndDown}"
      >
        <strong>Notas App</strong>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-menu bottom left v-if="isLoggedIn">
        <v-btn slot="activator" class="white--text" icon>
          <v-icon medium>account_circle</v-icon>
        </v-btn>
        <v-list>
          <v-list-tile>
            <v-list-tile-title style="cursor: pointer" @click="$router.push('/cuenta')">Mi cuenta</v-list-tile-title>
          </v-list-tile>
          <v-list-tile>
            <v-list-tile-title style="cursor: pointer" @click="logout()">Cerrar sesión</v-list-tile-title>
          </v-list-tile>
        </v-list>
      </v-menu>
    </v-toolbar>
    <v-content>
      <v-container class="px-1">
        <v-layout>
          <v-flex>
            <router-view></router-view>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
  </div>
</template>

<script>
export default {
  name: "SidenavBase",
  data: () => ({
    title: "Todo App",
    items: [
      { title: "Notas", link: "/notas", icon: "assignment"},
      { title: "Notificaciones", link: "/about", icon: "notifications"},
      // aqui van las opciones de la barra lateral
    ],
    drawer: null
  }),
  computed: {
    /*hayPersonaSeleccionada() {
        return !!this.$route.params.idPersona;
      },*/
    isLoggedIn() {
      //TODO: Preguntar si el usuario está logeado
      //return this.$store.getters.isLoggedIn;
      return true;
    }
  },
  methods: {
    logout() {
      this.$store.dispatch('logout');
      this.$router.push('/login');
    }
  }
};
</script>

<style scoped>
.main-toolbar::after {
  content: "";
  /*background: url("../assets/banner-recortado.jpg") no-repeat;
  background-position-y: 10%;
  background-position-x: right;
  background-size: auto 100%;
  opacity: 0.75;*/
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  position: absolute;
  z-index: -1;
}
@media only screen and (min-width: 961px) and (max-width: 1264px) {
  .main-toolbar::after {
    background-position-x: 75%;
  }
}
@media only screen and (min-width: 601px) and (max-width: 960px) {
  .main-toolbar::after {
    background-position-x: 80%;
  }
}

@media only screen and (max-width: 600px) {
  .main-toolbar::after {
    background-position-x: 85%;
    opacity: 0.3;
    /*background-size: auto 120%;*/
  }
}
</style>
