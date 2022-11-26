<template lang="pug">
div
    el-card.p-4(:body-style='{padding:0}')
        .d-flex.align-items-center 
            i.bi.bi-currency-dollar.fs-1.me-4(style="color:#1070c9")
            div
                span.fw-bold.text-secondary.text-small ESTIMATED TOTAL PAYOUT (USD)
                span.h3.d-block.fw-bolder {{ hostDashboard.payout.toFixed(2) }}

    el-card.mt-5(:body-style='{padding:0}')
        div.px-5.py-4.common-gradient
            .fs-4.fw-bold Stream Progress for this Month
        .p-5
            div(v-if='hostDashboard.currentMonthPerformance.length > 0')
                div Stream Hours
                el-progress(:text-inside="true" :stroke-width="20" :percentage="percent('hours')" color="#1893b5")
                    span {{ hostDashboard.currentMonthPerformance[0].total_hours }} hours

                div.mt-3 Stream Days
                el-progress(:text-inside="true" :stroke-width="20" :percentage="percent('days')" color="#20bd98")
                    span {{ hostDashboard.currentMonthPerformance[0].total_days }} days

                div.mt-3 uCoins
                el-progress(:text-inside="true" :stroke-width="20" :percentage="percent('uCoins')" color="#d18024")
                    span {{ hostDashboard.currentMonthPerformance[0].total_ucoins }} uCoins
            
            div(v-else)
                el-empty(description='There are no performance data here')

   


</template>

<script>
import { apiClient } from "@/services/MainService";
export default {
  name: "StreamProgress",
  props: {
    hostId: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      adminDashboard: {
        hosts: [],
        performances: [],
        leaderboard: [],
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
        },
        series: null,
      },
      hostDashboard: {
        currentMonthPerformance: [],
        announcements: [],
        calendarActivities: [],
        myData: {},
        suggestedHours: 1,
        payout: 0,
      },
    };
  },
  computed: {
    isAdminRole() {
      return false;
    },
  },
  async created() {
    this.$nextTick(async function () {
      const hostId = this.hostId;
      var date2 = new Date(),
        y2 = date2.getFullYear(),
        m2 = date2.getMonth();
      var firstDay2 = new Date(y2, m2, 1);
      var lastDay2 = new Date(y2, m2 + 1, 0);

      const [
        currentMonthPerformance,
        announcements,
        calendarActivities,
        myData,
      ] = await Promise.all([
        apiClient.get(
          `/performances?hostId=${hostId}&startDate=${firstDay2.toLocaleDateString(
            "en-CA"
          )}&endDate=${lastDay2.toLocaleDateString("en-CA")}`
        ),
        apiClient.get("/announcements"),
        apiClient.get("/calendar-activities"),
        apiClient.get(`/hosts/${hostId}`),
      ]);
      console.log(hostId, currentMonthPerformance);
      this.hostDashboard.currentMonthPerformance =
        currentMonthPerformance.data.result;
      this.hostDashboard.announcements = announcements.data.result.slice(0, 5);
      this.hostDashboard.calendarActivities =
        calendarActivities.data.result.slice(0, 5);
      this.hostDashboard.myData = myData.data.result;

      // calculate suggestedHours
      var date = new Date(),
        y = date.getFullYear(),
        m = date.getMonth();
      var lastDay = new Date(y, m + 1, 0);

      const days = (date_1, date_2) => {
        let difference = date_1.getTime() - date_2.getTime();
        let TotalDays = Math.ceil(difference / (1000 * 3600 * 24));
        return TotalDays;
      };

      const daysLeft = days(lastDay, new Date());
      let remainingHours = 30;

      if (this.hostDashboard.currentMonthPerformance.length > 0) {
        remainingHours =
          30 - this.hostDashboard.currentMonthPerformance[0].total_hours;
      }

      if (remainingHours > -1) {
        this.hostDashboard.suggestedHours = Math.ceil(
          remainingHours / daysLeft
        );
      }

      // calculate payout
      const bonusPayChart = [
        { uCoins: 5000, bonus: 41 },
        { uCoins: 10000, bonus: 72 },
        { uCoins: 15000, bonus: 135 },
        { uCoins: 30000, bonus: 234 },
        { uCoins: 50000, bonus: 450 },
        { uCoins: 100000, bonus: 720 },
        { uCoins: 150000, bonus: 900 },
        { uCoins: 200000, bonus: 1170 },
        { uCoins: 300000, bonus: 1620 },
        { uCoins: 500000, bonus: 3150 },
        { uCoins: 800000, bonus: 4320 },
        { uCoins: 1000000, bonus: 6750 },
        { uCoins: 1500000, bonus: 8100 },
        { uCoins: 2000000, bonus: 10800 },
        { uCoins: 3000000, bonus: 18000 },
      ];

      if (this.hostDashboard.currentMonthPerformance.length > 0) {
        const currentUcoins =
          this.hostDashboard.currentMonthPerformance[0].total_ucoins;
        let currentPayout = currentUcoins / 210;

        let bonus = null;
        bonusPayChart.forEach((item) => {
          if (currentUcoins >= item.uCoins) {
            bonus = item;
          }
        });

        const finalBonus = bonus ? bonus.bonus : 0;

        const finalPayout = Number(currentPayout) + finalBonus;
        this.hostDashboard.payout = finalPayout;
      }
    });
  },
  methods: {
    percent(type) {
      let value = 0;
      if (type == "hours") {
        value =
          this.hostDashboard.currentMonthPerformance[0].total_hours >= 30
            ? 100
            : (this.hostDashboard.currentMonthPerformance[0].total_hours / 30) *
              100;
      } else if (type == "days") {
        value =
          this.hostDashboard.currentMonthPerformance[0].total_days >= 10
            ? 100
            : (this.hostDashboard.currentMonthPerformance[0].total_days / 10) *
              100;
      } else if (type == "uCoins") {
        value =
          this.hostDashboard.currentMonthPerformance[0].total_ucoins >= 30000
            ? 100
            : (this.hostDashboard.currentMonthPerformance[0].total_ucoins /
                30000) *
              100;
      }
      return value;
    },
  },
  // eslint-disable-next-line no-unused-vars
  async beforeRouteEnter(routeTo, routeFrom, next) {
    // const hostId = routeTo.params.id;
    // var date2 = new Date(),
    //   y2 = date2.getFullYear(),
    //   m2 = date2.getMonth();
    // var firstDay2 = new Date(y2, m2, 1);
    // var lastDay2 = new Date(y2, m2 + 1, 0);
    // const [currentMonthPerformance, announcements, calendarActivities, myData] =
    //   await Promise.all([
    //     apiClient.get(
    //       `/performances?hostId=${hostId}&startDate=${firstDay2.toLocaleDateString(
    //         "en-CA"
    //       )}&endDate=${lastDay2.toLocaleDateString("en-CA")}`
    //     ),
    //     apiClient.get("/announcements"),
    //     apiClient.get("/calendar-activities"),
    //     apiClient.get(`/hosts/${hostId}`),
    //   ]);
    // console.log(hostId, currentMonthPerformance);
    // next((component) => {
    //   component.hostDashboard.currentMonthPerformance =
    //     currentMonthPerformance.data.result;
    //   component.hostDashboard.announcements = announcements.data.result.slice(
    //     0,
    //     5
    //   );
    //   component.hostDashboard.calendarActivities =
    //     calendarActivities.data.result.slice(0, 5);
    //   component.hostDashboard.myData = myData.data.result;
    // });
  },
};
</script>
