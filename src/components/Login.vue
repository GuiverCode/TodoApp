<template>
  <v-app id="inspire">
    <v-content >
      <v-container fluid fill-height>
        <v-layout align-center justify-center>
          <v-flex xs12 sm8 md4>
            <v-card class="elevation-12" style="margin-bottom:250px" >
              <v-toolbar dark color="primary">
                <v-toolbar-title>Todo - Inicio de sesión</v-toolbar-title>
                <v-spacer></v-spacer>
              </v-toolbar>
              <v-card-text>
                <v-form @submit="loginUser($event)">
                  <v-text-field
                    prepend-icon="person"
                    name="login"
                    label="Usuario"
                    type="text"
                    v-model="credenciales.Username"
                    :error-messages="usernameErrors"
                    @input="$v.credenciales.Username.$touch()"
                    @blur="$v.credenciales.Username.$touch()"
                  ></v-text-field>
                  <v-text-field
                    id="password"
                    prepend-icon="lock"
                    name="password"
                    label="Password"
                    :append-icon="ocultarPass ? 'visibility' : 'visibility_off'"
                    :append-icon-cb="() => (ocultarPass = !ocultarPass)"
                    :type="ocultarPass ? 'password' : 'text'"
                    v-model="credenciales.Password"
                    :error-messages="passwordErrors"
                    @input="$v.credenciales.Password.$touch()"
                    @blur="$v.credenciales.Password.$touch()"
                  ></v-text-field>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" type="submit" :disabled="cargando">Login</v-btn>
                  </v-card-actions>
                </v-form>
              </v-card-text>
            </v-card>
          </v-flex>
          <v-snackbar
            :timeout="1500"
            bottom
            left
            v-model="snackbar.visible"
            :color="snackbar.color"
          >{{snackbar.message}}</v-snackbar>
        </v-layout>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import { validationMixin } from "vuelidate";
import { required } from "vuelidate/lib/validators";
import { SET_TOKEN } from "../plugins/store-mutations";
import { SET_USER } from "../plugins/store-mutations";

export default {
  name: "Login",
  mixins: [validationMixin],
  validations: {
    credenciales: {
      Username: { required },
      Password: { required }
    }
  },
  data: () => ({
    credenciales: {
      Username: null,
      Password: null
    },
    valid: false,
    snackbar: {
      visible: false,
      message: null,
      color: "info"
    },
    ocultarPass: true,
    cargando: false
  }),
  methods: {
    loginUser(event) {
      event.preventDefault();
      if (!this.$v.$invalid) {
        this.cargando = true;
        this.$http
          .post("http://localhost:5002/api/" + "auth", this.credenciales)
          .then(response => response.json())
          .then(
            res => {
              if (res.token) {
                //setea usuario
                this.$store.commit(SET_USER, res.usuario);
                //setea token
                this.$store.commit(SET_TOKEN, res.token);
                this.$router.push("/");
              } else {
                this.snackbar.message = "Verifique el usuario y la contraseña";
                this.snackbar.visible = true;
                this.snackbar.color = "error";
              }
              this.cargando = false;
            },
            err => {
              this.snackbar.message =
                err.status === 401
                  ? "Verifique el usuario y la contraseña"
                  : "Ocurrió un error. Revise su conexión en inténtelo de nuevo";
              this.snackbar.visible = true;
              this.snackbar.color = "error";
              this.cargando = false;
            }
          );
      } else {
        this.$v.$touch();
        this.snackbar.message = "Complete los campos requeridos";
        this.snackbar.visible = true;
        this.snackbar.color = "error";
      }
    },

    loginAuth() {
      //verifica si hay usuario logeado
      const token = this.$store.getters.isLoggedIn;
      if (!token) {
        //sino se redirige al login
        this.$router.push("/login");
      } else {
        //si hay, se redirige a home
        this.$router.push("/");
      }
    }
  },
  created: function() {
    this.loginAuth();
  },
  computed: {
    // Validations
    usernameErrors() {
      const errors = [];
      if (!this.$v.credenciales.Username.$dirty) return errors;
      !this.$v.credenciales.Username.required &&
        errors.push("Debe ingresar su nombre de usuario");
      return errors;
    },
    passwordErrors() {
      const errors = [];
      if (!this.$v.credenciales.Password.$dirty) return errors;
      !this.$v.credenciales.Password.required &&
        errors.push("Debe ingresar su contraseña");
      return errors;
    }
  }
};
</script>

<style>
</style>
