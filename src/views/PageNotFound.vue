<template lang="pug">
div.vh-100
  el-empty.h-100(image="https://i.ibb.co/mzbNxLc/580185.png" )
    template(#description)
      p The requested information does not exist. 
      el-link(type="primary" @click='$router.replace({ name: "Dashboard" })') Click here to go back to the application.
</template>

<script>
export default {
  name: "PageNotFound",
  async created() {},
};
</script>
