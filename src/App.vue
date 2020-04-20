<template>
  <v-app>
    <v-app-bar app dark>
      <div class="d-flex align-center">
        <h1 class="d1">RDVApp</h1>
      </div>

      <v-spacer></v-spacer>
    </v-app-bar>
    <navigationDrawer v-bind:items="items" @selectView="printView($event)"></navigationDrawer>
    <v-content>
      <v-subheader>{{currentTabName}}</v-subheader>
      <keep-alive>
        <component
          :is="currentView"
          :data="dashboardData[0].RDVs"
          :filteredData="filteredData"
          :peopleConcerned="peopleConcerned"
          :headers="dashboardData[0].RDVs_headers"
          @updateDashboard="dataSync($event)"
          @accessStorage="accessStorage($event)"
        />
      </keep-alive>
      <snackbar
        @clearsnackbar="snackbarText=[];snackbar=false;"
        :snackbar="snackbar"
        :events="snackbarText"
        :timeout="timeout"
      ></snackbar>
    </v-content>
  </v-app>
</template>

<script>
import navigationDrawer from "./components/navigationDrawer";
import snackbar from "./components/snackbar";
import addRDV from "./views/addRDV";
import searchRDV from "./views/searchRDV";
import Dashboard from "./views/Dashboard";
import { app } from "electron";

import { AppDAO, Patient, RENDEZVS, Imprimante } from "./dao";
let db;
export default {
  name: "App",

  components: {
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
        view: "Dashboard",
        overview: true
      },
      {
        title: "add an appointment",
        icon: "mdi-more",
        view: "addRDV"
      },
      {
        title: "search for an appointement",
        icon: "search",
        view: "searchRDV"
      }
    ],
    currentView: "searchRDV",
    currentTabName: "searchRDV",
    filteredData: [],
    snackbar: false,
    snackbarText: [],
    peopleConcerned: [],
    timeout: 2000,
    dashboardData: [
      {
        RDVs: [],
        RDVs_headers: [
          { text: "Date of the RDV", value: "DateHeure",type:'Date'},
          { text: "L'objet", value: "Objet" }
        ]
      },
      {
        Patients: [],
        headers: [
          { text: "Nom", value: "Nom" },
          { text: "Prenom", value: "Prenom" },
          { text: "Addresse", value: "Addresse" },
          { text: "Tel", value: "Tel" },
          { text: "Mail", value: "Mail" },
          { text: "InfoMed", value: "InfoMed" }
        ]
      }
    ]
  }),
  methods: {
    printView: function(tab) {
      this.currentView = tab.view;
      this.currentTabName = tab.title;
      if (tab.overview) this.dataSync();
    },
    updatesnackbar: function(value, text, type = "success") {
      this.snackbarText.push({ type: type, text: text });
      this.snackbar = value;
      return this.snackbar;
    },
    dataSync(date = null) {
      if (date == null) {
        db.getRdvAujourd().then(function(a) {
          global.App.updatesnackbar(true, "Data Fetched Successfully!!");
          global.App.dashboardData[0].RDVs = [];
          a.forEach(element => {
            global.App.dashboardData[0].RDVs.push({
              DateHeure: element.DateHeure.toISOString().substr(0, 10),
              Objet: element.Objet
            });
          });
        });
      } else {
        db.getRdvJour(date).then(function(a) {
          (a);

          global.App.updatesnackbar(true, "Data Fetched Successfully!!");
          global.App.dashboardData[0].RDVs = [];
          a.forEach(element => {
            global.App.dashboardData[0].RDVs.push({
              DateHeure: element.DateHeure.substr(0, 10),
              Objet: element.Objet
            });
          });
          (global.App.dashboardData);
        });
      }
    },
    accessStorage(event) {
      switch (event.type) {
        case "add":
          event.data.forEach(element => {
            db.insert(element)
              .catch(function name(e) {
                {
                  global.App.updatesnackbar(true, e, "error");
                }
              })
              .then(function name(e) {
                {
                  global.App.updatesnackbar(true, e, "success");
                }
              });
          });

          break;
        case "search":
          event.data.forEach(element => {
            db.getRendezVSByNomPrenom(element.Nom, element.Prenom)
              .catch(function name(e) {
                {
                  global.App.updatesnackbar(true, e, "error");
                }
              })
              .then(function name(e) {
                {
                  global.App.filteredData = e.RDV;
                  global.App.peopleConcerned = e.Patients;
                  global.App.updatesnackbar(
                    true,
                    "Data fetched successfuly",
                    "success"
                  );
                }
              });
          });

          break;
        case "update":
          event.data.forEach(element => {
            db.update(element)
              .catch(function name(e) {
                {
                  global.App.updatesnackbar(true, e, "error");
                }
              })
              .then(function name(e) {
                {
                  (e);

                  global.App.updatesnackbar(
                    true,
                    "Updated successfully",
                    "success"
                  );
                }
              });
          });

          break;
        case "delete":
          event.data.forEach(element => {
            db.delete(element.ID)
              .catch(function name(e) {
                {
                  global.App.updatesnackbar(true, e, "error");
                }
              })
              .then(function name(e) {
                {
                  global.App.updatesnackbar(true, e, "success");
                }
              });
          });
          break;
        case "print":
          var database = db;
          var printer = new Imprimante(database);
          event.data.forEach(element => {
            printer.imprimer("file.txt", element.ID);
            global.App.updatesnackbar(true, "success", "success");
          });
          break;
        default:
          break;
      }
    }
  },
  mounted: function() {
    db = new AppDAO("./db/rdv.db");
    global.App = this;
    this.dataSync();
  },
  beforeDestroy: function() {
    db.closeConnec();
  }
};
</script>