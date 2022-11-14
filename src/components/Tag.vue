<template lang="pug">
.d-flex.align-items-center 
    .circle.me-2
    span.text-small {{ primaryText }}
</template>

<script>
export default {
  name: "Tag",
  props: {
    color: {
      type: String,
      default: "#4287f5",
    },
    primaryText: {
      type: String,
      required: true,
    },
  },
};
</script>

<style scoped>
.circle {
  width: 17px;
  height: 17px;
  background: v-bind(color);
  -moz-border-radius: 70px;
  -webkit-border-radius: 70px;
  border-radius: 70px;
}
</style>
