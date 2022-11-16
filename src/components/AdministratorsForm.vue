<template lang="pug">
el-card(shadow='never' :body-style='{padding:0}')
  div.px-5.py-4(:class="{'create-gradient': mode == 'create', 'edit-gradient': mode == 'edit', 'common-gradient': mode == 'view'}")
    .fs-4.fw-bold
        i.bi.bi-info-circle-fill.me-3
        | Administrator Info
  .p-5
    .d-flex.align-items-center.mb-5(v-if="mode !== 'create'")
      el-avatar.me-4(:src='modelValue.avatarImageUrl ? modelValue.avatarImageUrl : $store.state.defaultAvatar' :size='150')
      div
        span.fw-bold.h3 {{ modelValue.fullName }}
        br
        span.fw-light.text-small.text-secondary Email: {{ modelValue.email }}
        br
        span.fw-light.text-small.text-secondary Mobile number: {{  modelValue.mobileNumber }}
        br
        span.fw-light.text-small.text-secondary Date created: {{ new Date(modelValue.createdAt).toLocaleString('en-CA', $store.state.dateOptions)  }}

    el-form(label-position='left' label-width='140px' :model='modelValue' @submit.prevent='$emit("submitForm", $event)' enctype='multipart/form-data')
      .h4.mb-3 
        i.bi.bi-person-fill.me-2
        | Personal Details
      el-form-item(label='First name')
        .w-100(v-if="mode !== 'view'")
          el-input(v-model='modelValue.firstName' @keypress="$store.getters.isNotNumber($event)" @input="emitValue({ firstName: $event })" name="firstName" required)
        .w-100(v-else) {{ modelValue.firstName }}


      el-form-item(label='Last name')
        .w-100(v-if="mode !== 'view'")
          el-input(v-model='modelValue.lastName' @keypress="$store.getters.isNotNumber($event)" @input="emitValue({ lastName: $event })" name="lastName" required)
        .w-100(v-else) {{ modelValue.lastName }}

    
      el-form-item(label='Birth date')
        .w-100(v-if="mode !== 'view'")
          el-date-picker.w-100.date-input(type="date"  format="MMMM D, YYYY" value-format="YYYY-MM-DD" v-model='modelValue.birthDate' @change="emitValue({ birthDate: $event })" name="birthDate" required)
        .w-100(v-else) {{ modelValue.birthDate }}
        
      el-form-item(label='Gender')
        .w-100(v-if="mode !== 'view'")
          el-select.w-100(v-model='modelValue.gender' @change="emitValue({ gender: $event })" name="gender" required)
            el-option(v-for="option in $store.state.genderOptions" :key='option' :label='option' :value='option')
        .w-100(v-else) {{ modelValue.gender }}
    
      el-form-item(label='Country')
        .w-100(v-if="mode !== 'view'")
          el-select.w-100(v-model='modelValue.country' @change="emitValue({ country: $event })" name="country" required filterable)
              el-option(v-for="option in countries" :key='option.code' :label='option.name' :value='option.name')
                template(#)
                  .d-flex.align-items-center
                    img.me-3(:src='option.image' style="width: 20px;")
                    span {{ option.name }}
        .w-100(v-else) {{ modelValue.country }}

      el-form-item(label='Address')
        .w-100(v-if="mode !== 'view'")
          el-input(v-model='modelValue.address' @input="emitValue({ address: $event })" name="address" required)
        .w-100(v-else) {{ modelValue.address }}


    
      el-form-item(label='Mobile number')
        .w-100(v-if="mode !== 'view'")
          
          el-input(v-model='modelValue.mobileNumber' @input="emitValue({ mobileNumber: $event })" name="mobileNumber" required)
        .w-100(v-else) {{ modelValue.mobileNumber }}

      .h4.mb-3.mt-5 
        i.bi.bi-key-fill.me-2
        | Account Setup
      el-form-item(label='Email')
        .w-100(v-if="mode !== 'view'")
          
          el-input(v-model='modelValue.email' @input="emitValue({ email: $event })" name="email" required)
        .w-100(v-else) {{ modelValue.email }}

      el-form-item(label='Old password' v-if='$route.query.action')
        el-input(v-model='modelValue.oldPassword' @input="emitValue({ oldPassword: $event })" name="oldPassword" type='password'  show-password)
        
      el-form-item(:label=`$route.query.action? 'New password': 'Password'` v-if="mode !== 'view'")
        el-input(v-model='modelValue.password' @input="emitValue({ password: $event })" name="password" type='password'  show-password :required='mode == "create"')

      el-form-item(label='Confirm password' v-if="mode !== 'view'")
        el-input(v-model='modelValue.confirmPassword' @input="emitValue({ confirmPassword: $event })" name="confirmPassword" type='password'  show-password :required='mode == "create"')

      el-form-item(label='Avatar image' v-if="mode !== 'view'")
        input(type='file' name="files" accept='image/*')

      div.d-flex.justify-content-end.mt-3(v-if="mode !== 'view'")
        el-button.me-2(text :disabled='isLoading' @click="$router.push({ name: 'Administrators' })" v-if="!$route.query.action") 
          | Discard
        el-button(v-if="mode == 'create'" type='primary' native-type='submit' :loading='isLoading') Create
        el-button(v-else-if="mode == 'edit'" type='primary' native-type='submit' :loading='isLoading') 
          span(v-if='$route.query.action') Save changes
          span(v-else) Save

</template>

<script>
import countries from "@/assets/countries.json";
export default {
  name: "AdministratorsForm",
  data() {
    return {
      countries: countries,
    };
  },
  props: {
    mode: {
      type: String,
      default: "create",
    },
    modelValue: {
      type: Object,
      required: true,
    },
    isLoading: {
      type: Boolean,
    },
  },
  methods: {
    emitValue(inputValue) {
      const updatedModelValue = { ...this.modelValue, ...inputValue };
      this.$emit("update:modelValue", updatedModelValue);
    },
  },
};
</script>

<style>
.el-input__wrapper {
  width: 100% !important;
}
</style>
