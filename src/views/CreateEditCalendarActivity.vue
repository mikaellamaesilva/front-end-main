<template lang="pug">
div
  span.h2.fw-bold(v-if="isCreateMode") 
    BackButton.me-3(:routeTo="{ name: 'CalendarActivities' }")
    | Create Calendar Event
  span.h2.fw-bold(v-else) 
    BackButton.me-3(:routeTo="{ name: 'CalendarActivities' }")
    | Edit Calendar Event
  el-divider
  .d-flex.justify-content-center
    el-card(shadow='never' :body-style='{padding:0}')
      div.px-5.py-4(:class="{'create-gradient': isCreateMode, 'edit-gradient': !isCreateMode}")
        .fs-4.fw-bold
          i.bi.bi-info-circle-fill.me-3
          | Calendar Event Info
      .p-5
        el-form(label-position='left' label-width='140px' :model='form' @submit.prevent='submitForm()')
          el-form-item(label='Title')
            el-input(v-model='form.title' name="title" required)
          el-form-item(label='Type')
            el-select.w-100(v-model='form.type' name="type"  required)
              el-option(v-for="option in $store.state.announcementOptions" :key='option.type' :label='option.type' :value='option.type')
                template(#)
                  Tag(:primaryText="option.type" :color="option.color")

          el-form-item(label='Group')
            el-select.w-100(v-model='form.group' name="group"  required @change="(value) => { if (value === 'Admin') form.calendar_activity_participants = []  }")
              el-option(v-for="option in $store.state.groupOptions" :key='option' :label='option' :value='option')

          el-form-item(label='Date')
            el-date-picker.w-100.date-input(type="date" @change="validateDate" format="MMMM D, YYYY" value-format="YYYY-MM-DD" v-model='form.date' name="date" required)
          el-form-item(label='Details')
            el-input(v-model='form.details' name="details" required type='textarea')
          
          el-form-item(label='Participants' v-if="form.group === 'Host' && !form.includeAllHosts")
            el-select.w-100(filterable v-model='form.calendar_activity_participants' name="calendar_activity_participants" valueKey='hostId' multiple collapse-tags)
              el-option(v-for="option in hosts" :key='option.id' :label='option.fullName' :value='{ hostId: option.id }' )
                template(#)
                  .d-flex.align-items-center
                    el-avatar.me-3(:src='option.avatarImageUrl ? option.avatarImageUrl : $store.state.defaultAvatar' :size='25')
                    div
                      span {{ option.fullName }}
          .d-flex.justify-content-end 
            el-checkbox.text-center(v-if="form.group === 'Host'" v-model="form.includeAllHosts" label="Include all hosts" @change="form.calendar_activity_participants = []")
          div.d-flex.justify-content-end.mt-3
            el-button.me-2(text :disabled='isLoading' @click="$router.push({ name: 'CalendarActivities' })") 
              | Discard
            el-button(v-if="isCreateMode" type='primary' native-type='submit' :loading='isLoading') Create
            el-button(v-else type='primary' native-type='submit' :loading='isLoading') Save

</template>

<script>
import { apiClient } from "@/services/MainService";
import BackButton from "@/components/BackButton.vue";
export default {
  name: "CreateEditCalendarActivity",
  components: {
    BackButton,
  },
  data() {
    return {
      form: {
        title: "",
        type: "",
        group: "",
        date: "",
        details: "",
        calendar_activity_participants: [],
        includeAllHosts: false,
      },
      hosts: [],
      isLoading: false,
    };
  },
  methods: {
    validateDate(value) {
      const currentDate = new Date(new Date().toLocaleDateString());
      const selectedDate = new Date(value);
      if (selectedDate > new Date("1970-01-01")) {
        if (selectedDate <= currentDate) {
          // eslint-disable-next-line no-undef
          ElNotification({
            title: "Notification",
            message: "Date cannot be before the current date.",
            type: "error",
            duration: 5000,
          });
          this.form.date = "";
        }
      }
    },
    async submitForm() {
      if (!this.$store.getters.validateForm(this.form)) {
        // eslint-disable-next-line no-undef
        ElNotification({
          title: "Notification",
          message: "Input fields are incomplete.",
          type: "error",
          duration: 5000,
        });
        return false;
      }

      const currentDate = new Date(new Date().toLocaleDateString());
      const selectedDate = new Date(this.form.date);
      if (selectedDate <= currentDate) {
        // eslint-disable-next-line no-undef
        ElNotification({
          title: "Notification",
          message: "Date cannot be before the current date.",
          type: "error",
          duration: 5000,
        });
        this.form.date = "";
      }

      this.isLoading = true;
      if (this.isCreateMode) {
        try {
          await apiClient.post("/calendar-activities", this.form);
          // eslint-disable-next-line no-undef
          ElNotification({
            title: "Notification",
            message: "A new calendar event has been successfully created.",
            type: "success",
            duration: 5000,
          });

          // live-notification
          this.$store.state.websocket.send(
            JSON.stringify({
              message: `A calendar event has been posted by ${this.$store.state.userDetails.fullNameReversed}.`,
              // eslint-disable-next-line prettier/prettier
              date: new Date().toLocaleString("en-CA",this.$store.state.dateTimeOptions),
              showToHost: true,
              avatarImageUrl: this.$store.state.userDetails.avatarImageUrl,
            })
          );
          this.$router.replace({ name: "CalendarActivities" });
        } catch (error) {
          console.log(error);
        }
      } else {
        try {
          await apiClient.patch(
            `/calendar-activities/${this.$route.params.id}`,
            this.form
          );
          // eslint-disable-next-line no-undef
          ElNotification({
            title: "Notification",
            message: "A calendar event has been successfully updated.",
            type: "success",
            duration: 5000,
          });
          // live-notification
          this.$store.state.websocket.send(
            JSON.stringify({
              message: `A calendar event has been updated by ${this.$store.state.userDetails.fullNameReversed}.`,
              // eslint-disable-next-line prettier/prettier
              date: new Date().toLocaleString("en-CA",this.$store.state.dateTimeOptions),
              showToHost: true,
              avatarImageUrl: this.$store.state.userDetails.avatarImageUrl,
            })
          );
          this.$router.replace({ name: "CalendarActivities" });
        } catch (error) {
          console.log(error);
        }
      }
      this.isLoading = false;
    },
  },
  computed: {
    isCreateMode() {
      const isCreateMode = this.$route.params.id ? false : true;
      return isCreateMode;
    },
  },
  async beforeRouteEnter(routeTo, routeFrom, next) {
    try {
      const id = routeTo.params.id;
      if (id) {
        const [calendarActivity, hosts] = await Promise.all([
          apiClient.get(`/calendar-activities/${id}`),
          apiClient.get(`/hosts`),
        ]);

        next((component) => {
          component.form = calendarActivity.data.result;
          component.hosts = hosts.data.result;
        });
      } else {
        const { data } = await apiClient.get(`/hosts`);
        next((component) => {
          component.hosts = data.result;
        });
      }
    } catch (error) {
      console.log(error);
    }
  },
};
</script>
