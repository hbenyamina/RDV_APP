<template>
  <v-content class="ma-5 pa-4">
    <v-form ref="form" v-model="valid" lazy-validation>
      <v-text-field v-model="name" :counter="10" :rules="nameRules" label="Name" required clearable></v-text-field>
      <v-text-field v-model="prenom" :counter="10" :rules="prenomRules" label="Prenom" required clearable></v-text-field>
      <v-text-field v-model="address" :rules="addressRules" label="Adress" required clearable></v-text-field>
      <v-text-field v-model="phone" :rules="phoneRules" label="phone" clearable></v-text-field>
      <v-text-field v-model="email" :rules="emailRules" label="E-mail" clearable></v-text-field>
      <v-textarea v-model="medical_info" :rules="medical_info_Rules" label="Medical Info" clearable></v-textarea>
  
      <v-btn :disabled="!valid" color="success" class="mr-4" @click="validate">
        Validate
      </v-btn>
  
      <v-btn color="error" class="mr-4" @click="reset">
        Reset Form
      </v-btn>
  
      <v-btn color="warning" @click="resetValidation">
        Reset Validation
      </v-btn>
    </v-form>
  </v-content>
</template>

<script>
    //Classes to organise queries
    import {
        Patient,
        RENDEZVS
    } from './../dao.js'

    export default {
        data: () => ({
            valid: true,
            name: 'foo',
            nameRules: [
                v => !!v || 'Name is required',
                v => (v && v.length <= 10) || 'Name must be less than 10 characters',
            ],
            prenom: 'bar',
            prenomRules: [
                v => !!v || 'Prenom is required',
                v => (v && v.length <= 10) || 'Prenom must be less than 10 characters',
            ],
            email: 'person@example.com',

            emailRules: [
                v => !!v || true,
                v => /^$|(.+@.+\..+)/.test(v) || 'E-mail must be valid',
            ],
            address: '',

            addressRules: [
                v => !!v || 'Address is required',
                v => (v && v.length <= 10) || 'Address must be less than 10 characters',
            ],
            phone: '+213',
            phoneRules: [
                v => !!v || true,
                v => /^([0123456789])*$/.test(v) || 'Not a valid number',
            ],
            medical_info: 'Here Goes The medical Infos',

            medical_info_Rules: [
                v => !!v || 'Medical Info is required',
                v => (v && v.length <= 10) || 'Medical info must be less than 10 characters',
            ],
            select: null,
            items: [
                'Item 1',
                'Item 2',
                'Item 3',
                'Item 4',
            ],
            checkbox: false,
        }),

        methods: {
            validate() {
               
                //if (this.$refs.form.validate())
                if(true)
                    this.$emit("accessStorage", {
                        type: 'add',
                        data: [
                            new Patient(this.name, this.prenom, this.address, this.phone, this.email, this.medical_info),
                            new RENDEZVS(11)
                        ]

                    })
            },
            reset() {
                this.$refs.form.reset()
            },
            resetValidation() {
                this.$refs.form.resetValidation()
            }
        },
    }
</script>