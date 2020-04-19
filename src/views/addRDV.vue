<template>
  <v-content class="ma-5 pa-4">
    <v-form ref="form" v-model="valid" lazy-validation>
      <v-text-field v-model="name" :counter="10" :rules="nameRules" label="Name" required></v-text-field>
      <v-text-field v-model="prenom" :counter="10" :rules="prenomRules" label="Prenom" required></v-text-field>
      <v-text-field v-model="address" :rules="addressRules" label="Adress" required></v-text-field>
      <v-text-field v-model="phone" :rules="phoneRules" label="phone"></v-text-field>
      <v-text-field v-model="email" :rules="emailRules" label="E-mail"></v-text-field>
      <v-text-field v-model="medical_info" :rules="medical_info_Rules" label="Medical Info" required></v-text-field>
  
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
    class Patient {
        constructor(Nom, Prenom, Addresse, Tel, Mail, InfoMed, ID = null) {
            this.ID = ID;
            this.Nom = Nom;
            this.Prenom = Prenom;
            this.Addresse = Addresse;
            this.Tel = Tel;
            this.Mail = Mail;
            this.InfoMed = InfoMed;
        }

    }

    class RENDEZVS {
        constructor(IDPat, DateHeure, Objet, ID = null) {
            this.ID = ID;
            this.IDPat = IDPat;
            this.DateHeure = DateHeure;
            this.Objet = Objet;
        }
    }

    export default {
        data: () => ({
            valid: true,
            name: null,
            nameRules: [
                v => !!v || 'Name is required',
                v => (v && v.length <= 10) || 'Name must be less than 10 characters',
            ],
            prenom: null,
            prenomRules: [
                v => !!v || 'Prenom is required',
                v => (v && v.length <= 10) || 'Prenom must be less than 10 characters',
            ],
            email: null,

            emailRules: [
                v => !!v || true,
                v => /^$|(.+@.+\..+)/.test(v) || 'E-mail must be valid',
            ],
            address: '',

            addressRules: [
                v => !!v || 'Address is required',
                v => (v && v.length <= 10) || 'Address must be less than 10 characters',
            ],
            phone: null,
            phoneRules: [
                v => !!v || true,
                v => /^([0123456789])*$/.test(v) || 'Not a valid number',
            ],
            medical_info: null,

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
                if (this.$refs.form.validate())
                    this.$emit("accessStorage", {
                        type: 'add',
                        data: [
                            new Patient(this.name, this.prenom, this.address, this.phone, this.email, this.medical_info),
                            new RENDEZVS()
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