<template lang="pug">
div(style="height: 100vh")
  el-container(style="height: 100%;")
    el-aside(:width='isCollapsed ? "65px" : "250px"')
      Sidebar
    el-main(style="padding: 0")
      div.sticky-top.bg-white
        div.py-3(style="padding-left: 50px; padding-right: 50px;")
          .d-flex.justify-content-end.align-items-center
            div.me-5
              el-badge(:value='notifCount' :hidden='notifCount == 0')
                el-button(link @click='isOpenedDrawer = true')
                  template(#icon)
                    i.bi.bi-bell-fill
            el-avatar.me-3(:src='$store.state.userDetails.avatarImageUrl ? $store.state.userDetails.avatarImageUrl : $store.state.defaultAvatar' :size='35')
            el-dropdown
              div.user-account
                span.d-block.fw-bold.mb-1 {{ $store.state.userDetails.fullName }}
                span.d-block.text-secondary.text-small {{ $store.state.userDetails.email }}
              template(#dropdown)
                el-dropdown-menu 
                  el-dropdown-item(@click='navigateToEditAccount' v-if="$store.state.userDetails.adminLevel.includes('admin')")
                    i.bi.bi-gear-fill.me-2
                    | Account Settings 
                  el-dropdown-item.text-danger(@click='logout')
                    i.bi.bi-box-arrow-left.me-2
                    | Logout
          
        el-divider(style="margin: 0 ;")
      div(style="padding: 50px;")
        router-view
        .d-block.fw-bold.mt-5.text-secondary E-SEE © 2022 ● Web-based Performance-Driven Employee Management System
  el-drawer(v-model='isOpenedDrawer' direction='rtl' size='40%' @closed='setNotifState')
    template(#header)
      .d-flex.flex-column
        .fw-bold.h4
          i.bi.bi-bell-fill.me-3
          | Notifications
    div(v-if="$store.state.notifications.length > 0")
      template(v-for="(notif, index) in $store.state.notifications" :key="index")
        NotificationCard(:data="notif")
        el-divider
    div(v-else)
      el-empty(description='Nothing to see here')
</template>

<script>
import Sidebar from "@/components/Sidebar.vue";
import { apiClient } from "@/services/MainService";
import moment from "moment";
import store from "@/store";
export default {
  name: "BaseAppLayout",
  components: {
    Sidebar,
  },
  data() {
    return {
      isCollapsed: false,
      isOpenedDrawer: false,
    };
  },
  computed: {
    notifCount() {
      let unopened = this.$store.state.notifications.filter(
        (el) => !el.isOpened
      );
      return unopened.length;
    },
  },
  mounted() {
    this.$nextTick(function () {
      this.onResize();
    });
    window.addEventListener("resize", this.onResize);
    Notification.requestPermission();
  },
  methods: {
    setNotifState() {
      this.$store.dispatch("setNotificationState");
    },
    onResize() {
      const width = window.innerWidth;
      if (width > 700 && width <= 1100) {
        this.isCollapsed = true;
      } else if (width > 1100) {
        this.isCollapsed = false;
      }
    },
    logout() {
      const routeReplace = this.$store.state.userDetails.adminLevel.includes(
        "admin"
      )
        ? { name: "LoginAdmin" }
        : { name: "Login" };
      localStorage.removeItem("accessToken");
      localStorage.removeItem("userDetails");
      this.$store.dispatch("initializeApplication");
      this.$router.replace(routeReplace);
    },
    navigateToEditAccount() {
      const myRole = this.$store.state.userDetails.adminLevel;
      const myId = this.$store.state.userDetails.id;
      if (myRole.includes("admin")) {
        this.$router.push({
          name: "EditAdministrator",
          params: { id: myId },
          query: { action: "account-settings" },
        });
        setTimeout(() => {
          location.reload();
        }, 200);
      } else {
        this.$router.push({
          name: "EditHost",
          params: { id: myId },
          query: { action: "account-settings" },
        });
      }
    },
  },
  async beforeRouteEnter(routeTo, routeFrom, next) {
    try {
      const { data } = await apiClient.get("/calendar-activities");
      const dateNow = moment(new Date().toLocaleDateString("en-CA"));
      next(() => {
        const incoming = [];
        data.result.forEach((event) => {
          if (dateNow <= moment(event.date)) {
            const eventMinus7Days = moment(event.date).subtract(7, "d");

            if (dateNow >= eventMinus7Days) {
              const daysLeft = moment(event.date).diff(dateNow, "days");
              if (daysLeft == 0) {
                event.message = `A calendar event/activity (${event.title}) scheduled today is happening right now.`;
              } else {
                event.message = `A calendar event/activity (${
                  event.title
                }) scheduled at ${new Date(event.date).toLocaleString(
                  "en-CA",
                  store.state.dateOptions
                )} will happen ${
                  daysLeft > 1 ? daysLeft + " days from now" : "tomorrow"
                }.`;
              }
              event.date = new Date().toLocaleString(
                "en-CA",
                store.state.dateTimeOptions
              );
              event.calendarNotif = true;
              event.isOpened = false;

              incoming.push(event);
            }
          }
        });
        store.dispatch("setCalendarReminders", incoming);
      });
    } catch (error) {
      console.log(error);
    }
  },
};
</script>

<style scoped>
.user-account {
  cursor: pointer;
}
</style>
