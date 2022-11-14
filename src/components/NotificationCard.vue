<template lang="pug">
.d-flex.align-items-center
  div(style="width: 55px").me-3
    el-badge(:is-dot="!data.isOpened")
      el-avatar(:src='data.avatarImageUrl ? data.avatarImageUrl : data.calendarNotif? require("@/assets/calendar_reminder.png") : $store.state.defaultAvatar' :size='50')
  div
    span.fw-bold.d-block {{ data.message }}
    span.fw-light.text-small.text-secondary.d-block {{ data.date }}
</template>

<script>
export default {
  name: "NotificationCard",
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
};
</script>
