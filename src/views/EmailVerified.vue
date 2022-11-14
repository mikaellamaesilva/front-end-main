<template lang="pug">
div.vh-100
  el-empty.h-100(image="https://ik.imagekit.io/intelliemed/285-2852276_email-id-verification-reminder-plugin-verify-email-illustration__1__x5lswFHDn.png?ik-sdk-version=javascript-1.4.3&updatedAt=1660069209499" )
    template(#description)
      p Your email has been successfully verified. 
      el-link(type="primary" @click='$router.replace({ name: "Login" })') Click here to log in.
</template>

<script>
import { apiClient } from "@/services/MainService";
export default {
  name: "EmailVerified",
  computed: {
    token() {
      return this.$route.query.token;
    },
  },
  async created() {
    try {
      await apiClient.get(`/auth/verify-email?token=${this.token}`);
    } catch (err) {
      console.log(err);
    }
  },
};
</script>
