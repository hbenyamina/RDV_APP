<template>
  <div class="text-center">
    <v-snackbar right v-model="showsnackbar" :timeout="0">
      <v-card>
        <v-list-item  v-for="(event,index) in events" :key="index">
          <v-list-item-content :color="event.type">{{event.text}}</v-list-item-content>
        </v-list-item>
      </v-card>
      <v-btn color="blue" text @click="updatesnackbar(false)">clear</v-btn>
    </v-snackbar>
  </div>
</template>
<script>
export default {
  props: ["snackbar", "events", "timeout"],
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
      this.$emit("clearsnackbar", value);
    }
  }
};
</script>