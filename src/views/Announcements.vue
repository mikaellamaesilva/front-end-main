<template lang="pug">
div
  .d-flex.align-items-md-center.flex-wrap.flex-column.flex-md-row
    span.h2.fw-bold Announcements
    .ms-md-auto
    router-link(:to="{ name: 'CreateAnnouncement' }" v-if='String($store.state.userDetails.adminLevel).includes("admin")')
      el-button(type='primary') 
          i.bi.bi-plus-lg.me-2
          | Add New
  el-divider
  SearchBar(v-model='search' @update:modelValue='searchNow')
  div(v-if='announcements.length > 0' v-for='announcement in announcements')
    AnnouncementCard.mb-5(:data='announcement' @deleteAnnouncement='deleteAnnouncement($event)')
  div(v-else)
    el-empty(description='There are no announcement data here')
</template>

<script>
import AnnouncementCard from "@/components/AnnouncementCard.vue";
import { apiClient } from "@/services/MainService";
import SearchBar from "@/components/SearchBar.vue";
export default {
  name: "Announcements",
  components: {
    AnnouncementCard,
    SearchBar,
  },
  data() {
    return {
      isVisibleCreateDialog: false,
      isVisibleEditDialog: false,
      search: {
        input: "",
        filter: {
          name: "Filter by title",
          value: "title",
          type: "text",
        },
        options: [
          {
            name: "Filter by administrator",
            value: "admin.fullName",
            type: "text",
          },
          {
            name: "Filter by date",
            value: "createdAt",
            type: "date",
          },
          {
            name: "Filter by details",
            value: "details",
            type: "text",
          },
          {
            name: "Filter by title",
            value: "title",
            type: "text",
          },
          {
            name: "Filter by type",
            value: "type",
            type: "select",
          },
        ],
        selectTypeOptions: [
          {
            name: "PK Battle",
            value: "PK Battle",
          },
          {
            name: "Reminder",
            value: "Reminder",
          },
          {
            name: "Task",
            value: "Task",
          },
          {
            name: "Others",
            value: "Others",
          },
        ],
      },
      form: {
        title: "",
        type: "",
        details: "",
      },
      currentEdit: {},
      announcements: [],
      backup: [],
    };
  },
  methods: {
    searchNow() {
      const searchInput = this.search?.input?.trim().toLowerCase();
      this.announcements = [...this.backup];
      if (searchInput) {
        const [key1, key2] = this.search.filter.value.split(".");
        if (
          this.search.filter.type == "text" ||
          this.search.filter.type == "select"
        ) {
          if (key1 && key2) {
            this.announcements = this.announcements.filter((el) =>
              el[key1][key2].toLowerCase().trim().includes(searchInput)
            );
          } else {
            this.announcements = this.announcements.filter((el) =>
              el[key1].toLowerCase().trim().includes(searchInput)
            );
          }
        } else {
          this.announcements = [...this.backup];
          if (key1 && key2) {
            this.announcements = this.announcements.filter((el) =>
              new Date(el[key1][key2])
                .toLocaleDateString("en-CA")
                .includes(searchInput)
            );
          } else {
            this.announcements = this.announcements.filter((el) =>
              new Date(el[key1])
                .toLocaleDateString("en-CA")
                .includes(searchInput)
            );
          }
        }
      } else {
        this.announcements = [...this.backup];
      }
    },
    async deleteAnnouncement(announcementId) {
      try {
        await apiClient.delete(`/announcements/${announcementId}`);
        this.announcements = this.announcements.filter(
          (el) => el.id !== announcementId
        );

        // eslint-disable-next-line no-undef
        ElNotification({
          title: "Notification",
          message: "An announcement has been successfully deleted.",
          type: "success",
          duration: 5000,
        });
        setTimeout(() => location.reload(), 900);
      } catch (error) {
        console.log(error);
      }
    },
  },
  async beforeRouteEnter(routeTo, routeFrom, next) {
    try {
      const { data } = await apiClient.get("/announcements");
      next((component) => {
        component.announcements = data.result;
        component.backup = data.result;
      });
    } catch (error) {
      console.log(error);
    }
  },
};
</script>
