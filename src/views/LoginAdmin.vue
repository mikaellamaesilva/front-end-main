<template lang="pug">
h6.m-3(style="cursor: pointer" @click="$router.push({ name: 'Index' })")
  i.bi.bi-arrow-left-circle-fill.me-2
  | Go to main page
.vh-100.d-flex.align-items-center.justify-content-center.bg
  el-card.p-5(style="max-height: 800px")
    .row
      .col.col-12.col-md-5
        div
          span.fs-5.me-2.dblue(style="font-weight: 800") E-see 
          span.dblue(style="font-weight: 200; font-size: 0.7rem;") FOR ADMINISTRATORS



          div.h1.dblue.mt-5(style="font-weight: 800 !important") Get Started
          span.text-secondary(style="font-weight: 200; font-size: 0.7rem;") This portal is for all types of administrators.
          el-form.mt-5(label-position='top' :model='form' @submit.prevent='login' style="width: 250px;")
            el-form-item(label='Email address')
              el-input(v-model='form.email' required type='email')
            el-form-item(label="Password")
              el-input(v-model='form.password' required type='password' show-password)
            el-button.w-100(type='primary' native-type='submit' style="background-color: #082a5c; border: none !important") Sign in
      .col.col-12.col-md-7.d-none.d-md-block
        div(style="max-width: 500px")
          img.img-fluid(src="@/assets/login-admin.png")
</template>

<script>
import { apiClient } from "@/services/MainService";
export default {
  name: "Login",
  data() {
    return {
      form: {
        email: "",
        password: "",
      },
    };
  },
  methods: {
    async login() {
      try {
        const { data } = await apiClient.post("/auth/loginAdmin", this.form);
        localStorage.setItem("accessToken", data.result.accessToken);
        localStorage.setItem(
          "userDetails",
          JSON.stringify(data.result.userDetails)
        );
        this.$store.dispatch("initializeApplication");
        this.$router.replace({ name: "Dashboard" });
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>

<style scoped>
.bg {
  /* background-image: url("https://ik.imagekit.io/intelliemed/wave__1__DKsRhDjG1.svg?ik-sdk-version=javascript-1.4.3&updatedAt=1660027708742");
  background-repeat: no-repeat;
  background-position: bottom;
  background-size: cover; */
}
</style>
