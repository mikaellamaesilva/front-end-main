<template lang="pug">
div
  el-card.p-4(shadow='never')
    .mb-4.d-flex.align-items-md-center.flex-wrap.flex-column.flex-md-row
            div
              .h5.fw-bold {{ data.question }}
            .ms-md-auto.mt-2.mt-md-0(v-if='String($store.state.userDetails.adminLevel).includes("admin")')
              el-button(plain type="primary" text @click='$emit("editFaq", data.id)')
                i.bi.bi-pencil-square
              el-popconfirm(title='Are you sure you want to delete this?' confirm-button-type='danger' @confirm="$emit('deleteFaq', data.id)")
                template(#reference)
                  el-button(plain type="danger" text)
                    i.bi.bi-trash-fill
    el-divider
    p.text-secondary.mt-4 {{ data.answer }}
</template>

<script>
export default {
  name: "FaqCard",
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
};
</script>
