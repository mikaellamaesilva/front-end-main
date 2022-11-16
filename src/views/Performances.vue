<template lang="pug">
div
  .d-flex.align-items-md-center.flex-wrap.flex-column.flex-md-row
    span.h2.fw-bold Performances (Bulk Create)
  el-divider
  //- pdf wrapper component
  div
    //- report metadata
    div(v-if='hosts.length > 0')
      el-card(shadow='never' :body-style='{padding:0}')
        div.px-5.py-4.common-gradient
            .fs-4.fw-bold {{ new Date(dateToday).toLocaleDateString("en-CA", $store.state.dateOptions) }}
        div.p-5
          el-table.w-100(:data="hosts")
            el-table-column(width="70")
              template(#default='scope')
                el-avatar(:src='scope.row.avatarImageUrl ? scope.row.avatarImageUrl : $store.state.defaultAvatar' :size='35')
            el-table-column(prop='fullName' label='Name' sortable)
            el-table-column(prop='hostId' label='UPLive ID' sortable)
            el-table-column(label='Hours' width="100px")
             template(#default='scope')
              el-input( @keypress="$store.getters.isNumber($event)" v-model="scope.row.hours")
            el-table-column(label='uCoins' width="100px")
             template(#default='scope')
              el-input( @keypress="$store.getters.isNumber($event)" v-model="scope.row.ucoins")
          .d-flex.justify-content-end.mt-5
            el-button(type='primary' @click="submit") 
              i.bi.bi-plus-lg.me-2
              | Save Performances
    div(v-else)
      el-empty(description='There are no host data here')
</template>

<script>
import { apiClient } from "@/services/MainService";
import { cloneDeep } from "lodash";
export default {
  name: "Performances",
  data() {
    return {
      exportDate: "",
      isExporting: false,
      dateToday: new Date().toLocaleDateString("en-CA"),
      hosts: [],
    };
  },
  methods: {
    generatePerformanceForm() {
      const form = {
        date: this.dateToday,
        hours: "",
        ucoins: "",
        hostId: "",
      };

      const hostPerformances = [];

      this.hosts.forEach((host) => {
        const hostPerformance = cloneDeep({
          ...form,
          fullName: host.fullName,
          hostId: host.hostId,
          avatarImageUrl: host.avatarImageUrl,
        });
        hostPerformances.push(hostPerformance);
      });

      this.hosts = hostPerformances;
    },
    async submit() {
      try {
        await apiClient.post("/performances-today", this.hosts);
        // eslint-disable-next-line no-undef
        ElNotification({
          title: "Notification",
          message: "Performance data have been successfully created.",
          type: "success",
          duration: 5000,
        });
        this.generatePerformanceForm();
      } catch (err) {
        console.log(err);
        // eslint-disable-next-line no-undef
        ElNotification({
          title: "Notification",
          message: "Performance data failed to be saved.",
          type: "error",
          duration: 5000,
        });
      }
    },
  },
  async beforeRouteEnter(routeTo, routeFrom, next) {
    try {
      const { data } = await apiClient.get("/hosts");
      const form = {
        date: new Date().toLocaleDateString("en-CA"),
        hours: "",
        ucoins: "",
        hostId: "",
      };

      const hostPerformances = [];

      data.result.forEach((host) => {
        const hostPerformance = cloneDeep({
          ...form,
          fullName: host.fullName,
          hostId: host.id,
          avatarImageUrl: host.avatarImageUrl,
        });
        hostPerformances.push(hostPerformance);
      });

      next((component) => {
        component.hosts = hostPerformances;
      });
    } catch (error) {
      console.log(error);
    }
  },
};
</script>
