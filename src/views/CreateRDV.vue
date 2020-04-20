<template>
  <v-content class="ma-5 pa-4">
    <v-form ref="form" v-model="valid" lazy-validation>
      <v-layout>
        <v-col md6 sm12>
          <v-subheader>Patient information</v-subheader>
          <v-text-field
            v-model="name"
            :counter="10"
            :rules="nameRules"
            label="Name"
            required
            clearable
          ></v-text-field>
          <v-text-field
            v-model="prenom"
            :counter="10"
            :rules="prenomRules"
            label="Prenom"
            required
            clearable
          ></v-text-field>
        </v-col>

        <v-col md6 sm12>
          <v-subheader>Rendez-vous information</v-subheader>
          <v-chip color="secondary">{{datePicker}}</v-chip>
          <v-btn @click="showDate= !showDate">Choose date</v-btn>
          <v-overlay z-index="5" :value="showDate">
            <v-btn text @click="showDate = false">
              <v-icon>mdi-close</v-icon>Close
            </v-btn>
            <v-container>
              <v-date-picker show-current v-show="showDate" color="primary" v-model="datePicker"></v-date-picker>
            </v-container>
          </v-overlay>
          <v-chip color="secondary">{{timePicker}}</v-chip>
          <v-btn @click="showTime= !showTime">Choose time</v-btn>
          <v-overlay :value="showTime">
            <v-btn text @click="showTime = false">
              <v-icon>mdi-close</v-icon>Close
            </v-btn>
            <v-container>
              <v-time-picker show-current v-show="showTime" color="primary" v-model="timePicker"></v-time-picker>
            </v-container>
          </v-overlay>
          <v-text-field v-model="objet" :rules="objet_Rules" label="Objet" clearable></v-text-field>
        </v-col>
       
      </v-layout>
       <v-row md12>
          <v-btn :disabled="!valid" color="success" class="mr-4" @click="validate">Validate</v-btn>

          <v-btn color="error" class="mr-4" @click="reset">Reset Form</v-btn>

          <v-btn color="warning" @click="resetValidation">Reset Validation</v-btn>
        </v-row>
    </v-form>
  </v-content>
</template>

<script>
//Classes to organise queries
import { Patient, RENDEZVS } from "./../dao.js";

export default {
  data: () => ({
    valid: true,
    datePicker: new Date().toISOString().substr(0, 10),
    timePicker: new Date().toISOString().substr(11, 5),
    name: "foo",
    showDate: false,
    showTime: false,
    nameRules: [
      v => !!v || "Name is required",
      v => (v && v.length <= 10) || "Name must be less than 10 characters"
    ],
    prenom: "bar",
    prenomRules: [
      v => !!v || "Prenom is required",
      v => (v && v.length <= 10) || "Prenom must be less than 10 characters"
    ],
    email: "person@example.com",

    emailRules: [
      v => !!v || true,
      v => /^$|(.+@.+\..+)/.test(v) || "E-mail must be valid"
    ],
    address: "",

    addressRules: [
      v => !!v || "Address is required",
      v => (v && v.length <= 10) || "Address must be less than 10 characters"
    ],
    phone: "+213",
    phoneRules: [
      v => !!v || true,
      v => /^([0123456789])*$/.test(v) || "Not a valid number"
    ],
    medical_info: "Here Goes The medical Infos",
    objet: "",

    medical_info_Rules: [
      v => !!v || "Medical Info is required",
      v =>
        (v && v.length <= 10) || "Medical info must be less than 10 characters"
    ],
    objet_Rules: [
      v => !!v || "Medical Info is required",
      v =>
        (v && v.length <= 10) || "Medical info must be less than 10 characters"
    ],
    select: null,
    items: ["Item 1", "Item 2", "Item 3", "Item 4"],
    checkbox: false
  }),

  methods: {
    validate() {
      //if (this.$refs.form.validate())
      if (true)
        this.$emit("accessStorage", {
          type: "add",
          data: [
            new Patient(
              this.name,
              this.prenom,
              this.address,
              this.phone,
              this.email,
              this.medical_info
            ),
            new RENDEZVS(this.datePicker + "T" + this.timePicker, this.objet)
          ]
        });
      console.log(new Date().toISOString());
    },
    reset() {
      this.$refs.form.reset();
    },
    resetValidation() {
      this.$refs.form.resetValidation();
    }
  }
};
</script>