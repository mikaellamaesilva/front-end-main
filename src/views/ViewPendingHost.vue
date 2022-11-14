<template lang="pug">
div
  span.h2.fw-bold 
    BackButton.me-3(:routeTo="{ name: 'PendingHosts' }")
    | View Application
  el-divider
  .d-flex.justify-content-center
    HostsForm(v-model='form' :mode='"view"' :isLoading='isLoading' :isForPending='true')
</template>

<script>
import { apiClient } from "@/services/MainService";
import HostsForm from "@/components/HostsForm.vue";
export default {
  name: "ViewPendingHost",
  components: {
    HostsForm,
  },
  data() {
    return {
      form: {},
      isLoading: false,
    };
  },
  async beforeRouteEnter(routeTo, routeFrom, next) {
    try {
      const id = routeTo.params.id;
      if (id) {
        const { data } = await apiClient.get(`/pending-hosts/${id}`);
        next((component) => {
          delete data.result.password;
          component.form = data.result;
        });
      } else {
        next();
      }
    } catch (error) {
      console.log(error);
    }
  },
};
</script>
