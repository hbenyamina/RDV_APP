<template>
  <v-layout>
    <v-row md12>
      <v-container>
        <v-subheader>RDV d'aujourd'hui</v-subheader>
      </v-container>
      <v-container class="ma-4">
        <v-chip-group>
          <v-chip color="secondary">{{datePicker}}</v-chip>
          <v-btn @click="showDate= !showDate">Choose date</v-btn>
          <v-btn class="primary ms-4" @click="searchDate(datePicker)">
          <v-icon>mdi-find</v-icon>Search
        </v-btn>
        </v-chip-group>
        <v-overlay :value="showDate">
          <v-btn text @click="showDate = false">
            <v-icon>mdi-close</v-icon>Close
          </v-btn>
          <v-container>
            <v-date-picker show-current v-show="showDate" color="primary" v-model="datePicker"></v-date-picker>
          </v-container>
        </v-overlay>
        
      </v-container>
      <v-container>
        <v-data-table :headers="headers" :items="data" :items-per-page="5" class="elevation-1"></v-data-table>
      </v-container>
    </v-row>
  </v-layout>
</template>
<script>
export default {
  props: ["headers", "data"],
  data() {
    return {
      datePicker: new Date().toISOString().substr(0, 10),
      showDate: false
    };
  },
  methods: {
    searchDate: function(date) {
      this.$emit("updateDashboard", date);
    }
  }
};
</script>