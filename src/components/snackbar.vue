<template>
  <div class="text-center">
    <v-snackbar multi-line right v-model="showsnackbar" :timeout="0">
      <v-content>
        <v-list-item v-for="(event,index) in events" :key="index">
          <v-list-item-content :class="event.type+'--text'"  >{{event.text}}</v-list-item-content>
        </v-list-item>
        <v-btn text color="blue" @click="updatesnackbar(false)">clear</v-btn>
      </v-content>
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