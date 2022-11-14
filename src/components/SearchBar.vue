<template lang="pug">
.row.my-4
  .col.col-12.col-md-8
    div.d-flex.align-items-center(v-if="modelValue.filter.type == 'text'")
      el-input(clearable placeholder="Search here..." v-model='modelValue.input' @input='emitValue({ input: $event })')
        template(#prefix)
          i.bi.bi-search.me-2
      el-button.ms-2(link @click="refresh")
        i.bi.bi-arrow-clockwise.fs-5
    div.d-flex.align-items-center(v-else-if="modelValue.filter.type == 'date'")
      el-date-picker.w-100.date-input(clearable type="date" format="MMMM D, YYYY" value-format="YYYY-MM-DD" placeholder="Search here..." v-model='modelValue.input' @change='emitValue({ input: $event })')
        template(#prefix)
          i.bi.bi-search.me-2
      el-button.ms-2(link @click="refresh")
        i.bi.bi-arrow-clockwise.fs-5
    div.d-flex.align-items-center(v-else-if="modelValue.filter.type == 'select'")
      el-select.w-100(clearable placeholder="Search here..." valueKey='value' v-model='modelValue.input' @change='emitValue({ input: $event.value })')
        template(#prefix)
            i.bi.bi-search.me-2
        el-option(v-for="option in modelValue.selectTypeOptions" :key='option.value'  :label='option.name' :value='option' )
      el-button.ms-2(link @click="refresh")
        i.bi.bi-arrow-clockwise.fs-5
  .col.col-12.col-md-4
    el-select.w-100(placeholder="Filter options" valueKey='value' v-model='modelValue.filter' @change='emitValue({ filter: $event }); emitValue({ input: "" })')
      el-option(v-for="option in modelValue.options" :key='option.value'  :label='option.name' :value='option' )

</template>

<script>
export default {
  name: "SearchBar",
  props: {
    modelValue: {
      type: Object,
      required: true,
    },
  },
  methods: {
    emitValue(inputValue) {
      const updatedModelValue = { ...this.modelValue, ...inputValue };
      this.$emit("update:modelValue", updatedModelValue);
    },
    refresh() {
      location.reload();
    },
  },
};
</script>
