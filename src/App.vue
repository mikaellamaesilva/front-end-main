<template>
  <router-view />
</template>

<script>
export default {
  data() {
    return {
      calendarActivities: [],
    };
  },
  beforeCreate() {
    this.$store.dispatch("initializeApplication");
    document.title = "E-See Management";
  },
  mounted() {
    this.$nextTick(function () {
      this.$store.dispatch("initializeWebsocket");
    });
  },
  beforeUnmount() {
    if (this.$store.state.websocket) {
      this.$store.state.websocket.close(1000);
    }
  },
};
</script>

<style>
#app {
  font-family: "Inter", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

.el-card {
  box-shadow: 0 0.375rem 0.75rem rgba(140, 152, 164, 0.274) !important;
  border: 0.0625rem solid rgba(231, 234, 243, 0.7) !important;
  /* border: none !important; */
  border-radius: 20px !important;
}

a {
  text-decoration: none;
}

body {
  margin: 0;
}

.text-small {
  font-size: 0.8rem;
}

.letter-spacing-1 {
  letter-spacing: 1px;
}

.prevent-text-overflow {
  text-overflow: ellipsis;
  overflow: hidden;
}

textarea {
  height: 150px;
  resize: none !important;
}

.ul-no-bullet {
  list-style-type: none !important;
}

::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.096);
  border-radius: 3px;
  background-color: #f5f5f5;
}
::-webkit-scrollbar {
  width: 5px;
  height: 5px;
  background-color: #f5f5f5;
}
::-webkit-scrollbar-thumb {
  border-radius: 3px;
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  background-color: #b6b6b6;
}

.create-gradient {
  /* background: rgb(103, 194, 58);
  background: linear-gradient(
    12deg,
    rgba(103, 194, 58, 1) 19%,
    rgba(200, 224, 138, 1) 100%
  ); */
  border-bottom: 1px solid rgb(229, 229, 229);
}

.edit-gradient {
  /* background-color: #0093e9;
  background-image: linear-gradient(160deg, #0093e9 0%, #80d0c7 100%); */
  border-bottom: 1px solid rgb(229, 229, 229);
}

.common-gradient {
  /* background: #005c97;
  background: -webkit-linear-gradient(to left, #363795, #005c97);
  background: linear-gradient(to left, #363795, #005c97); */
  border-bottom: 1px solid rgb(229, 229, 229);
}

.el-notification__content {
  text-align: left !important;
}

@media only screen and (max-width: 700px) {
  #app {
    display: none;
  }
}

.dblue {
  color: #082a5c;
}
</style>
