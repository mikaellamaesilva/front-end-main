<template lang="pug">
div
  .d-flex.align-items-md-center.flex-wrap.flex-column.flex-md-row
    span.h2.fw-bold Audits
  el-divider
  SearchBar(v-model='search' @update:modelValue='searchNow')
  div
    //- report metadata
    ReportMetadata(:isExporting='isExporting' :exportDate='exportDate'  reportName='List of Audited Admin Logins')
    div(v-if='auditsAdmin.length > 0')
      el-card(shadow='never' :body-style='{padding:0}')
        div.px-5.py-4.common-gradient
            .fs-4.fw-bold List of Audited Admin Logins
        div.p-5
          //- START export button
          .d-flex.justify-content-end 
            el-dropdown.mb-4
              template(#)
                span
                  i.bi.bi-download.me-2
                  span Export 
              template(#dropdown)
                el-dropdown-menu 
                  el-dropdown-item(@click="() => download('spreadsheet')")
                    i.bi.bi-file-earmark-spreadsheet-fill
                    | Spreadsheet (Excel/CSV)
          //- END export button
          el-table.w-100(:data="auditsAdmin")
            el-table-column(label='Date' sortable prop="createdAt" :formatter="(row, column) => new Date(row.createdAt).toLocaleString('en-CA', $store.state.dateTimeOptions)")
            el-table-column(prop='ip' label='IP address')
            el-table-column(prop='userAgent' label='User agent' sortable)
            el-table-column(prop='admin.fullName' label='Name' sortable)
            el-table-column(prop='admin.email' label='Email' sortable)
    div(v-else)
        el-empty(description='There are no audit data here')
    //- ReportMetadata(:isExporting='isExporting' :exportDate='exportDate'  reportName='List of Audited Host Logins')
    //- div(v-if='auditsHost.length > 0')
    //-   el-card(shadow='never' :body-style='{padding:0}')
    //-     div.px-5.py-4.common-gradient
    //-         .fs-4.fw-bold List of Audited Host Logins
    //-     div.p-5
    //-       //- export button
    //-       ExportButton(@click='exportDocument' :class="{'d-none': isExporting }")
    //-       el-table.w-100(:data="auditsHost")
    //-         el-table-column(label='Date' sortable)
    //-           template(#default='scope')
    //-             span {{ new Date(scope.row.createdAt).toLocaleString('en-CA', $store.state.dateTimeOptions) }}
    //-         el-table-column(prop='ip' label='IP address')
    //-         el-table-column(prop='userAgent' label='User agent' sortable)
    //-         el-table-column(prop='admin.fullName' label='Name' sortable)
    //-         el-table-column(prop='admin.email' label='Email' sortable)
      
</template>

<script>
import { apiClient } from "@/services/MainService";
export default {
  name: "Audits",
  data() {
    return {
      exportDate: "",
      isExporting: false,
      auditsAdmin: [],
      backup: [],
      auditsHost: [],
      backupHost: [],
      search: {
        input: "",
        filter: {
          name: "Filter by name",
          value: "admin.fullName",
          type: "text",
        },
        options: [
          {
            name: "Filter by date",
            value: "createdAt",
            type: "date",
          },
          {
            name: "Filter by IP address",
            value: "ip",
            type: "text",
          },
          {
            name: "Filter by user agent",
            value: "userAgent",
            type: "text",
          },
          {
            name: "Filter by name",
            value: "admin.fullName",
            type: "text",
          },
          {
            name: "Filter by email",
            value: "admin.email",
            type: "text",
          },
        ],
        selectTypeOptions: [],
      },
    };
  },
  methods: {
    searchNow() {
      const searchInput = this.search?.input?.trim().toLowerCase();
      this.auditsAdmin = [...this.backup];
      if (searchInput) {
        const [key1, key2] = this.search.filter.value.split(".");
        if (this.search.filter.type == "text") {
          if (key1 && key2) {
            this.auditsAdmin = this.auditsAdmin.filter((el) =>
              String(el[key1][key2]).toLowerCase().trim().includes(searchInput)
            );
          } else {
            this.auditsAdmin = this.auditsAdmin.filter((el) =>
              String(el[key1]).toLowerCase().trim().includes(searchInput)
            );
          }
        } else if (this.search.filter.type == "select") {
          this.auditsAdmin = this.auditsAdmin.filter(
            (el) => String(el[key1]).toLowerCase().trim() == searchInput
          );
        } else {
          this.auditsAdmin = [...this.backup];
          if (key1 && key2) {
            this.auditsAdmin = this.auditsAdmin.filter((el) =>
              new Date(el[key1][key2])
                .toLocaleDateString("en-CA")
                .includes(searchInput)
            );
          } else {
            this.auditsAdmin = this.auditsAdmin.filter((el) =>
              new Date(el[key1])
                .toLocaleDateString("en-CA")
                .includes(searchInput)
            );
          }
        }
      } else {
        this.auditsAdmin = [...this.backup];
      }
    },
    download(type) {
      let file = "data:text/csv;charset=utf-8,";
      const data = this.auditsAdmin.map((audit) => ({
        ...audit,
        email: audit.admin.email,
        firstName: audit.admin.firstName,
        lastName: audit.admin.lastName,
      }));
      const fileKey = "lastName,firstName,email,createdAt,ip,userAgent\r\n";
      file += fileKey;
      const fileKeyArray = fileKey.split(",");

      data.forEach(function (data) {
        let rowDataArray = [];
        fileKeyArray.forEach((key) => {
          rowDataArray.push(data[key.trim()]);
        });

        file += String(rowDataArray.join(",")) + "\r\n";
      });
      var encodedUri = encodeURI(file);

      if (type === "spreadsheet") {
        const link = document.createElement("a");
        link.download = `Audit (${new Date()})`;
        link.href = encodedUri;
        link.click();
      }
    },
  },
  async beforeRouteEnter(routeTo, routeFrom, next) {
    try {
      const {
        data: { result },
      } = await apiClient.get("/audits");

      const admin = result.filter((el) => el.admin !== null);
      const host = result.filter((el) => el.host !== null);
      next((component) => {
        component.auditsAdmin = admin;
        component.backup = admin;
        component.auditsHost = host;
        component.backupHost = host;
      });
    } catch (error) {
      console.log(error);
    }
  },
};
</script>
