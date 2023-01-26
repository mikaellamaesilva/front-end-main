<template lang="pug">
div
  span.h2.fw-bold(v-if="isCreateMode") 
    BackButton.me-3(:routeTo="{ name: 'Announcements' }")
    | Create Announcement
  span.h2.fw-bold(v-else) 
    BackButton.me-3(:routeTo="{ name: 'Announcements' }")
    | Edit Announcement
  el-divider
  .d-flex.justify-content-center

    el-card(shadow='never' :body-style='{padding:0}')
      div.px-5.py-4(:class="{'create-gradient': isCreateMode, 'edit-gradient': !isCreateMode}")
        .fs-4.fw-bold
          i.bi.bi-info-circle-fill.me-3
          | Announcement Info
      div.p-5
        el-form(label-position='left' label-width='140px' :model='form' @submit.prevent='submitForm($event)' enctype='multipart/form-data')
          el-form-item(label='Title')
            el-input(v-model='form.title' name="title" required)
          el-form-item(label='Type')
            el-select.w-100(v-model='form.type' name="type"  required)
              el-option(v-for="option in $store.state.announcementOptions" :key='option.type' :label='option.type' :value='option.type')
                template(#)
                  Tag(:primaryText="option.type" :color="option.color")
          el-form-item(label='Details')
            el-input(v-model='form.details' name="details" required type='textarea')
          el-form-item(label='Attachments')
            input(type='file' name="file" accept multiple)
          ul.ul-no-bullet.d-block.mb-5
            li(v-for="attachment in form.announcement_attachments")
            
              el-link(type='primary' :href='attachment.attachmentUrl' target="_blank") 
                span(:class="{'text-decoration-line-through': attachment.forRemoval}")
                  i.bi.bi-file-earmark-text-fill.me-2
                  | {{ cutText(attachment.attachmentFilename) }}
            
              span.add-remove-file.add-word.float-end(v-if="attachment.forRemoval" @click="addFile(attachment.id)") Add
              span.add-remove-file.remove-word.float-end(v-else @click="removeFile(attachment.id)") Remove
          div.d-flex.justify-content-end.mt-3
            el-button.me-2(text :disabled='isLoading' @click="$router.push({ name: 'Announcements' })") 
              | Discard
            el-button(v-if="isCreateMode" type='primary' native-type='submit' :loading='isLoading') Create
            el-button(v-else type='primary' native-type='submit' :loading='isLoading') Save

</template>

<script>
import { apiClient } from "@/services/MainService";
export default {
  name: "CreateEditAnnouncement",
  data() {
    return {
      form: {
        title: "",
        type: "",
        details: "",
      },
      isLoading: false,
    };
  },
  methods: {
    cutText(text) {
      if (text.length >= 30) {
        return `${text.slice(0, 30)}...`;
      } else {
        return `${text}...`;
      }
    },
    removeFile(id) {
      const file = this.form.announcement_attachments.find((el) => el.id == id);
      file.forRemoval = true;
    },
    addFile(id) {
      const file = this.form.announcement_attachments.find((el) => el.id == id);
      delete file.forRemoval;
    },
    async submitForm(event) {
      let form = new FormData(event.target);
      if (!this.$store.getters.validateForm(this.form)) {
        // eslint-disable-next-line no-undef
        ElNotification({
          title: "Notification",
          message: "Input fields are incomplete.",
          type: "error",
          duration: 5000,
        });
        this.isLoading = false;
        return false;
      }

      this.isLoading = true;
      if (this.isCreateMode) {
        try {
          await apiClient.post("/announcements", form, {
            headers: { "Content-Type": "multipart/form-data" },
          });
          // eslint-disable-next-line no-undef
          ElNotification({
            title: "Notification",
            message: "A new announcement has been successfully created.",
            type: "success",
            duration: 5000,
          });

          // live-notification
          this.$store.state.websocket.send(
            JSON.stringify({
              message: `An announcement has been posted by ${this.$store.state.userDetails.fullNameReversed}.`,
              // eslint-disable-next-line prettier/prettier
              date: new Date().toLocaleString(
                "en-CA",
                this.$store.state.dateTimeOptions
              ),
              showToHost: true,
              avatarImageUrl: this.$store.state.userDetails.avatarImageUrl,
            })
          );
          this.$router.replace({ name: "Announcements" });
        } catch (error) {
          console.log(error);
        }
      } else {
        try {
          await Promise.all([
            apiClient.patch(`/announcements/${this.$route.params.id}`, form, {
              headers: { "Content-Type": "multipart/form-data" },
            }),
            apiClient.patch(
              `/announcements/${this.$route.params.id}`,
              this.form
            ),
          ]);
          // eslint-disable-next-line no-undef
          ElNotification({
            title: "Notification",
            message: "An announcement has been successfully updated.",
            type: "success",
            duration: 5000,
          });
          // live-notification
          this.$store.state.websocket.send(
            JSON.stringify({
              message: `An announcement has been updated by ${this.$store.state.userDetails.fullNameReversed}.`,
              // eslint-disable-next-line prettier/prettier
              date: new Date().toLocaleString(
                "en-CA",
                this.$store.state.dateTimeOptions
              ),
              showToHost: true,
              avatarImageUrl: this.$store.state.userDetails.avatarImageUrl,
            })
          );
          this.$router.replace({ name: "Announcements" });
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
        const { data } = await apiClient.get(`/announcements/${id}`);
        next((component) => {
          component.form = data.result;
        });
      } else {
        next();
      }
    } catch (error) {
      console.log(error);
      next({ name: "PageNotFound" });
    }
  },
};
</script>

<style scoped>
.add-remove-file {
  cursor: pointer;
  transition: 0.2s ease-in;
}

.add-remove-file:hover {
  opacity: 0.4;
}

.remove-word {
  color: rgb(220, 36, 36);
}

.add-word {
  color: rgb(118, 201, 40);
}

.text-decoration-line-through {
  color: rgb(194, 194, 194);
}
</style>
