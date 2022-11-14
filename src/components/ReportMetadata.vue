<template lang="pug">
.metadata.my-3(:class="{'d-none': !isExporting }")
  span.fw-bold.d-block {{ reportName }}
  span.d-block Exported by {{ $store.state.userDetails.fullName }}
  span.d-block Exported at {{ exportDate }}
</template>

<script>
export default {
  name: "ReportMetadata",
  props: {
    isExporting: {
      type: Boolean,
      required: true,
    },
    exportDate: {
      type: String,
      required: true,
    },
    reportName: {
      type: String,
      required: true,
    },
  },
};
</script>
