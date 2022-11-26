<template lang="pug">
div
  .d-flex.align-items-md-center.flex-wrap.flex-column.flex-md-row
      span.h2.fw-bold(v-if="!$store.state.userDetails.adminLevel.includes('admin')")
        BackButton.me-3(:routeTo="{ name: 'ViewHost', params: { id: $store.state.userDetails.id } }")
        | My Performance
      span.h2.fw-bold(v-else)
        BackButton.me-3(:routeTo="{ name: 'Hosts' }")
        | Host Performance
      .ms-md-auto
      el-button(type='primary' @click='prepareCreateMode' v-if="$store.state.userDetails.adminLevel.includes('admin')") 
          i.bi.bi-plus-lg.me-2
          | Add New
  el-divider

  
  div
    .d-flex.align-items-center
        el-avatar.me-4(:src='host.avatarImageUrl ? host.avatarImageUrl : $store.state.defaultAvatar' :size='150')
        div
          span.fw-bold.h1 {{ host.fullName }}
          br
          span.fw-light.text-small.text-secondary UPLive name: {{ host.upliveName }}
          br
          span.fw-light.text-small.text-secondary UPLive ID: {{  host.id }}
          br
          span.fw-light.text-small.text-secondary Date recruited: {{ new Date(host.recruitmentDate).toLocaleString('en-CA', $store.state.dateOptions)  }}
    
    .mt-5 
      stream-progress(v-if='host.id' :host-id="host.id")
    
    div.mt-5(v-if='performances.length > 0')
      el-card(:body-style='{padding:0}' v-if="aggregated" v-loading="isLoading")
        div.px-5.py-4.common-gradient
          .fs-4.fw-bold Performance Chart
        div.p-5
          //- .d-flex.justify-content-end 
          //-   span.fw-bold(:class="{'d-block': isExporting, 'd-none': !isExporting }") {{ yearChart }}
          .d-flex.justify-content-end 
            el-date-picker(style="max-width: 300px;" type="daterange" range-separator="to" format="MMM DD, YYYY" value-format="YYYY-MM-DD" @change='fetchPerformances'  v-model='dates' required start-placeholder="Start date" end-placeholder="End date")
          div(v-if="series")
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
            el-empty(description='There are no performance data for the selected dates')



          
      el-card.mt-5(:body-style='{padding:0}')
        div.px-5.py-4.common-gradient
          .fs-4.fw-bold Performance Data

        .p-5
          //- START export button
          .d-flex.justify-content-end 
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
          .row
            .col.col-12.col-md-4 
              p.fw-bold.text-small.text-center.text-secondary TOTAL HOURS
              p.fw-bold.text-center.fs-5 {{ aggregated.total_hours }}
            .col.col-12.col-md-4 
              p.fw-bold.text-small.text-center.text-secondary TOTAL DAYS
              p.fw-bold.text-center.fs-5 {{ aggregated.total_days }}
            .col.col-12.col-md-4 
              p.fw-bold.text-small.text-center.text-secondary TOTAL UCOINS
              p.fw-bold.text-center.fs-5 {{ aggregated.total_ucoins }}
          el-divider
          el-table.w-100(:data="performances")
            el-table-column(label='Date' sortable :formatter="(row, column) => new Date(row.date).toLocaleString('en-CA', $store.state.dateOptions)")
            el-table-column(prop='hours' sortable label='Hours')
            el-table-column(prop='ucoins' sortable label='uCoins')
            el-table-column(label='Action' v-if="$store.state.userDetails.adminLevel.includes('admin')")
              template(#default='scope')
                div
                  el-button(plain type="primary" link @click='prepareEditMode(scope.row.id)')
                    i.bi.bi-pencil-square
                  el-popconfirm(title='Are you sure you want to delete this?' confirm-button-type='danger' @confirm="deletePerformance(scope.row.id)")
                    template(#reference)
                      el-button(plain type="danger" link)
                        i.bi.bi-trash-fill
    div(v-else)
      el-empty(description='There are no performance data here')

  
  el-drawer(v-model='isOpenedDrawer' direction='rtl' size='40%')
      template(#header)
        span.h5.fw-bold(v-if="isCreateMode") Create Performance
        span.h5.fw-bold(v-else) Edit Performance

      el-form(label-position='left' label-width='140px' :model='form' @submit.prevent='submitForm')
        .h4.mb-3 
          i.bi.bi-info-circle-fill.me-2
          | Performance Details
        el-form-item(label='Date')
          el-date-picker.w-100.date-input(type="date"  format="MMMM D, YYYY" value-format="YYYY-MM-DD" v-model='form.date'  required)

        el-form-item(label='Hours')
          el-input-number.w-100(v-model='form.hours' :min="0"  required)

        el-form-item(label='uCoins')
          el-input-number.w-100(v-model='form.ucoins' :min="0"  required)

        div.d-flex.justify-content-end.mt-3
          el-button.me-2(text :disabled='isLoading' @click="isOpenedDrawer = false") 
            | Discard
          el-button(v-if="isCreateMode" type='primary' native-type='submit' :loading='isLoading') Create
          el-button(v-else type='primary' native-type='submit' :loading='isLoading') Save
</template>

<script>
import { apiClient } from "@/services/MainService";
import StreamProgress from "@/components/StreamProgress.vue";
import store from "@/store/index";
import router from "@/router/index";
export default {
  name: "HostPerformance",
  components: {
    StreamProgress,
  },
  data() {
    return {
      exportDate: "",
      isExporting: false,
      performances: [],
      aggregated: {},
      dates: "",
      form: {
        date: "",
        hours: "",
        ucoins: "",
        hostId: "",
      },
      displayedSeries: {
        Hours: true,
        Days: true,
        uCoins: true,
      },
      oldActivityInfo: {},
      host: {},
      isOpenedDrawer: false,
      isCreateMode: true,
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
          text: "Performance",
          align: "center",
          style: {
            fontSize: "20px",
          },
        },
      },
      series: null,
      seriesBackup: null,
    };
  },
  methods: {
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
    download(type) {
      let file = "data:text/csv;charset=utf-8,";
      const fileKey = "date,hours,ucoins\r\n";
      file += fileKey;
      const fileKeyArray = fileKey.split(",");

      this.performances.forEach(function (data) {
        let rowDataArray = [];
        fileKeyArray.forEach((key) => {
          rowDataArray.push(data[key.trim()]);
        });

        file += String(rowDataArray.join(",")) + "\r\n";
      });
      var encodedUri = encodeURI(file);

      if (type === "spreadsheet") {
        const link = document.createElement("a");
        link.download = `${this.host.fullName} - ID ${
          this.host.id
        } (${new Date()})`;
        link.href = encodedUri;
        link.click();
      }
    },
    async fetchPerformances() {
      this.isLoading = true;
      if (this.dates) {
        const hostId = this.$route.params.id;
        const { data } = await apiClient.get(
          `/performances/?hostId=${hostId}&startDate=${this.dates[0]}&endDate=${this.dates[1]}`
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
        } else {
          // eslint-disable-next-line no-undef
          ElNotification({
            title: "Notification",
            message: "There are no performance data to display.",
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
    prepareCreateMode() {
      this.isCreateMode = true;
      this.form = {
        date: new Date().toLocaleDateString("en-CA"),
        hours: "",
        ucoins: "",
        hostId: this.host.id,
      };
      this.isOpenedDrawer = true;
    },
    prepareEditMode(performanceId) {
      this.isCreateMode = false;
      const performance = Object.assign(
        {},
        this.performances.find((el) => el.id == performanceId)
      );
      this.form.date = performance.date;
      this.form.hours = performance.hours;
      this.form.ucoins = performance.ucoins;
      this.form.performanceId = performanceId;
      this.oldActivityInfo = Object.assign({}, performance);
      this.isOpenedDrawer = true;
    },
    async submitForm() {
      this.isLoading = true;
      if (this.isCreateMode) {
        try {
          const { data } = await apiClient.post("/performances", this.form);
          // eslint-disable-next-line no-undef
          ElNotification({
            title: "Notification",
            message: "A new performance has been successfully created.",
            type: "success",
            duration: 5000,
          });
          this.performances.push(data.result);

          this.aggregated.total_hours += Number(data.result.hours);
          this.aggregated.total_ucoins += Number(data.result.ucoins);
          this.aggregated.total_days += 1;

          setTimeout(() => location.reload(), 900);
        } catch (error) {
          console.log(error);
        }
      } else {
        try {
          // eslint-disable-next-line no-unused-vars
          const { data } = await apiClient.patch(
            `/performances/${this.form.performanceId}`,
            this.form
          );
          // eslint-disable-next-line no-undef
          ElNotification({
            title: "Notification",
            message: "A performance has been successfully updated.",
            type: "success",
            duration: 5000,
          });
          setTimeout(() => location.reload(), 900);
        } catch (error) {
          console.log(error);
        }
      }
      this.isOpenedDrawer = false;
      this.isLoading = false;
      this.clearChart();
    },
    async deletePerformance(performanceId) {
      try {
        await apiClient.delete(`/performances/${performanceId}`);
        const performance = Object.assign(
          {},
          this.performances.find((el) => el.id == performanceId)
        );

        this.aggregated.total_hours -= Number(performance.hours);
        this.aggregated.total_ucoins -= Number(performance.ucoins);
        this.aggregated.total_days -= 1;

        this.performances = this.performances.filter(
          (el) => el.id !== performanceId
        );
        this.clearChart();
        // eslint-disable-next-line no-undef
        ElNotification({
          title: "Notification",
          message: "A performance has been successfully deleted.",
          type: "success",
          duration: 5000,
        });
        location.reload();
      } catch (error) {
        console.log(error);
      }
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
  async beforeRouteEnter(routeTo, routeFrom, next) {
    try {
      const myId = store.state.userDetails.id;
      const routeId = routeTo.params.id;
      const myRole = store.state.userDetails.adminLevel;
      if (!myRole.includes("admin") && myId != routeId) {
        router.replace({ name: "ViewHost", params: { id: myId } });
      }

      const [performances, host] = await Promise.all([
        apiClient.get(`/performances?hostId=${routeTo.params.id}`),
        apiClient.get(`/hosts/${routeTo.params.id}`),
      ]);
      next((component) => {
        component.performances = performances.data.result.individual;
        component.aggregated = performances.data.result.aggregated;
        component.host = host.data.result;
        component.form.hostId = host.data.result.id;
      });
    } catch (error) {
      console.log(error);
    }
  },
};
</script>
