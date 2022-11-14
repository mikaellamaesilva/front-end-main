<template lang="pug">
div(style="height: 100%")
  el-menu.position-relative(style="padding: 10px; height: 100%" :router="true" :collapse="isCollapsed")
    img(src='@/assets/logo.svg' style="width: 150px; margin: 20px 0" v-if="!isCollapsed")
    el-menu-item(index='1' :route="{ name: 'Dashboard' }")
      el-icon 
        i.bi.bi-house-fill.me-2.text-center
      span Dashboard
    el-menu-item(index='2' :route="{ name: 'Announcements' }")
      i.bi.bi-megaphone-fill.me-2
      span Announcements
    el-sub-menu(index='3' v-if='String($store.state.userDetails.adminLevel).includes("admin")')
      template(#title)
        i.bi.bi-people-fill.me-2
        span Hosts
      el-menu-item-group
        el-menu-item(index='3-1' :route="{ name: 'Hosts' }")
          span Management 
        el-menu-item(index='3-2' :route="{ name: 'PendingHosts' }") 
          span Application Requests
        el-menu-item(index='3-3' :route="{ name: 'Leaderboard' }") 
          span Leaderboard
    
    el-menu-item(index='4' :route="{ name: 'Performances' }" v-if='String($store.state.userDetails.adminLevel).includes("admin")')
      i.bi.bi-graph-up.me-2
      span Performances
    el-menu-item(index='5' :route="{ name: 'Administrators' }" v-if='String($store.state.userDetails.adminLevel) == "superadmin"')
      i.bi.bi-person-badge-fill.me-2
      span Administrators
    el-menu-item(index='6' :route="{ name: 'CalendarActivities' }")
      i.bi.bi-calendar2-month-fill.me-2
      span Calendar Events
    el-sub-menu(index='7' v-if='String($store.state.userDetails.adminLevel).includes("admin")')
      template(#title)
        i.bi.bi-bar-chart-fill.me-2
        span Reports
      el-menu-item-group
        el-menu-item(index='7-1' :route="{ name: 'ReportRecruitment' }") 
          span Recruitment
        el-menu-item(index='7-2' :route="{ name: 'ReportPerformance' }") 
          span Performances
        el-menu-item(index='7-3' :route="{ name: 'ReportActivity' }") 
          span Activity
    el-menu-item(index='8' :route="{ name: 'ViewHost', params: { id: $store.state.userDetails.id } }" v-if='!String($store.state.userDetails.adminLevel).includes("admin")')
      i.bi.bi-person-lines-fill.me-2
      span My Profile
    el-menu-item(index='9' :route="{ name: 'Audits' }" v-if='String($store.state.userDetails.adminLevel).includes("superadmin")')
      i.bi.bi-clipboard-check-fill.me-2
      span Audits
    el-menu-item(index='10' :route="{ name: 'HelpCenter' }")
      i.bi.bi-question-circle-fill.me-2
      span Help Center
</template>

<script>
export default {
  name: "Sidebar",
  data() {
    return {
      isCollapsed: false,
    };
  },
  mounted() {
    this.$nextTick(function () {
      this.onResize();
    });
    window.addEventListener("resize", this.onResize);
  },
  methods: {
    onResize() {
      const width = window.innerWidth;
      if (width > 700 && width <= 1100) {
        this.isCollapsed = true;
      } else if (width > 1100) {
        this.isCollapsed = false;
      }
    },
  },
};
</script>
