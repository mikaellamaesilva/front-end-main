<template lang="pug">
.d-flex.justify-content-end.mb-3(style="margin-top: -20px;")
  el-button(text) 
    template(#icon)
      i.bi.bi-download.me-2
    | Export
</template>

<script>
export default {
  name: "ExportButton",
};
</script>
