<template>
  <v-data-table
    :headers="headers"
    :items="data"
    :items-per-page="5"
    class="elevation-1"
  ></v-data-table>
</template>
<script>
  export default {
    props: [
        'headers',
        'data'
    ],
    data () {
      return {
       
      }
    },
  }
</script>