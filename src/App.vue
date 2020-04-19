<template>
  <v-app>
    <v-app-bar app  dark>
      <div class="d-flex align-center">
        <h1 class="d1">RDVApp</h1>
      </div>

      <v-spacer></v-spacer>
    </v-app-bar>
    <navigationDrawer v-bind:items="items" @selectView="printView($event)"></navigationDrawer>
    <v-content>
      <keep-alive>
        <component :is="currentView" :data="Patients" :headers="headers" @accessStorage="accessStorage($event)" />
      </keep-alive>
      <snackbar
        @updatesnackbar="updatesnackbar($event)"
        :snackbar="snackbar"
        :text="snackbarText"
        :timeout="timeout"
      ></snackbar>
    </v-content>
  </v-app>
</template>

<script>
import HelloWorld from "./components/HelloWorld";
import navigationDrawer from "./components/navigationDrawer";
import snackbar from "./components/snackbar";
import addRDV from "./views/addRDV";
import searchRDV from "./views/searchRDV";
import Dashboard from "./views/Dashboard";
import { app } from "electron";

import { AppDAO, Patient, RENDEZVS } from "./dao";
let db;
export default {
  name: "App",

  components: {
    HelloWorld,
    navigationDrawer,
    snackbar,
    addRDV,
    searchRDV,
    Dashboard
  },

  data: () => ({
    items: [
      {
        title: "Dashboard",
        icon: "mdi-view-dashboard",
        view: "Dashboard"
      },
      {
        title: "add an appointment",
        icon: "mdi-image",
        view: "addRDV"
      },
      {
        title: "search for an apintement",
        icon: "mdi-search",
        view: "searchRDV"
      }
    ],
    currentView: "addRDV",
    snackbar: false,
    snackbarText: "My timeout is set to 2000.",
    timeout: 2000,
    Patients: [],
    headers: [
      { text: "Nom", value: "Nom" },
      { text: "Prenom", value: "Prenom" },
      { text: "Addresse", value: "Addresse" },
      { text: "Tel", value: "Tel" },
      { text: "Mail", value: "Mail" },
      { text: "InfoMed", value: "InfoMed" }
    ]
  }),
  methods: {
    printView: function(tab) {
      this.currentView = tab.view;
    },
    updatesnackbar: function(text) {
      this.snackbarText = text;
      this.snackbar = true;
      return this.snackbar;
    },
    fetchObjectsById() {
      return false;
    },
    accessStorage(event) {
      switch (event.type) {
        case "add":
          console.log("add event", event);
          event.data.forEach(element => {
            db.insert(element).then(function name(e) {
              {
                //console.log("addedd successfully");
                console.log(global.App.updatesnackbar('Added successfully'));
              }
            });
          });
          

          break;
        case "search":
          console.log("search event", event);

          break;
        default:
          break;
      }
    }
  },
  mounted: function() {
    db = new AppDAO("./rdv.db");
    global.App = this;
    db.getAllPatients().then(function(a) {
            global.App.updatesnackbar("Data Fetched Successfully!!");
            a.forEach(element => {
              global.App.Patients.push(element);
            });
          });
  },
  beforeDestroy: function() {
    db.closeConnec();
  }
};
</script>