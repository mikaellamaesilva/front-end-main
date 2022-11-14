<template lang="pug">
div
  .d-flex.align-items-md-center.flex-wrap.flex-column.flex-md-row
    span.h2.fw-bold Help Center
    .ms-md-auto(v-if='String($store.state.userDetails.adminLevel).includes("admin")')
      el-button(type='primary' @click='prepareCreateMode') 
          i.bi.bi-plus-lg.me-2
          | Add New
  el-divider

  SearchBar(v-model='search' @update:modelValue='searchNow')

  div(v-if='faqs.length > 0')
    FaqCard.mb-5(v-for="faq in faqs" :data='faq' :key='faq.data' @deleteFaq="deleteFaq" @editFaq="prepareEditMode")
  div(v-else)
    el-empty(description='There are no FAQ data here')

  el-drawer(v-model='isOpenedDrawer' direction='rtl' size='40%')
      template(#header)
        span.h5.fw-bold(v-if="isCreateMode") Create FAQ
        span.h5.fw-bold(v-else) Edit FAQ

      el-form(label-position='left' label-width='140px' :model='form' @submit.prevent='submitForm')
        .h4.mb-3 
          i.bi.bi-info-circle-fill.me-2
          | FAQ Details
        el-form-item(label='Question')
          el-input(v-model='form.question' required)

        el-form-item(label='Answer')
          el-input(v-model='form.answer' required type="textarea")

        div.d-flex.justify-content-end.mt-3
          el-button.me-2(text :disabled='isLoading' @click="isOpenedDrawer = false") 
            | Discard
          el-button(v-if="isCreateMode" type='primary' native-type='submit' :loading='isLoading') Create
          el-button(v-else type='primary' native-type='submit' :loading='isLoading') Save
</template>

<script>
import { apiClient } from "@/services/MainService";
import FaqCard from "@/components/FaqCard.vue";
import SearchBar from "@/components/SearchBar.vue";
export default {
  name: "Faq",
  components: {
    FaqCard,
    SearchBar,
  },
  data() {
    return {
      faqs: [],
      backup: [],
      form: {
        question: "",
        answer: "",
      },
      search: {
        input: "",
        filter: {
          name: "Filter by question",
          value: "question",
          type: "text",
        },
        options: [
          {
            name: "Filter by question",
            value: "question",
            type: "text",
          },
          {
            name: "Filter by answer",
            value: "answer",
            type: "text",
          },
        ],
        selectTypeOptions: [],
      },
      isLoading: false,
      isOpenedDrawer: false,
      isCreateMode: true,
      oldFaqInfo: {},
    };
  },
  methods: {
    searchNow() {
      const searchInput = this.search?.input?.trim().toLowerCase();
      this.faqs = [...this.backup];
      if (searchInput) {
        const [key1, key2] = this.search.filter.value.split(".");
        if (
          this.search.filter.type == "text" ||
          this.search.filter.type == "select"
        ) {
          if (key1 && key2) {
            this.faqs = this.faqs.filter((el) =>
              el[key1][key2].toLowerCase().trim().includes(searchInput)
            );
          } else {
            this.faqs = this.faqs.filter((el) =>
              el[key1].toLowerCase().trim().includes(searchInput)
            );
          }
        } else {
          this.faqs = [...this.backup];
          if (key1 && key2) {
            this.faqs = this.faqs.filter((el) =>
              new Date(el[key1][key2])
                .toLocaleDateString("en-CA")
                .includes(searchInput)
            );
          } else {
            this.faqs = this.faqs.filter((el) =>
              new Date(el[key1])
                .toLocaleDateString("en-CA")
                .includes(searchInput)
            );
          }
        }
      } else {
        this.faqs = [...this.backup];
      }
    },
    prepareCreateMode() {
      this.isCreateMode = true;
      this.form = {
        question: "",
        answer: "",
      };
      this.isOpenedDrawer = true;
    },
    prepareEditMode(faqId) {
      this.isCreateMode = false;
      const faq = Object.assign(
        {},
        this.faqs.find((el) => el.id == faqId)
      );
      this.form.question = faq.question;
      this.form.answer = faq.answer;
      this.form.id = faqId;
      this.oldFaqInfo = Object.assign({}, faq);
      this.isOpenedDrawer = true;
    },
    async deleteFaq(faqId) {
      try {
        await apiClient.delete(`/faqs/${faqId}`);
        this.faqs = this.faqs.filter((el) => el.id !== faqId);

        // eslint-disable-next-line no-undef
        ElNotification({
          title: "Notification",
          message: "A FAQ has been successfully deleted.",
          type: "success",
          duration: 5000,
        });
      } catch (error) {
        console.log(error);
      }
    },
    async submitForm() {
      this.isLoading = true;
      if (this.isCreateMode) {
        try {
          const { data } = await apiClient.post("/faqs", this.form);
          // eslint-disable-next-line no-undef
          ElNotification({
            title: "Notification",
            message: "A new FAQ has been successfully created.",
            type: "success",
            duration: 5000,
          });
          this.faqs.push(data.result);

          this.isOpenedDrawer = false;
        } catch (error) {
          console.log(error);
        }
      } else {
        try {
          const { data } = await apiClient.patch(
            `/faqs/${this.form.id}`,
            this.form
          );
          // eslint-disable-next-line no-undef
          ElNotification({
            title: "Notification",
            message: "A FAQ has been successfully updated.",
            type: "success",
            duration: 5000,
          });
          const index = this.faqs.findIndex((el) => el.id == this.form.id);

          const updatedFaq = data.result[1][0];

          this.faqs[index] = updatedFaq;
          this.isOpenedDrawer = false;
        } catch (error) {
          console.log(error);
        }
      }
      this.isLoading = false;
    },
  },
  async beforeRouteEnter(routeTo, routeFrom, next) {
    try {
      const { data } = await apiClient.get("/faqs");
      next((component) => {
        component.faqs = data.result;
        component.backup = data.result;
      });
    } catch (error) {
      console.log(error);
    }
  },
};
</script>
