<template lang="pug">
el-card(shadow='never' :body-style='{padding:0}')
  div.px-5.py-4(:class="{'create-gradient': mode == 'create', 'edit-gradient': mode == 'edit', 'common-gradient': mode == 'view'}")
    .fs-4.fw-bold
      span(v-if="modelValue.recruitmentDate")
        i.bi.bi-info-circle-fill.me-3
        | Host Info
      span(v-else)
        i.bi.bi-info-circle-fill.me-3
        | Application Info
  div.p-5
    .d-flex.justify-content-end 
      div(v-if='!$store.state.userDetails.adminLevel.includes("admin") && !($route.query.action == "account-settings") && $route.name == "ViewHost"')
        el-button(link @click='$router.push({ name: "EditHost", params: { id: modelValue.id }, query: { action: "account-settings" } })').mb-3
          template(#icon)
            i.bi.bi-pencil-square.fs-5(style="color: #47a9f5")
      div(v-else-if='!$store.state.userDetails.adminLevel.includes("admin") && ($route.query.action == "account-settings") && $route.name == "EditHost"')
        el-button(link @click='$router.push({ name: "ViewHost", params: { id: modelValue.id } })').mb-3
          template(#icon)
            i.bi.bi-arrow-left-circle-fill.fs-5(style="color: #47a9f5")
    
    .d-flex.align-items-center.mb-5(v-if="(mode == 'view') && modelValue.recruitmentDate")
      el-avatar.me-4(:src='modelValue.avatarImageUrl ? modelValue.avatarImageUrl : $store.state.defaultAvatar' :size='150')
      div
        span.fw-bold.h3.d-block {{ modelValue.fullName }}

        span.fw-light.text-small.text-secondary.d-block UPLive name: {{ modelValue.upliveName }}

        span.fw-light.text-small.text-secondary.d-block UPLive ID: {{  modelValue.id }}

        span.fw-light.text-small.text-secondary.d-block Date recruited: {{ new Date(modelValue.recruitmentDate).toLocaleString('en-CA', $store.state.dateOptions)  }}

        el-link.fw-bold.mt-3(type='primary' v-if="modelValue.recruitmentDate && !$route.query.action" @click="$router.push({ name: 'HostPerformance', params: { id: modelValue.id, host: modelValue }, })") 
          i.bi.bi-box-arrow-up-right.me-2
          | Manage performance
    el-steps.mb-5(:active="activeStep"  align-center )
      el-step(:status="activeStep === 1 ? '' : 'wait'")
        template(#description)
          span Personal Details
        template(#icon)
          i.bi.bi-person-fill.fs-3.mb-4

      el-step(:status="activeStep === 2 ? '' : 'wait'")
        template(#description)
          span Host Account Setup
        template(#icon)
          i.bi.bi-gear-fill.fs-3.mb-4

      el-step(:status="activeStep === 3 ? '' : 'wait'")
        template(#description)
          span Additional Details
        template(#icon)
          i.bi.bi-file-earmark-plus-fill.fs-3.mb-4
    el-form(label-position='left' label-width='190px' :model='modelValue' @submit.prevent='finalValidate' enctype='multipart/form-data' :rules="rules" ref="formRef")
      template(v-if="activeStep === 1 || activeStep === 3")
        div(v-show="activeStep === 1 || (!activeStep === 3)")
          el-form-item(label='First name' prop="firstName")
            .w-100(v-if="mode !== 'view'")
              el-input(v-model='modelValue.firstName' @keypress="$store.getters.isNotNumber($event)" @input="emitValue({ firstName: $event })" name="firstName" required)
            .w-100(v-else) {{ modelValue.firstName }}

          el-form-item(label='Last name' prop="lastName")
            .w-100(v-if="mode !== 'view'")
              
              el-input(v-model='modelValue.lastName' @keypress="$store.getters.isNotNumber($event)" @input="emitValue({ lastName: $event })" name="lastName" required)
            .w-100(v-else) {{ modelValue.lastName }}
        
          el-form-item(label='Birth date' prop="birthDate")
            .w-100(v-if="mode !== 'view'")
              el-date-picker.w-100.birth-date(type="date"  format="MMMM D, YYYY" value-format="YYYY-MM-DD" v-model='modelValue.birthDate' @change="emitValue({ birthDate: $event })" name="birthDate" required)     
            .w-100(v-else) {{ modelValue.birthDate }}
            
          el-form-item(label='Gender' prop="gender")
            .w-100(v-if="mode !== 'view'")
              el-select.w-100(v-model='modelValue.gender' @change="emitValue({ gender: $event })" name="gender" required)
                el-option(v-for="option in $store.state.genderOptions" :key='option' :label='option' :value='option')
            .w-100(v-else) {{ modelValue.gender }}

          el-form-item(label='Address' prop="address")
            .w-100(v-if="mode !== 'view'")
              el-input(v-model='modelValue.address' @input="emitValue({ address: $event })" name="address" required)
            .w-100(v-else) {{ modelValue.address }}

          el-form-item(label='Country' prop="country")
            .w-100(v-if="mode !== 'view'")
              el-select.w-100(v-model='modelValue.country' @change="emitValue({ country: $event })" name="country" required filterable)
                el-option(v-for="option in countries" :key='option.code' :label='option.name' :value='option.name')
                  template(#)
                    .d-flex.align-items-center
                      img.me-3(:src='option.image' style="width: 20px;")
                      span {{ option.name }}
            .w-100(v-else) {{ modelValue.country }}
        
          el-form-item(label='Mobile number' prop="mobileNumber")
            .w-100(v-if="mode !== 'view'")
              el-input(v-model='modelValue.mobileNumber' @keypress="$store.getters.isNumber($event)" @input="emitValue({ mobileNumber: $event })" name="mobileNumber" required)
            .w-100(v-else) {{ modelValue.mobileNumber }}

          el-form-item(label='Profile picture' v-if="!isForPending && mode !== 'view'")
            input(type='file' name="files" accept='image/*')

      template(v-if="activeStep === 2 || activeStep === 3" )
        div(v-show="activeStep === 2 || (!activeStep === 3)")
          el-form-item(label='UPLive name' prop="upliveName")
            .w-100(v-if="mode !== 'view'")
              el-input(v-model='modelValue.upliveName' @input="emitValue({ upliveName: $event })" name="upliveName" required)
            .w-100(v-else) {{ modelValue.upliveName }}

          el-form-item(label='UPLive ID' prop="id")
            .w-100(v-if="mode !== 'view'")
              el-input(v-model='modelValue.id' @keypress="$store.getters.isNumber($event)" @input="emitValue({ id: $event })" name="id" required)
            .w-100(v-else) {{ modelValue.id }}

          el-form-item(label='Instagram account URL' prop="instagramAccount")
            .w-100(v-if="mode !== 'view'")
              el-input(v-model='modelValue.instagramAccount' @input="emitValue({ instagramAccount: $event })" name="instagramAccount" required)
            .w-100(v-else)
              a(:href="modelValue.instagramAccount" target="_blank") {{ modelValue.instagramAccount }}

          el-form-item(label='Facebook account URL' prop="facebookAccount")
            .w-100(v-if="mode !== 'view'")
              el-input(v-model='modelValue.facebookAccount' @input="emitValue({ facebookAccount: $event })" name="facebookAccount" required)
            .w-100(v-else) 
              a(:href="modelValue.facebookAccount" target="_blank") {{ modelValue.facebookAccount }}

          el-form-item(label='Tiktok account URL' prop="tiktokAccount")
            .w-100(v-if="mode !== 'view'")
              el-input(v-model='modelValue.tiktokAccount' @input="emitValue({ tiktokAccount: $event })" name="tiktokAccount" required)
            .w-100(v-else) 
              a(:href="modelValue.tiktokAccount" target="_blank") {{ modelValue.tiktokAccount }}

          el-form-item(label='Email' prop="email")
            .w-100(v-if="mode !== 'view'")
              el-input(v-model='modelValue.email' @input="emitValue({ email: $event })" name="email" type="email"  required)
            .w-100(v-else) {{ modelValue.email }}

          el-form-item(label='Old password' v-if='$route.query.action')
            el-input(v-model='modelValue.oldPassword' @input="emitValue({ oldPassword: $event })" name="oldPassword" type='password'  show-password :required='true')
            
          el-form-item(:label=`$route.query.action? 'New password': 'Password'` v-if="!isForPending && mode !== 'view'" prop="password")
            el-input(v-model='modelValue.password' @input="emitValue({ password: $event })" name="password" type='password'  show-password :required='mode == "create"')

          el-form-item(label='Confirm password' v-if="!isForPending && mode !== 'view'" prop="confirmPassword")
            el-input(v-model='modelValue.confirmPassword' @input="emitValue({ confirmPassword: $event })" name="confirmPassword" type='password'  show-password :required='mode == "create"')

      template(v-if="activeStep === 3")
        el-form-item(label='Talent manager' prop="talentManager")
          .w-100(v-if="mode !== 'view'")
            el-input(v-model='modelValue.talentManager' @keypress="$store.getters.isNotNumber($event)" @input="emitValue({ talentManager: $event })" name="talentManager" required)
          .w-100(v-else) {{ modelValue.talentManager }}

        el-form-item(label='Referred by' prop="referralName")
          .w-100(v-if="mode !== 'view'")
            el-input(v-model='modelValue.referralName' @keypress="$store.getters.isNotNumber($event)" @input="emitValue({ referralName: $event })" name="referralName" required)
          .w-100(v-else) {{ modelValue.referralName }}

        el-form-item(label='Special talent' prop="specialTalent")
          .w-100(v-if="mode !== 'view'")
            el-select.w-100(v-model='modelValue.specialTalent' @change="emitValue({ specialTalent: $event })" name="specialTalent" required)
              el-option(v-for="option in $store.state.specialTalentOptions" :key='option' :label='option' :value='option')
          .w-100(v-else) {{ modelValue.specialTalent }}
        
        el-form-item(label='Video URL of talent demo' prop="videoLink")
          .w-100(v-if="mode !== 'view'")   
            el-input(v-model='modelValue.videoLink' @input="emitValue({ videoLink: $event })" name="videoLink" required)
          .w-100(v-else) 
            a(:href="modelValue.videoLink" target="_blank") {{ modelValue.videoLink }}


    
        .d-flex.justify-content-center.mt-3(v-if="$route.path.includes('apply-as-a-host')")
          el-checkbox(v-model="checkedTerms"  size="large")
            | I agree to the 
            a(:href="termsUrl" target="_blank") Terms and Conditions

        div.d-flex.justify-content-end.mt-3(v-if="((mode !== 'view' && !isForPending) || $route.path.includes('apply-as-a-host')) && activeStep === 3")
          el-button.me-2(text :disabled='isLoading' @click="$router.push({ name: 'Hosts' })" v-if="!$route.query.action && !$route.path.includes('apply-as-a-host')") 
            | Discard
          el-button(v-if="mode == 'create'" type='primary' native-type='submit' :loading='isLoading') 
            span(v-if="$route.path.includes('apply-as-a-host')") Submit Application
            span(v-else) Create
          el-button(v-else-if="mode == 'edit'" type='primary' native-type='submit' :loading='isLoading') 
            span(v-if='$route.query.action') Save changes
            span(v-else) Edit
      
      div.d-flex.justify-content-end.border-top.mt-3
        div.mt-3
          el-button(v-if="activeStep > 1" type='info' text bg @click="activeStep -= 1" style="width: 110px") 
            i.bi.bi-chevron-left.me-2
            | Previous
          el-button(v-if="activeStep < 3" type='primary'  @click="validate" style="width: 110px") 
            | Next
            i.bi.bi-chevron-right.ms-2
       
        
</template>

<script>
import countries from "@/assets/countries.json";
export default {
  name: "HostsForm",
  data() {
    return {
      countries: countries,
      checkedTerms: false,
      termsUrl: "https://e-see.azurewebsites.net/terms.pdf",
      activeStep: 1,
      rules: {
        id: [
          {
            required: true,
            message: "This field is required.",
            trigger: "change",
          },
        ],
        email: [
          {
            type: "email",
            required: true,
            message: "This field is required (email format).",
            trigger: "change",
          },
        ],
        password: [
          {
            required: this.mode == "create",
            message: "This field is required.",
            trigger: "change",
          },
        ],
        confirmPassword: [
          {
            required: this.mode == "create",
            message: "This field is required.",
            trigger: "change",
          },
        ],
        lastName: [
          {
            required: true,
            message: "This field is required.",
            trigger: "change",
          },
        ],
        firstName: [
          {
            required: true,
            message: "This field is required.",
            trigger: "change",
          },
        ],
        birthDate: [
          {
            required: true,
            message: "This field is required.",
            trigger: "change",
          },
        ],
        gender: [
          {
            required: true,
            message: "This field is required.",
            trigger: "change",
          },
        ],
        address: [
          {
            required: true,
            message: "This field is required.",
            trigger: "change",
          },
        ],
        country: [
          {
            required: true,
            message: "This field is required.",
            trigger: "change",
          },
        ],
        mobileNumber: [
          {
            required: true,
            message: "This field is required.",
            trigger: "change",
          },
        ],
        upliveName: [
          {
            required: true,
            message: "This field is required.",
            trigger: "change",
          },
        ],
        instagramAccount: [
          {
            required: true,
            message: "This field is required.",
            trigger: "change",
          },
        ],
        facebookAccount: [
          {
            required: true,
            message: "This field is required.",
            trigger: "change",
          },
        ],
        tiktokAccount: [
          {
            required: true,
            message: "This field is required.",
            trigger: "change",
          },
        ],
        talentManager: [
          {
            required: true,
            message: "This field is required.",
            trigger: "change",
          },
        ],
        referralName: [
          {
            required: true,
            message: "This field is required.",
            trigger: "change",
          },
        ],
        specialTalent: [
          {
            required: true,
            message: "This field is required.",
            trigger: "change",
          },
        ],
        videoLink: [
          {
            required: true,
            message: "This field is required.",
            trigger: "change",
          },
        ],
      },
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
    isForPending: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    emitValue(inputValue) {
      const updatedModelValue = { ...this.modelValue, ...inputValue };
      this.$emit("update:modelValue", updatedModelValue);
    },
    async validate() {
      // eslint-disable-next-line no-unused-vars
      await this.$refs.formRef.validate((valid, fields) => {
        if (valid) {
          this.activeStep += 1;
        }
      });
    },
    async finalValidate(event) {
      // eslint-disable-next-line no-unused-vars
      await this.$refs.formRef.validate((valid, fields) => {
        if (valid) {
          if (!this.isForPending) {
            this.$emit("submitForm", event);
          } else {
            if (!this.checkedTerms) {
              alert(
                "You must agree with the terms and conditions before proceeding."
              );
            } else {
              this.$emit("submitForm", event);
            }
          }
        }
      });
    },
  },
};
</script>
