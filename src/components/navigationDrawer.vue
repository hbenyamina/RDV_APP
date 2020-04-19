<template>

      <v-navigation-drawer left dark app :mini-variant="minivariant" permanent>
  
        <v-list
          dense
          nav
        >
        <v-list-item link v-on:click="minivariant = !minivariant">
            <v-list-item-icon>
                <v-icon>mdi-expand</v-icon>
              </v-list-item-icon>
    
              <v-list-item-content>
                <v-list-item-title>expand</v-list-item-title>
              </v-list-item-content>
        </v-list-item>
          <v-list-item
            v-for="item in items"
            :key="item.title"
            link
            v-on:click="printItem(item)"
          >
            <v-list-item-icon>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-icon>
  
            <v-list-item-content>
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-navigation-drawer>

  </template>
<script>
    export default {
        props: [
            'items'
        ],
        data() {
            return {
                minivariant: false,
                right: null
            }
        },
        methods: {
            printItem: function(tab) {
                this.$emit('selectView', tab);
            }
        }
    }
</script>