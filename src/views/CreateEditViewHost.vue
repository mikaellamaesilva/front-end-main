<template lang="pug">
div
  span.h2.fw-bold(v-if='$route.query.action')
    | Account Settings
  span.h2.fw-bold(v-else-if='!$store.state.userDetails.adminLevel.includes("admin") && !$route.query.action')
    | My Profile
  span.h2.fw-bold(v-else-if='mode == "create"') 
    BackButton.me-3(:routeTo="{ name: 'Hosts' }")
    | Create Host
  span.h2.fw-bold(v-else-if='mode == "edit"')
    BackButton.me-3(:routeTo="{ name: 'Hosts' }")
    | Edit Host
  span.h2.fw-bold(v-else-if='mode == "view"')
    BackButton.me-3(:routeTo="{ name: 'Hosts' }")
    | View Host
  el-divider
  .d-flex.justify-content-center
    HostsForm(v-model='form' @submitForm='submitForm' :mode='mode' :isLoading='isLoading')
</template>

<script>
import { apiClient } from "@/services/MainService";
import HostsForm from "@/components/HostsForm.vue";
import store from "@/store/index";
import router from "@/router/index";
export default {
  name: "CreateEditHost",
  components: {
    HostsForm,
  },
  data() {
    return {
      form: {
        id: "",
        email: "",
        oldPassword: "",
        password: "",
        confirmPassword: "",
        lastName: "",
        firstName: "",
        birthDate: "",
        gender: "",
        address: "",
        country: "",
        mobileNumber: "",
        // eslint-disable-next-line prettier/prettier
        avatarImageUrl:
          "https://ik.imagekit.io/intelliemed/default-avatar_cunOc4PbJ.jpg?ik-sdk-version=javascript-1.4.3&updatedAt=1660126551582",
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
    async submitForm(event) {
      let form = new FormData(event.target);
      if (!this.$store.getters.validateForm(this.form)) {
        // eslint-disable-next-line no-undef
        ElNotification({
          title: "Notification",
          message: "Input fields are incomplete.",
          type: "error",
          duration: 5000,
        });
        this.isLoading = false;
        return false;
      }

      if (this.form?.password) {
        if (this.form.password !== this.form.confirmPassword) {
          // eslint-disable-next-line no-undef
          ElNotification({
            title: "Notification",
            message: "Passwords do not match.",
            type: "error",
            duration: 5000,
          });
          this.isLoading = false;
          return false;
        }
      }
      this.isLoading = true;
      if (this.mode == "create") {
        try {
          await apiClient.post("/hosts", form, {
            headers: { "Content-Type": "multipart/form-data" },
          });
          // eslint-disable-next-line no-undef
          ElNotification({
            title: "Notification",
            message: "A new host has been successfully created.",
            type: "success",
            duration: 5000,
          });
          this.$router.replace({ name: "Hosts" });
        } catch (error) {
          console.log(error);
        }
      } else {
        if (this.$route.query.action) {
          if (
            this.form?.password ||
            this.form?.confirmPassword ||
            this.form?.oldPassword
          ) {
            if (
              !this.form?.password?.trim() ||
              !this.form?.confirmPassword?.trim() ||
              !this.form?.oldPassword?.trim()
            ) {
              // eslint-disable-next-line no-undef
              ElNotification({
                title: "Notification",
                message:
                  "You are required to provide your old password, new password, and confirmed new password in order to successfully change your current password.",
                type: "error",
                duration: 5000,
              });
              this.isLoading = false;
              return false;
            }
          }
        }
        try {
          const { data } = await apiClient.patch(
            `/hosts/${this.$route.params.id}`,
            form,
            {
              headers: { "Content-Type": "multipart/form-data" },
            }
          );
          if (!this.$route.query.action) {
            // eslint-disable-next-line no-undef
            ElNotification({
              title: "Notification",
              message: "Host details have been successfully updated.",
              type: "success",
              duration: 5000,
            });
            this.$router.replace({ name: "Hosts" });
          } else {
            const newName = data?.result[1][0]?.fullName;
            const newEmail = data?.result[1][0]?.email;
            let userDetails = JSON.parse(localStorage.getItem("userDetails"));
            userDetails.fullName = newName;
            userDetails.email = newEmail;
            localStorage.setItem("userDetails", JSON.stringify(userDetails));
            // eslint-disable-next-line no-undef
            ElNotification({
              title: "Notification",
              message:
                "Account settings have been successfully updated. You might need to log in again for some changes to take effect.",
              type: "success",
              duration: 5000,
            });
            setTimeout(() => location.reload(), 500);
          }
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
      if (this.$route.path.includes("create")) {
        mode = "create";
      } else if (this.$route.path.includes("edit")) {
        mode = "edit";
      } else {
        mode = "view";
      }
      return mode;
    },
  },
  async beforeRouteEnter(routeTo, routeFrom, next) {
    try {
      const myId = store.state.userDetails.id;
      const routeId = routeTo.params.id;
      const myRole = store.state.userDetails.adminLevel;
      if (!myRole.includes("admin") && myId != routeId) {
        router.replace({ name: "ViewHost", params: { id: myId } });
      }

      const id = routeTo.params.id;
      if (id) {
        const { data } = await apiClient.get(`/hosts/${id}`);
        next((component) => {
          delete data.result.password;
          component.form = data.result;
        });
      } else {
        next();
      }
    } catch (error) {
      console.log(error);
      next({ name: "PageNotFound" });
    }
  },
};
</script>
