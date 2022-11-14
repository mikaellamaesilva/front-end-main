<template lang="pug">
div
  span.h2.fw-bold Recruitment Report
  .ms-md-auto
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


        .d-flex.justify-content-end 
          span.fw-bold(:class="{'d-block': isExporting, 'd-none': !isExporting }") {{ yearChart }}
          el-date-picker.date-input(:class="{'d-none': isExporting }" type="year" format="YYYY" value-format="YYYY" @change='fetchPerformances'  v-model='yearChart' required placeholder='Select year')
        div(v-if="series")
          apexchart.mt-3(type='area' :options='options' :series='series' height='200px')

          el-table.w-100.mt-5(:data="hosts")
            el-table-column(width="70")
              template(#default='scope')
                el-avatar(:src='scope.row.avatarImageUrl ? scope.row.avatarImageUrl : $store.state.defaultAvatar' :size='35')
            el-table-column(prop='lastName' label='Last name' sortable)
            el-table-column(prop='firstName' label='First name' sortable)
            el-table-column(prop='id' label='UPLive ID' sortable)
            el-table-column(prop='recruitmentDate' label='Recruitment date' sortable :formatter="(row, column) => new Date(row.recruitmentDate).toLocaleString('en-CA', $store.state.dateOptions)")

        div(v-else)
          el-empty(description='There are no report data here')
</template>

<script>
import { apiClient } from "@/services/MainService";
export default {
  name: "ReportRecruitment",
  data() {
    return {
      reports: [],
      hosts: [],
      aggregated: {},
      isLoading: false,
      yearChart: "2022",
      yearChartAggregated: {},
      options: {
        dataLabels: {
          enabled: false,
        },
        stroke: {
          curve: "smooth",
        },
        legend: {
          show: false,
        },
        id: "performance-chart",
        xaxis: {
          categories: [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
          ],
        },
        title: {
          text: "Host Recruitment for the Year",
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
      const fileKey = "id,lastName,firstName,upliveName,recruitmentDate\r\n";
      file += fileKey;
      const fileKeyArray = fileKey.split(",");

      this.hosts.forEach(function (data) {
        let rowDataArray = [];
        fileKeyArray.forEach((key) => {
          rowDataArray.push(data[key.trim()]);
        });

        file += String(rowDataArray.join(",")) + "\r\n";
      });
      var encodedUri = encodeURI(file);

      if (type === "spreadsheet") {
        const link = document.createElement("a");
        link.download = `Recruitment Report - ${
          this.yearChart
        }  (${new Date()})`;
        link.href = encodedUri;
        link.click();
      }
    },
    async fetchPerformances() {
      this.isLoading = true;
      if (this.yearChart) {
        const { data } = await apiClient.get(
          `/reports/?reportType=recruitment&whole=true&year=${this.yearChart}`
        );
        if (data.result.length > 0) {
          const countSeries = [];
          for (let i = 1; i <= 12; i++) {
            const hasAgg = data.result.find((el) => el.month == i);
            if (hasAgg) {
              countSeries.push(hasAgg.count);
            } else {
              countSeries.push(0);
            }
          }

          const hosts = [];
          data.result.forEach((report) => {
            report.hosts.forEach((host) => {
              hosts.push(host);
            });
          });

          this.hosts = hosts;

          this.series = [
            {
              name: "Count",
              data: countSeries,
            },
          ];
        } else {
          // eslint-disable-next-line no-undef
          ElNotification({
            title: "Notification",
            message: "There are no data associated with the selected year.",
            type: "warning",
            duration: 5000,
          });
          this.series = null;
        }
        this.isLoading = false;
      } else {
        this.series = null;
      }
      this.isLoading = false;
    },
    clearChart() {
      this.series = null;
      this.yearChart = "";
    },
  },
  async beforeRouteEnter(routeTo, routeFrom, next) {
    try {
      const year = new Date().getFullYear();
      const { data } = await apiClient.get(
        `/reports/?reportType=recruitment&whole=true&year=${year}`
      );
      if (data.result.length > 0) {
        const countSeries = [];
        for (let i = 1; i <= 12; i++) {
          const hasAgg = data.result.find((el) => el.month == i);
          if (hasAgg) {
            countSeries.push(hasAgg.count);
          } else {
            countSeries.push(0);
          }
        }

        const series = [
          {
            name: "Count",
            data: countSeries,
          },
        ];

        const hosts = [];
        data.result.forEach((report) => {
          report.hosts.forEach((host) => {
            hosts.push(host);
          });
        });

        next((component) => {
          component.reports = data.result;
          component.hosts = hosts;
          component.series = series;
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
