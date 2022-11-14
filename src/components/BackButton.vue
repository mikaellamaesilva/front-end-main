<template lang="pug">
i.bi.bi-arrow-left-circle-fill(@click='$router.push(routeTo)')
</template>

<script>
export default {
  name: "BackButton",
  props: {
    routeTo: {
      type: Object,
      required: true,
    },
  },
};
</script>

<style scoped>
.bi-arrow-left-circle-fill {
  cursor: pointer;
  transition: ease-in 0.15s;
}

.bi-arrow-left-circle-fill:hover {
  opacity: 0.5;
}
</style>
