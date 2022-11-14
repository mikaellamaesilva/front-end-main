<template lang="pug">
div
  h6.m-3(style="cursor: pointer" @click="$router.push({ name: 'Index' })")
    i.bi.bi-arrow-left-circle-fill.me-2
    | Go to main page
  h1.fw-bold.text-center.mt-5 Apply as a Host
  p.fw-light.text-center Getting started is easy, just fill out the form details below.
  p.text-center.text-secondary(style="font-size: 0.8rem;" ) Already have an account? 
    span(style="cursor: pointer; color: #4287f5" @click="$router.push({ name: 'Login' })") Click here to sign in.

  .d-flex.justify-content-center.mt-5
    
    HostsForm(v-model='form' @submitForm='submitForm' :mode='mode' :isLoading='isLoading' :isForPending="true")

</template>

<script>
import HostsForm from "@/components/HostsForm.vue";
import { apiClient } from "@/services/MainService";
export default {
  name: "ApplyAsAHost",
  components: {
    HostsForm,
  },
  data() {
    return {
      form: {
        email: "",
        password: "",
        confirmPassword: "",
        lastName: "",
        firstName: "",
        birthDate: "",
        gender: "",
        address: "",
        country: "Philippines",
        mobileNumber: "",
        avatarImageUrl: "",
        upliveName: "",
        instagramAccount: "",
        facebookAccount: "",
        tiktokAccount: "",
        talentManager: "",
        referralName: "",
        specialTalent: "",
        videoLink: "",
      },
      isLoading: false,
    };
  },
  methods: {
    async submitForm() {
      this.isLoading = true;
      if (this.mode == "create") {
        try {
          await apiClient.post("/pending-hosts", this.form);
          // eslint-disable-next-line no-undef
          ElNotification({
            title: "Notification",
            message:
              "Your application has been received. Please check your email in a couple of days to know about your application status.",
            type: "success",
            duration: 5000,
          });

          // live-notification
          this.$store.state.websocket.send(
            JSON.stringify({
              message: `An application request has been received from ${this.form.firstName} ${this.form.lastName}.`,
              // eslint-disable-next-line prettier/prettier
              date: new Date().toLocaleString("en-CA",this.$store.state.dateTimeOptions),
              showToHost: false,
              avatarImageUrl: null,
            })
          );

          this.$router.replace({ name: "Login" });
        } catch (error) {
          console.log(error);
        }
      }
      this.isLoading = false;
    },
  },
  computed: {
    mode() {
      var mode = "create";
      return mode;
    },
  },
};
</script>
