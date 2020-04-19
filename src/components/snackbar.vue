<template>
  <div class="text-center">
    <v-snackbar v-model="showsnackbar" :timeout="timeout">
      {{ text }}
      <v-btn color="blue" text @click="updatesnackbar(false)">
        Close
      </v-btn>
    </v-snackbar>
  </div>
</template>
<script>
    export default {
        props: [
            'snackbar',
            'text',
            'timeout'
        ],
        computed: {
            showsnackbar: {
                get: function() {
                    return this.snackbar;
                },
                set: function(value) {
                    this.updatesnackbar(value);
                }
            }
        },
        methods: {
            updatesnackbar(value) {
                this.$emit('updatesnackbar', value);
            }
        }
    }
</script>