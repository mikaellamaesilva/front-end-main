<template lang="pug">
el-card(:body-style='{padding:0}').p-5
    .mb-4.d-flex.align-items-md-center.flex-wrap.flex-column.flex-md-row
      .d-flex.align-items-center
        el-avatar.me-3(:src='data.admin.avatarImageUrl ? data.admin.avatarImageUrl : $store.state.defaultAvatar' :size='50')
        div
          span.fw-bold.d-block {{ data.admin.fullName }}
          span.fw-light.text-small.text-secondary.d-block {{ new Date(data.createdAt).toLocaleString('en-CA', $store.state.dateTimeOptions) }}
          
          
      div.ms-md-auto.mt-2.mt-md-0(v-if='String($store.state.userDetails.adminLevel).includes("admin")')
        router-link(:to='{ name: "EditAnnouncement", params: { id: data.id } }')
          el-button(plain type="primary" text)
            i.bi.bi-pencil-square
        el-popconfirm(title='Are you sure you want to delete this?' confirm-button-type='danger' @confirm="$emit('deleteAnnouncement', data.id)")
          template(#reference)
            el-button(plain type="danger" text)
              i.bi.bi-trash-fill
    el-divider
    div
      span.h3.fw-light {{ data.title }}
      div.text-uppercase.fw-bold.text-small.mt-2
        Tag(:primaryText="data.type" :color="$store.state.announcementOptions.find(el => el.type == data.type).color")
    p.text-secondary.mt-4 {{ data.details }}

    div.mt-4(v-if='data.announcement_attachments.length > 0')
      span.fw-bold Attachments ({{ data.announcement_attachments.length }})
      ul.ul-no-bullet.mt-3
        template(v-for="attachment in data.announcement_attachments")
          li
            template(v-if="checkImage(attachment.attachmentFilename)")
              img(:src="attachment.attachmentUrl" style="width: 400px")
            template(v-else)
              el-link(type='primary' :href='attachment.attachmentUrl' target="_blank") 
                i.bi.bi-file-earmark-text-fill.me-2
                | {{ attachment.attachmentFilename }}
            

</template>

<script>
import Tag from "@/components/Tag.vue";
export default {
  name: "AnnouncementCard",
  components: {
    Tag,
  },
  props: {
    readOnly: {
      type: Boolean,
      default: true,
    },
    data: {
      type: Object,
      required: true,
    },
  },
  methods: {
    checkImage(url) {
      const urlLowercase = url.toLowerCase();
      let isImage = false;
      const ext = ["jpg", "jpeg", "png", "gif", "webp"];
      ext.forEach((e) => {
        if (urlLowercase.includes(e)) {
          isImage = true;
        }
      });

      return isImage;
    },
  },
};
</script>
