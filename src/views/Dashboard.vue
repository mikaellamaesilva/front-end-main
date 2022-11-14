<template lang="pug">
div
  span.h2.fw-bold Dashboard
  el-divider
  div(v-if="isAdminRole")
    span.h5.fw-bold.mb-3.d-block Today is {{ new Date().toLocaleString('en-CA', $store.state.dateOptions) }}
    .row 
      .col.col-12.col-md-3.mt-3
        el-card.p-4(:body-style='{padding:0}')
          .d-flex.align-items-center 
            i.bi.bi-people.fs-1.me-4(style="color:#1070c9")
            div
              span.fw-bold.text-secondary.text-small HOSTS
              span.h3.d-block.fw-bolder {{ adminDashboard.hosts.length }}
      .col.col-12.col-md-3.mt-3
        el-card.p-4(:body-style='{padding:0}')
          .d-flex.align-items-center 
            i.bi.bi-currency-dollar.fs-1.me-4(style="color:#1070c9")
            div
              span.fw-bold.text-secondary.text-small UCOINS
              span.h3.d-block.fw-bolder {{ adminDashboard.performances.reduce((n, {total_ucoins}) => n + Number(total_ucoins), 0) }}
      .col.col-12.col-md-3.mt-3
        el-card.p-4(:body-style='{padding:0}')
          .d-flex.align-items-center 
            i.bi.bi-clock-history.fs-1.me-4(style="color:#1070c9") 
            div
              span.fw-bold.text-secondary.text-small HOURS
              span.h3.d-block.fw-bolder {{ adminDashboard.performances.reduce((n, {total_hours}) => n + Number(total_hours), 0) }}
      .col.col-12.col-md-3.mt-3
        el-card.p-4(:body-style='{padding:0}')
          .d-flex.align-items-center 
            i.bi.bi-calendar-date.fs-1.me-4(style="color:#1070c9") 
            div
              span.fw-bold.text-secondary.text-small DAYS
              span.h3.d-block.fw-bolder {{ adminDashboard.performances.reduce((n, {total_days}) => n + Number(total_days), 0) }}
      
    el-card.mt-5.mb-5(:body-style='{padding:0}')
      div.px-5.py-4.common-gradient
        .fs-4.fw-bold Company Performance 
      .p-5
        div(v-if='adminDashboard.series')
          apexchart.mt-3(type='area' :options='adminDashboard.options' :series='adminDashboard.series' height='200px')
          .d-flex.justify-content-end 
            el-link.mt-3.fw-bold(type="primary" @click="$router.push({ name: 'ReportPerformance' })") 
              span View all data
                i.bi.bi-chevron-right.ms-2
        div(v-else)
          el-empty(description='There are no report data here')

    .row.mt-5 
      .col.col-12.col-md-5.mb-5
        el-card.h-100(:body-style='{padding:0}')
          div.px-5.py-4.common-gradient
            .fs-4.fw-bold Hosts
          .p-5
            div(v-if='adminDashboard.hosts.length > 0')
              el-table.w-100(:data="adminDashboard.hosts")
                el-table-column(width="60")
                  template(#default='scope')
                    el-avatar(:src='scope.row.avatarImageUrl ? scope.row.avatarImageUrl : $store.state.defaultAvatar' :size='35')
                el-table-column(prop='fullName' label='Name')
                el-table-column(label='Action')
                  template(#default='scope')
                    div
                      el-popover(title='What do you want to view?' trigger="hover" :width="300" content="this is content, this is content, this is content")
                        template(#reference)
                          el-button(plain type="info" link)
                              i.bi.bi-eye-fill
                        template(#default)
                          el-link.me-5(type='info' @click='$router.push({ name: "ViewHost", params: { id: scope.row.id } })') Host info 
                          el-link(type='info'  @click="$router.push({ name: 'HostPerformance', params: { id: scope.row.id, host: scope.row }, })") Performance
              .d-flex.justify-content-end 
                el-link.mt-3.fw-bold(type="primary" @click="$router.push({ name: 'Hosts' })") 
                  span View all data
                    i.bi.bi-chevron-right.ms-2
            div(v-else)
              el-empty(description='There are no host data here')
      .col.col-12.col-md-7.mb-5
        el-card.h-100(:body-style='{padding:0}')
          div.px-5.py-4.common-gradient
            .fs-4.fw-bold Leaderboard
          .p-5
            div(v-if='adminDashboard.leaderboard.length > 0')
              el-table.w-100.mt-3(:data="adminDashboard.leaderboard")
                el-table-column(width="70" label='Rank')
                  template(#default='scope')
                    span.text-center.d-block.my-2(v-if="scope.row.rank == 1" style="font-size: 1.75rem") 🥇
                    span.text-center.d-block.my-2(v-else-if="scope.row.rank == 2" style="font-size: 1.75rem") 🥈
                    span.text-center.d-block.my-2(v-else-if="scope.row.rank == 3" style="font-size: 1.75rem") 🥉
                    span.text-center.d-block.my-2(v-else) {{ scope.row.rank }}
                el-table-column(label='Name')
                  template(#default='scope')
                    .d-flex.align-items-center
                      el-avatar.me-3(:src='scope.row.host.avatarImageUrl ? scope.row.host.avatarImageUrl : $store.state.defaultAvatar' :size='35')
                      span.fw-bold {{ scope.row.host.fullName }}
              .d-flex.justify-content-end 
                el-link.mt-3.fw-bold(type="primary" @click="$router.push({ name: 'Leaderboard' })") 
                  span View all data
                    i.bi.bi-chevron-right.ms-2
            div(v-else)
              el-empty(description='There are no leaderboard data here')
  div(v-else)
    span.h5.fw-bold.mb-3.d-block Today is {{ new Date().toLocaleString('en-CA', $store.state.dateOptions) }}
    .row 
      .col.col-12.col-md-6.mt-3
        el-card.p-4(:body-style='{padding:0}')
          .d-flex.align-items-center 
            i.bi.bi-person-hearts.fs-1.me-4(style="color:#1070c9")
            div
              span.fw-bold.text-secondary.text-small SUGGESTED DAILY STREAM HOURS
              span.h3.d-block.fw-bolder {{ hostDashboard.suggestedHours || 0 }}
      .col.col-12.col-md-6.mt-3
        el-card.p-4(:body-style='{padding:0}')
          .d-flex.align-items-center 
            i.bi.bi-currency-dollar.fs-1.me-4(style="color:#1070c9")
            div
              span.fw-bold.text-secondary.text-small ESTIMATED TOTAL PAYOUT (USD)
              span.h3.d-block.fw-bolder {{ hostDashboard.payout.toFixed(2) }}

    el-card.mt-5(:body-style='{padding:0}')
      div.px-5.py-4.common-gradient
        .fs-4.fw-bold My Stream Progress
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

    .row.mt-5 
      .col.col-12.col-md-5.mb-5
        el-card.h-100(:body-style='{padding:0}')
          div.px-5.py-4.common-gradient
            .fs-4.fw-bold Announcements
          .p-5
            div(v-if='hostDashboard.announcements.length > 0')
              div(v-for="announcement in hostDashboard.announcements")
                Tag(:primaryText="announcement.type" :color="$store.state.announcementOptions.find(el => el.type == announcement.type).color")
                span.h5.fw-bold {{ announcement.title }}
                span.text-secondary.d-block(style="font-size: 0.6rem;") {{ new Date(announcement.createdAt).toLocaleString('en-CA', $store.state.dateTimeOptions) }}
                el-divider
              .d-flex.justify-content-end 
                el-link.mt-3.fw-bold(type="primary" @click="$router.push({ name: 'Announcements' })") 
                  span View all data
                    i.bi.bi-chevron-right.ms-2
            div(v-else)
              el-empty(description='There are no announcement data here')
      .col.col-12.col-md-7.mb-5
        el-card.h-100(:body-style='{padding:0}')
          div.px-5.py-4.common-gradient
            .fs-4.fw-bold Calendar
          .p-5
            div(v-if='hostDashboard.calendarActivities.length > 0')
              el-table.w-100(:data="hostDashboard.calendarActivities")
                el-table-column(prop='title' label='Title')
                el-table-column(label='Type')
                  template(#default='scope')
                    Tag(:primaryText="scope.row.type" :color="$store.state.announcementOptions.find(el => el.type == scope.row.type).color")
                el-table-column(prop='date' label='Date')
              .d-flex.justify-content-end 
                el-link.mt-3.fw-bold(type="primary" @click="$router.push({ name: 'CalendarActivities' })") 
                  span View all data
                    i.bi.bi-chevron-right.ms-2
            div(v-else)
              el-empty(description='There are no calendar activity data here')


</template>

<script>
import store from "@/store/index";
import { apiClient } from "@/services/MainService";
export default {
  name: "Dashboard",
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
      return this.$store.state.userDetails.adminLevel.includes("admin")
        ? true
        : false;
    },
  },
  created() {
    this.$nextTick(function () {
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
    if (store.state.userDetails.adminLevel.includes("admin")) {
      // eslint-disable-next-line no-unused-vars
      const year = new Date().getFullYear();
      // eslint-disable-next-line no-unused-vars
      var date = new Date(),
        y = date.getFullYear(),
        m = date.getMonth();
      // eslint-disable-next-line no-unused-vars
      var firstDay = new Date(y, m, 1);
      // eslint-disable-next-line no-unused-vars
      var lastDay = new Date(y, m + 1, 0);

      const [hosts, performances, leaderboard] = await Promise.all([
        apiClient.get("/hosts"),
        apiClient.get(
          `/reports/?reportType=performance&whole=true&startDate=2022-01-01&endDate=2023-01-01`
        ),
        apiClient.get("/reports/?reportType=overallLeaderboard"),
      ]);
      let series = null;
      if (performances.data.result.length > 0) {
        const hoursSeries = [];
        const daysSeries = [];
        const ucoinsSeries = [];
        const yearChartAggregated = {
          total_hours: 0,
          total_days: 0,
          total_ucoins: 0,
        };
        for (let i = 1; i <= 12; i++) {
          const hasAgg = performances.data.result.find((el) => el.month == i);
          if (hasAgg) {
            hoursSeries.push(hasAgg.total_hours);
            daysSeries.push(hasAgg.total_days);
            ucoinsSeries.push(hasAgg.total_ucoins);
            yearChartAggregated.total_hours += Number(hasAgg.total_hours);
            yearChartAggregated.total_days += Number(hasAgg.total_days);
            yearChartAggregated.total_ucoins += Number(hasAgg.total_ucoins);
          } else {
            hoursSeries.push(0);
            daysSeries.push(0);
            ucoinsSeries.push(0);
          }
        }

        series = [
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
      }

      next((component) => {
        component.adminDashboard.hosts = hosts.data.result;
        component.adminDashboard.performances = performances.data.result;
        component.adminDashboard.leaderboard = leaderboard.data.result;
        component.adminDashboard.series = series;
      });
    } else {
      const hostId = store.state.userDetails.id;

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

      next((component) => {
        component.hostDashboard.currentMonthPerformance =
          currentMonthPerformance.data.result;
        component.hostDashboard.announcements = announcements.data.result;
        component.hostDashboard.calendarActivities =
          calendarActivities.data.result;
        component.hostDashboard.myData = myData.data.result;
      });
    }
  },
};
</script>
