<template lang="pug">
div
  span.h2.fw-bold Performance Report
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
          el-date-picker(style="max-width: 300px;" type="daterange" range-separator="to" format="MMM DD, YYYY" value-format="YYYY-MM-DD" @change='fetchPerformances'  v-model='dates' required start-placeholder="Start date" end-placeholder="End date")
        div(v-if='series')
          apexchart.mt-3(type='area' :options='options' :series='series' height='200px')
          el-divider
          .row
            .col.col-12.col-md-4 
              .d-flex.justify-content-center
                el-checkbox.text-center( v-model="displayedSeries.Hours" label="ACCUMULATED HOURS" size="large" @change="(value) => checkDisplayed(value, 'Hours')")
              p.fw-bold.text-center.fs-5 {{ yearChartAggregated.total_hours }}
            .col.col-12.col-md-4 
              .d-flex.justify-content-center
                el-checkbox.text-center(v-model="displayedSeries.Days" label="ACCUMULATED DAYS" size="large" @change="(value) => checkDisplayed(value, 'Days')")
              p.fw-bold.text-center.fs-5 {{ yearChartAggregated.total_days }}
            .col.col-12.col-md-4 
              .d-flex.justify-content-center
                el-checkbox.text-center( v-model="displayedSeries.uCoins" label="ACCUMULATED UCOINS" size="large" @change="(value) => checkDisplayed(value, 'uCoins')")
              p.fw-bold.text-center.fs-5 {{ yearChartAggregated.total_ucoins }}
        div(v-else)
          el-empty(description='There are no report data here, select dates to get started')
</template>

<script>
import { apiClient } from "@/services/MainService";
export default {
  name: "ReportPerformance",
  data() {
    return {
      reports: [],
      performanceSummary: [],
      aggregated: {},
      isLoading: false,
      yearChart: "2022",
      yearChartAggregated: {},
      dates: "",
      displayedSeries: {
        Hours: true,
        Days: true,
        uCoins: true,
      },
      options: {
        dataLabels: {
          enabled: false,
        },
        stroke: {
          curve: "smooth",
        },
        legend: {
          show: true,
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
          text: "Company Performance",
          align: "center",
          style: {
            fontSize: "20px",
          },
        },
      },
      series: null,
      seriesBackup: null,
      exportDate: "",
      isExporting: false,
    };
  },
  methods: {
    download(type) {
      let file = "data:text/csv;charset=utf-8,";
      const fileKey = "month,total_hours,total_days,total_ucoins\r\n";
      file += fileKey;
      const fileKeyArray = fileKey.split(",");

      this.performanceSummary.forEach(function (data) {
        let rowDataArray = [];
        fileKeyArray.forEach((key) => {
          rowDataArray.push(data[key.trim()]);
        });

        file += String(rowDataArray.join(",")) + "\r\n";
      });
      var encodedUri = encodeURI(file);

      if (type === "spreadsheet") {
        const link = document.createElement("a");
        link.download = `Performance Report - ${
          this.dates ? this.dates[0] + " to " + this.dates[1] : ""
        } (${new Date()})`;
        link.href = encodedUri;
        link.click();
      }
    },
    // eslint-disable-next-line no-unused-vars
    checkDisplayed(value, key) {
      if (value) {
        const s = this.seriesBackup.find((el) => el.name == key);
        this.series.push(s);
      } else {
        if (!Object.values(this.displayedSeries).includes(true)) {
          this.displayedSeries[key] = true;
          return;
        }
        this.series = this.series.filter((el) => el.name !== key);
      }
    },
    async fetchPerformances() {
      this.isLoading = true;
      if (this.dates) {
        const { data } = await apiClient.get(
          `/reports/?reportType=performance&whole=true&startDate=${this.dates[0]}&endDate=${this.dates[1]}`
        );

        if (data.result.length > 0) {
          const hoursSeries = [];
          const daysSeries = [];
          const ucoinsSeries = [];
          this.yearChartAggregated.total_hours = 0;
          this.yearChartAggregated.total_days = 0;
          this.yearChartAggregated.total_ucoins = 0;
          for (let i = 1; i <= 12; i++) {
            const hasAgg = data.result.find((el) => el.month == i);
            if (hasAgg) {
              hoursSeries.push(hasAgg.total_hours);
              daysSeries.push(hasAgg.total_days);
              ucoinsSeries.push(hasAgg.total_ucoins);
              this.yearChartAggregated.total_hours += Number(
                hasAgg.total_hours
              );
              this.yearChartAggregated.total_days += Number(hasAgg.total_days);
              this.yearChartAggregated.total_ucoins += Number(
                hasAgg.total_ucoins
              );
            } else {
              hoursSeries.push(0);
              daysSeries.push(0);
              ucoinsSeries.push(0);
            }
          }

          this.seriesBackup = [
            {
              name: "Hours",
              data: hoursSeries,
            },
            {
              name: "Days",
              data: daysSeries,
            },
            {
              name: "uCoins",
              data: ucoinsSeries,
            },
          ];

          this.series = this.seriesBackup;
          this.performanceSummary = data.result;
        } else {
          // eslint-disable-next-line no-undef
          ElNotification({
            title: "Notification",
            message: "There are no data associated with the selected dates.",
            type: "warning",
            duration: 5000,
          });
          this.series = null;
        }
        this.isLoading = false;
      } else {
        const { data } = await apiClient.get(
          `/reports/?reportType=overallCompanyPerformance&whole=true`
        );
        if (data.result.length > 0) {
          const hoursSeries = [];
          const daysSeries = [];
          const ucoinsSeries = [];
          this.yearChartAggregated.total_hours = 0;
          this.yearChartAggregated.total_days = 0;
          this.yearChartAggregated.total_ucoins = 0;
          for (let i = 1; i <= 12; i++) {
            const hasAgg = data.result.find((el) => el.month == i);
            if (hasAgg) {
              hoursSeries.push(hasAgg.total_hours);
              daysSeries.push(hasAgg.total_days);
              ucoinsSeries.push(hasAgg.total_ucoins);
              this.yearChartAggregated.total_hours += Number(
                hasAgg.total_hours
              );
              this.yearChartAggregated.total_days += Number(hasAgg.total_days);
              this.yearChartAggregated.total_ucoins += Number(
                hasAgg.total_ucoins
              );
            } else {
              hoursSeries.push(0);
              daysSeries.push(0);
              ucoinsSeries.push(0);
            }
          }

          this.seriesBackup = [
            {
              name: "Hours",
              data: hoursSeries,
            },
            {
              name: "Days",
              data: daysSeries,
            },
            {
              name: "uCoins",
              data: ucoinsSeries,
            },
          ];

          this.series = this.seriesBackup;
          this.performanceSummary = data.result;
        } else {
          // eslint-disable-next-line no-undef
          ElNotification({
            title: "Notification",
            message: "There are no data to show for overall performance.",
            type: "warning",
            duration: 5000,
          });
          this.series = null;
        }
      }
      this.isLoading = false;
    },
    clearChart() {
      this.series = null;
      this.yearChart = "";
    },
  },
  async created() {
    var date = new Date(),
      y = date.getFullYear(),
      m = date.getMonth();
    var firstDay = new Date(y, m, 1);
    var lastDay = new Date(y, m + 1, 0);
    this.dates = [
      firstDay.toLocaleDateString("en-CA"),
      lastDay.toLocaleDateString("en-CA"),
    ];

    await this.fetchPerformances();
  },
};
</script>
