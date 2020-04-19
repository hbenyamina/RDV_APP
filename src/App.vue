<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <div class="d-flex align-center">
        <v-img alt="Vuetify Logo" class="shrink mr-2" contain
          src="https://cdn.vuetifyjs.com/images/logos/vuetify-logo-dark.png" transition="scale-transition" width="40" />

        <v-img alt="Vuetify Name" class="shrink mt-1 hidden-sm-and-down" contain min-width="100"
          src="https://cdn.vuetifyjs.com/images/logos/vuetify-name-dark.png" width="100" />
      </div>

      <v-spacer></v-spacer>

      <v-btn href="https://github.com/vuetifyjs/vuetify/releases/latest" target="_blank" text>
        <span class="mr-2">Latest Release</span>
        <v-icon>mdi-open-in-new</v-icon>
      </v-btn>
    </v-app-bar>
    <navigationDrawer v-bind:items="items" @selectView="printView($event)"></navigationDrawer>
    <v-content>
      <component :is="currentView" @accessStorage="accessStorage($event)" />
      <snackbar @updatesnackbar="updatesnackbar($event)" :snackbar="snackbar" :text="snackbarText" :timeout="timeout">
      </snackbar>
    </v-content>
  </v-app>
</template>

<script>
    import HelloWorld from './components/HelloWorld';
    import navigationDrawer from './components/navigationDrawer'
    import snackbar from './components/snackbar'
    import addRDV from './views/addRDV'
    import searchRDV from './views/searchRDV'
    import {
        AppDAO,
        Patient,
        RENDEZVS
    } from './dao'

    export default {
        name: 'App',

        components: {
            HelloWorld,
            navigationDrawer,
            snackbar,
            addRDV,
            searchRDV
        },

        data: () => ({
            items: [{
                title: 'Dashboard',
                icon: 'mdi-view-dashboard',
                view: 'HelloWorld'
            }, {
                title: 'add an appointment',
                icon: 'mdi-image',
                view: 'addRDV'
            }, {
                title: 'search for an apintement',
                icon: 'mdi-search',
                view: 'searchRDV'
            }, ],
            currentView: "HelloWorld",
            snackbar: false,
            snackbarText: 'My timeout is set to 2000.',
            timeout: 2000

        }),
        methods: {
            printView: function(tab) {
                console.log(this);
                this.currentView = tab.view;
                this.snackbar = false;
                this.snackbar = true;


            },
            updatesnackbar: function(value) {
                this.snackbar = value;
            },
            accessStorage(event) {
                switch (event.type) {
                    case 'add':

                        console.log('add event', event);


                        break;
                    case 'search':

                        console.log('search event', event);

                        break;
                    default:

                        break;


                }
            }
        }
    };
</script>