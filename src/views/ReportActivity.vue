<template lang="pug">
div
  span.h2.fw-bold Activity Report
  el-divider
  div

    el-card(shadow='never' :body-style='{padding:0}')
      div.px-5.py-4.common-gradient
        .fs-4.fw-bold Report Chart
      .p-5
        //- START export button
        .d-flex.justify-content-end(:class="{'d-none': series == null}") 
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
        div(v-if='reports.length > 0')
          

          apexchart(type='bar' :options='options' :series='series' height='200px')
          el-divider
          .row
            .col.col-12.col-md-4 
              .d-flex.align-items-center 
                i.bi.bi-globe.fs-2.me-3
                div
                  span.fw-bold.text-secondary.text-small TOTAL COUNT
                  span.fs-3.d-block.fw-bold {{ aggregated.total }}
            .col.col-12.col-md-4 
              .d-flex.align-items-center 
                i.bi.bi-plus-circle-fill.fs-2.me-3
                div
                  span.fw-bold.text-secondary.text-small NEW RECRUITS
                  span.fs-3.d-block.fw-bold {{ aggregated.new }}
            .col.col-12.col-md-4 
                .d-flex.align-items-center 
                  i.bi.bi-exclamation-circle-fill.fs-2.me-3
                  div
                    span.fw-bold.text-secondary.text-small PENDING REQUESTS
                    span.fs-3.d-block.fw-bold {{ aggregated.pending }}
        div(v-else)
          el-empty(description='There are no report data here')
</template>

<script>
import { apiClient } from "@/services/MainService";
export default {
  name: "ReportActivity",
  data() {
    return {
      reports: [],
      hostsWithActivity: [],
      aggregated: {},
      isLoading: false,
      yearChart: "",
      yearChartAggregated: {},
      options: {
        dataLabels: {
          enabled: false,
        },
        stroke: {
          curve: "smooth",
        },
        legend: {
          position: "bottom",
        },
        id: "activity-chart",
        title: {
          text: "Host Status",
          align: "center",
          style: {
            fontSize: "20px",
          },
        },
      },
      series: null,
      exportDate: "",
      isExporting: false,
    };
  },
  methods: {
    download(type) {
      let file = "data:text/csv;charset=utf-8,";
      const fileKey = "id,lastName,firstName,upliveName,status\r\n";
      file += fileKey;
      const fileKeyArray = fileKey.split(",");

      this.hostsWithActivity.forEach(function (data) {
        let rowDataArray = [];
        fileKeyArray.forEach((key) => {
          rowDataArray.push(data[key.trim()]);
        });

        file += String(rowDataArray.join(",")) + "\r\n";
      });
      var encodedUri = encodeURI(file);

      if (type === "spreadsheet") {
        const link = document.createElement("a");
        link.download = `Activity Report (${new Date()})`;
        link.href = encodedUri;
        link.click();
      }
    },
    clearChart() {
      this.series = null;
      this.yearChart = "";
    },
  },
  async beforeRouteEnter(routeTo, routeFrom, next) {
    try {
      const { data } = await apiClient.get(`/reports/?reportType=activity`);

      const { data: pendingData } = await apiClient.get(`/pending-hosts`);
      if (data.result.length > 0) {
        let activeHosts = data.result.filter(
          (el) => el.performances.length > 0
        );
        let activeHostsCount = activeHosts.length;
        let inactiveHosts = data.result.filter(
          (el) => el.performances.length == 0
        );

        let inactiveHostsCount = inactiveHosts.length;
        const series = [
          {
            name: "Count",
            data: [
              {
                x: "Active hosts",
                y: activeHostsCount,
                fillColor: "#62b818",
              },
              {
                x: "Inactive hosts",
                y: inactiveHostsCount,
                fillColor: "#c22121",
              },
            ],
          },
        ];

        const hostsWithActivity = [];
        activeHosts.forEach((host) => {
          host.status = "active";
          hostsWithActivity.push(host);
        });
        inactiveHosts.forEach((host) => {
          host.status = "inactive";
          hostsWithActivity.push(host);
        });
        next((component) => {
          component.series = series;
          component.reports = data.result;
          component.hostsWithActivity = hostsWithActivity;
          component.aggregated.total = data.result.length;
          component.aggregated.new = data.result.filter(
            (el) =>
              new Date(el.recruitmentDate).getMonth() == new Date().getMonth()
          ).length;
          component.aggregated.pending = pendingData.result.length;
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
