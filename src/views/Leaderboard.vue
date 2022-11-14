<template lang="pug">
div
  div(v-if="showHeader")
    span.h2.fw-bold Leaderboard
    el-divider

    div
      el-card(:body-style='{padding:0}' v-loading="isLoading")
        div.px-5.py-4.common-gradient
          .fs-4.fw-bold Overall Leaderboard
          .fs-6.text-secondary(v-if="dates") {{  new Date(dates[0]).toLocaleString('en-CA', $store.state.dateOptions) + " to " + new Date(dates[1]).toLocaleString('en-CA', $store.state.dateOptions) }}
        .p-5
          //- START export button
          .d-flex.justify-content-end(:class="{'d-none': leaderboard.length == 0}")
            el-dropdown.mb-4
              template(#)
                span
                  i.bi.bi-download.me-2
                  span Export 
              template(#dropdown)
                el-dropdown-menu 
                  el-dropdown-item(@click="() => download('spreadsheet')")
                    i.bi.bi-file-earmark-spreadsheet-fill
                    | Spreadsheet (Excel/CSV)
          //- END export button
          .d-flex.justify-content-end 
            el-date-picker(style="max-width: 300px;" type="daterange" range-separator="to" format="MMM DD, YYYY" value-format="YYYY-MM-DD" @change='fetchLeaderboard'  v-model='dates' required start-placeholder="Start date" end-placeholder="End date")
          div.w-100(v-if='leaderboard.length > 0')
            //- :default-sort="{ prop: 'total_ucoins', order: 'descending' }"
            el-table.w-100.mt-3(:data="leaderboard" )
              el-table-column(width="70" label='Rank' type='index')
                template(#default='scope')
                    span.text-center.d-block.my-2(v-if="scope.$index + 1 == 1" style="font-size: 1.75rem") 🥇
                    span.text-center.d-block.my-2(v-else-if="scope.$index + 1 == 2" style="font-size: 1.75rem") 🥈
                    span.text-center.d-block.my-2(v-else-if="scope.$index + 1  == 3" style="font-size: 1.75rem") 🥉
                    span.text-center.d-block.my-2(v-else style="font-size: 1rem") {{ scope.$index + 1 }}
              el-table-column(width="90")
                template(#default='scope')
                  .d-flex.align-items-center
                    el-avatar.me-3(:src='scope.row.host.avatarImageUrl ? scope.row.host.avatarImageUrl : $store.state.defaultAvatar' :size='35')
              el-table-column(label='Name' prop='host.fullName' sortable)
              
              el-table-column(label='Total uCoins' prop='total_ucoins'  width="140" sortable)
              el-table-column(prop='total_hours' label='Total Hours' width="140" sortable)
          div.w-100(v-else)
            el-empty(description='There are no leaderboard data here')
</template>

<script>
import { apiClient } from "@/services/MainService";
import Tag from "@/components/Tag.vue";
export default {
  name: "Leaderboard",
  components: {
    Tag,
  },
  props: {
    showHeader: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      exportDate: "",
      isExporting: false,
      leaderboard: [],
      dates: "",
      isLoading: false,
    };
  },
  methods: {
    download(type) {
      let file = "data:text/csv;charset=utf-8,";
      const data = this.leaderboard.map((lb) => ({
        ...lb,
        id: lb.host.id,
        upliveName: lb.host.upliveName,
        firstName: lb.host.firstName,
        lastName: lb.host.lastName,
      }));
      const fileKey =
        "id,lastName,firstName,upliveName,rank,total_hours,total_ucoins,total_days\r\n";
      file += fileKey;
      const fileKeyArray = fileKey.split(",");

      data.forEach(function (data) {
        let rowDataArray = [];
        fileKeyArray.forEach((key) => {
          rowDataArray.push(data[key.trim()]);
        });

        file += String(rowDataArray.join(",")) + "\r\n";
      });
      var encodedUri = encodeURI(file);

      if (type === "spreadsheet") {
        const link = document.createElement("a");
        link.download = `Leaderboard - ${
          this.dates ? this.dates[0] + " to " + this.dates[1] : "Overall"
        } (${new Date()})`;
        link.href = encodedUri;
        link.click();
      }
    },
    async fetchLeaderboard() {
      this.isLoading = true;

      if (this.dates) {
        const { data } = await apiClient.get(
          `/reports/?reportType=dateRangeLeaderboard&startDate=${this.dates[0]}&endDate=${this.dates[1]}`
        );
        this.leaderboard = data.result;
        if (data.result.length === 0) {
          // eslint-disable-next-line no-undef
          ElNotification({
            title: "Notification",
            message: "There are no data associated with the selected dates.",
            type: "warning",
            duration: 5000,
          });
        }
        this.isLoading = false;
      } else {
        const { data } = await apiClient.get(
          "/reports/?reportType=overallLeaderboard"
        );

        this.leaderboard = data.result;
      }
      this.isLoading = false;
    },
  },
  async beforeRouteEnter(routeTo, routeFrom, next) {
    try {
      var date = new Date(),
        y = date.getFullYear(),
        m = date.getMonth();
      var firstDay = new Date(y, m, 1);
      var lastDay = new Date(y, m + 1, 0);
      const dates = [
        firstDay.toLocaleDateString("en-CA"),
        lastDay.toLocaleDateString("en-CA"),
      ];
      const { data } = await apiClient.get(
        `/reports/?reportType=dateRangeLeaderboard&startDate=${dates[0]}&endDate=${dates[1]}`
      );
      next((component) => {
        component.leaderboard = data.result;
        component.dates = dates;
      });
    } catch (error) {
      console.log(error);
    }
  },
};
</script>
