<template lang="pug">
div
  .d-flex.align-items-md-center.flex-wrap.flex-column.flex-md-row
    span.h2.fw-bold Calendar Events
    .ms-md-auto(v-if='String($store.state.userDetails.adminLevel).includes("admin")')
      router-link(:to="{ name: 'CreateCalendarActivity' }" v-if='String($store.state.userDetails.adminLevel).includes("admin")')
        el-button(type='primary') 
            i.bi.bi-plus-lg.me-2
            | Add New
  el-divider
  
  el-card(shadow='never' :body-style='{padding:0}')
    div.px-5.py-4.common-gradient
      .fs-4.fw-bold Company Calendar
    .p-5
      .d-flex.justify-content-end 
        el-date-picker.date-input(type="month" format="MMM YYYY" v-model='month' required placeholder='Select month')
      el-calendar(v-model='month')
        template(#dateCell='{ data }')
          | {{ Number(data.day.split('-').slice(2).join('-'))  }} 
          div.very-small-text.d-block(v-if='getActivity(data.day)' @click='displayActivity(data.day)' )
            span(v-if="getActivity(data.day).group === 'Admin'") For Admins
            Tag(:primaryText="getActivity(data.day).type" :color="$store.state.announcementOptions.find(el => el.type == getActivity(data.day).type).color")

            span.fw-light {{ cutText(getActivity(data.day).title) }}
  
  
  div(v-if="currentActivity")
      el-drawer(v-model='isOpenedDrawer' direction='rtl' size='40%')
        template(#header)
          .d-flex.flex-column
            div
              .fw-bold.h4 {{ new Date(currentActivity?.date).toLocaleString('en-CA', $store.state.dateOptions)   }}
            .mt-2.d-block(v-if='String($store.state.userDetails.adminLevel).includes("admin")')
              router-link(:to='{ name: "EditCalendarActivity", params: { id: currentActivity.id } }')
                el-button(plain type="primary" text)
                  i.bi.bi-pencil-square
              el-popconfirm(title='Are you sure you want to delete this?' confirm-button-type='danger' @confirm="deleteActivity(currentActivity.id)")
                template(#reference)
                  el-button(plain type="danger" text)
                    i.bi.bi-trash-fill
        span.h3.fw-light {{ currentActivity.title }}
            div.text-uppercase.fw-bold.text-small.mt-2
              div.mb-3(v-if="currentActivity.group === 'Admin'") For Admins
              Tag(:primaryText="currentActivity.type" :color="$store.state.announcementOptions.find(el => el.type == currentActivity.type).color")
        p.text-secondary.mt-4 {{ currentActivity.details }}
        
        div(v-if="(currentActivity.calendar_activity_participants.length > 0 && currentActivity.group === 'Host') || currentActivity.includeAllHosts")
          p.fw-bold.mb-3 Participants: 
            span(v-if="currentActivity.includeAllHosts") Everyone
          ul.ul-no-bullet
            template(v-if="!currentActivity.includeAllHosts")
              li.mb-3(v-for="participant in currentActivity.calendar_activity_participants")
                .d-flex.align-items-center
                    el-avatar.me-3(:src='participant.host.avatarImageUrl ? participant.host.avatarImageUrl : $store.state.defaultAvatar' :size='35')
                    div
                      span.fw-bold {{ participant.host.fullName }}
                      br
                      span.fw-light.text-small.text-secondary {{ participant.host.upliveName }} ({{ participant.host.id }})
    

    
</template>

<script>
import { apiClient } from "@/services/MainService";
export default {
  name: "CalendarActivities",
  data() {
    return {
      calendarActivities: [],
      currentActivity: null,
      isOpenedDrawer: false,
      month: new Date(),
    };
  },
  methods: {
    cutText(text) {
      if (text.length >= 10) {
        return `${text.slice(0, 10)}...`;
      } else {
        return `${text}...`;
      }
    },
    getActivity(date) {
      return this.calendarActivities.find((el) => el.date == date);
    },
    displayActivity(date) {
      const activity = this.calendarActivities.find((el) => el.date == date);
      if (activity) {
        this.currentActivity = activity;
        this.isOpenedDrawer = true;
      } else {
        this.currentActivity = null;
        this.isOpenedDrawer = false;
      }
    },
    async deleteActivity(activityId) {
      try {
        await apiClient.delete(`/calendar-activities/${activityId}`);
        this.calendarActivities = this.calendarActivities.filter(
          (el) => el.id !== activityId
        );
        this.isOpenedDrawer = false;
        // eslint-disable-next-line no-undef
        ElNotification({
          title: "Notification",
          message: "A calendar event has been successfully deleted.",
          type: "success",
          duration: 5000,
        });
      } catch (error) {
        console.log(error);
      }
    },
  },
  async beforeRouteEnter(routeTo, routeFrom, next) {
    try {
      const { data } = await apiClient.get("/calendar-activities");
      next((component) => {
        component.calendarActivities = data.result;
      });
    } catch (error) {
      console.log(error);
    }
  },
};
</script>

<style scoped>
.very-small-text {
  font-size: 0.7rem;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}
</style>
