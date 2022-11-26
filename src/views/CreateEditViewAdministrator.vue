<template lang="pug">
div
  span.h2.fw-bold(v-if='$route.query.action') 
    | Account Settings
  span.h2.fw-bold(v-else-if='mode == "create"') 
    BackButton.me-3(:routeTo="{ name: 'Administrators' }")
    | Create Administrator
  span.h2.fw-bold(v-else-if='mode == "edit"')
    BackButton.me-3(:routeTo="{ name: 'Administrators' }")
    | Edit Administrator
  span.h2.fw-bold(v-else-if='mode == "view"')
    BackButton.me-3(:routeTo="{ name: 'Administrators' }")
    | View Administrator
  el-divider
  .d-flex.justify-content-center
    AdministratorsForm(v-model='form' @submitForm='submitForm' :mode='mode' :isLoading='isLoading')
</template>

<script>
import { apiClient } from "@/services/MainService";
import AdministratorsForm from "@/components/AdministratorsForm.vue";
import store from "@/store";
export default {
  name: "CreateEditAdministrator",
  components: {
    AdministratorsForm,
  },
  data() {
    return {
      form: {
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
        return false;
      }

      if (this.form?.password) {
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
          return false;
        }

        if (this.form.password !== this.form.confirmPassword) {
          // eslint-disable-next-line no-undef
          ElNotification({
            title: "Notification",
            message: "Passwords do not match.",
            type: "error",
            duration: 5000,
          });
          return false;
        }
      }

      this.isLoading = true;
      if (this.mode == "create") {
        try {
          await apiClient.post("/admins", form, {
            headers: { "Content-Type": "multipart/form-data" },
          });
          // eslint-disable-next-line no-undef
          ElNotification({
            title: "Notification",
            message: "A new administrator has been successfully created.",
            type: "success",
            duration: 5000,
          });
          this.$router.replace({ name: "Administrators" });
        } catch (error) {
          console.log(error);
        }
      } else {
        try {
          const { data } = await apiClient.patch(
            `/admins/${this.$route.params.id}`,
            form,
            {
              headers: { "Content-Type": "multipart/form-data" },
            }
          );
          if (!this.$route.query.action) {
            // eslint-disable-next-line no-undef
            ElNotification({
              title: "Notification",
              message: "An administrator has been successfully updated.",
              type: "success",
              duration: 5000,
            });
            this.$router.replace({ name: "Administrators" });
          } else {
            // eslint-disable-next-line no-undef
            ElNotification({
              title: "Notification",
              message:
                "Account settings have been successfully updated. You might need to log in again for some changes to take effect.",
              type: "success",
              duration: 5000,
            });
            const newName = data?.result[1][0]?.fullName;
            const newEmail = data?.result[1][0]?.email;
            let userDetails = JSON.parse(localStorage.getItem("userDetails"));
            userDetails.fullName = newName;
            userDetails.email = newEmail;
            localStorage.setItem("userDetails", JSON.stringify(userDetails));
            setTimeout(() => location.reload(), 900);
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
      const id = routeTo.params.id;
      const role = store.state.userDetails.adminLevel;
      const myId = store.state.userDetails.id;
      if (id) {
        if (role == "superadmin" || (routeTo.query.action && id == myId)) {
          const { data } = await apiClient.get(`/admins/${id}`);
          next((component) => {
            delete data.result.password;
            component.form = data.result;
          });
        }
      } else {
        if (role == "superadmin") {
          next();
        }
      }
    } catch (error) {
      console.log(error);
      next({ name: "PageNotFound" });
    }
  },
};
</script>
