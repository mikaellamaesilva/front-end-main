import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import VueApexCharts from "vue3-apexcharts";
import Vue3SimpleHtml2pdf from "vue3-simple-html2pdf";
import ExportButton from "@/components/ExportButton.vue";
import ReportMetadata from "@/components/ReportMetadata.vue";
import "nprogress/nprogress.css";

createApp(App)
  .use(store)
  .use(router)
  .use(VueApexCharts)
  .use(Vue3SimpleHtml2pdf)
  .use(ExportButton)
  .use(ReportMetadata)
  .mount("#app");
