<template lang="pug">
div
  .d-flex.align-items-md-center.flex-wrap.flex-column.flex-md-row(v-if="showHeader")
    span.h2.fw-bold Host Management
    .ms-md-auto(v-if='String($store.state.userDetails.adminLevel).includes("admin")')
      router-link(:to="{ name: 'CreateHost' }" )
        el-button(type='primary') 
            i.bi.bi-plus-lg.me-2
            | Add New
  el-divider
  SearchBar(v-model='search' @update:modelValue='searchNow')
 
  div
    div(v-if='hosts.length > 0')
      el-card(shadow='never' :body-style='{padding:0}')
        div.px-5.py-4.common-gradient
            .fs-4.fw-bold List of Hosts
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
          el-table.w-100(:data="hosts")
            el-table-column(width="70")
              template(#default='scope')
                el-avatar(:src='scope.row.avatarImageUrl ? scope.row.avatarImageUrl : $store.state.defaultAvatar' :class='{"active-avatar": scope.row.activity == "Active", "inactive-avatar": scope.row.activity == "Inactive"}' :size='35')
                span(v-if="new Date(scope.row.recruitmentDate).getMonth() == new Date().getMonth()") +
            el-table-column(prop='lastName' label='Last name' sortable)
            el-table-column(prop='firstName' label='First name' sortable)
            el-table-column(prop='id' label='UPLive ID' sortable)
            el-table-column(label='Action' width='230px')
              template(#default='scope')
                div
                  el-popover(title='What do you want to view?' trigger="hover" :width="300" content="this is content, this is content, this is content")
                    template(#reference)
                      el-button(plain type="info" link)
                          i.bi.bi-eye-fill
                    template(#default)
                      el-link.me-5(type='info' @click='$router.push({ name: "ViewHost", params: { id: scope.row.id } })') Host info 
                      el-link(type='info'  @click="$router.push({ name: 'HostPerformance', params: { id: scope.row.id, host: scope.row }, })") Performance
                        
                  el-button(plain type="warning" link @click='prepareSendEmail(scope.row)' v-if="scope.row.hasConfirmedEmail")
                    i.bi.bi-envelope-plus-fill
                  el-button(plain type="primary" link @click='$router.push({ name: "EditHost", params: { id: scope.row.id } })')
                    i.bi.bi-pencil-square
                  el-popconfirm(title='Are you sure you want to delete this?' confirm-button-type='danger' @confirm="deleteHost(scope.row.id)")
                    template(#reference)
                      el-button(plain type="danger" link)
                        i.bi.bi-trash-fill
    div(v-else)
      el-empty(description='There are no host data here')
    el-drawer(v-model='isOpenedDrawer' direction='rtl' size='40%')
      template(#header)
        .d-flex.flex-column
          .fw-bold.h4
            i.bi.bi-envelope-fill.me-3
            | Compose Email 
      el-form(label-position='left' label-width='140px' @submit.prevent='sendEmail')
        el-form-item(label='Recipient') {{ emailRecipient.fullName }} (UPLive ID: {{ emailRecipient.id }})
        el-form-item(label='Message')
          el-input(v-model='emailMessageBody' required type='textarea')
        div.d-flex.justify-content-end.mt-3
          el-button.me-2(text :disabled='isLoading' @click="isOpenedDrawer = false") Discard
          el-button(type='warning' native-type='submit' :loading='isLoading') Send
</template>

<script>
import { apiClient } from "@/services/MainService";
import SearchBar from "@/components/SearchBar.vue";
export default {
  name: "Host Management",
  components: {
    SearchBar,
  },
  props: {
    showHeader: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      exportDate: "",
      isExporting: false,
      isLoading: false,
      hosts: [],
      search: {
        input: "",
        filter: {
          name: "Filter by last name",
          value: "lastName",
          type: "text",
        },
        options: [
          {
            name: "Filter by last name",
            value: "lastName",
            type: "text",
          },
          {
            name: "Filter by first name",
            value: "firstName",
            type: "text",
          },
          {
            name: "Filter by UPLive ID",
            value: "id",
            type: "text",
          },
          {
            name: "Filter by activity",
            value: "activity",
            type: "select",
          },
        ],
        selectTypeOptions: [
          {
            name: "Active",
            value: "Active",
          },
          {
            name: "Inactive",
            value: "Inactive",
          },
        ],
      },
      backup: [],
      emailRecipient: null,
      emailMessageBody: "",
      isOpenedDrawer: false,
    };
  },
  methods: {
    download(type) {
      let file = "data:text/csv;charset=utf-8,";
      const fileKey =
        "id,email,lastName,firstName,birthDate,gender,address,country,mobileNumber,upliveName,talentManager,referralName,specialTalent,videoLink,facebookAccount,instagramAccount,tiktokAccount,recruitmentDate,hasConfirmedEmail\r\n";
      file += fileKey;
      const fileKeyArray = fileKey.split(",");

      this.hosts.forEach(function (data) {
        let rowDataArray = [];
        fileKeyArray.forEach((key) => {
          rowDataArray.push(data[key.trim()]);
        });

        file += String(rowDataArray.join(",")) + "\r\n";
      });
      var encodedUri = encodeURI(file);

      if (type === "spreadsheet") {
        const link = document.createElement("a");
        link.download = `Hosts Management (${new Date()})`;
        link.href = encodedUri;
        link.click();
      }
    },
    prepareSendEmail(host) {
      this.emailRecipient = host;
      this.isOpenedDrawer = true;
    },
    async sendEmail() {
      this.isLoading = true;
      try {
        await apiClient.post("/auth/send-email", {
          userDetails: this.emailRecipient,
          message: this.emailMessageBody,
        });
        // eslint-disable-next-line no-undef
        ElNotification({
          title: "Notification",
          message: "Your email has been successfully sent.",
          type: "success",
          duration: 5000,
        });
        this.isOpenedDrawer = false;
      } catch (err) {
        console.log(err);
      }
      this.isLoading = false;
    },
    exportDocument() {
      this.exportDate = new Date().toLocaleString(
        "en-CA",
        this.$store.state.dateOptions
      );
      this.isExporting = true;
      this.$refs.exportDocument.download();
      setTimeout(() => {
        this.isExporting = false;
      }, 350);
    },
    searchNow() {
      const searchInput = this.search?.input?.trim().toLowerCase();
      this.hosts = [...this.backup];
      if (searchInput) {
        const [key1, key2] = this.search.filter.value.split(".");
        if (this.search.filter.type == "text") {
          if (key1 && key2) {
            this.hosts = this.hosts.filter((el) =>
              String(el[key1][key2]).toLowerCase().trim().includes(searchInput)
            );
          } else {
            this.hosts = this.hosts.filter((el) =>
              String(el[key1]).toLowerCase().trim().includes(searchInput)
            );
          }
        } else if (this.search.filter.type == "select") {
          this.hosts = this.hosts.filter(
            (el) => String(el[key1]).toLowerCase().trim() == searchInput
          );
        } else {
          this.hosts = [...this.backup];
          if (key1 && key2) {
            this.hosts = this.hosts.filter((el) =>
              new Date(el[key1][key2])
                .toLocaleDateString("en-CA")
                .includes(searchInput)
            );
          } else {
            this.hosts = this.hosts.filter((el) =>
              new Date(el[key1])
                .toLocaleDateString("en-CA")
                .includes(searchInput)
            );
          }
        }
      } else {
        this.hosts = [...this.backup];
      }
    },
    async deleteHost(hostId) {
      try {
        await apiClient.delete(`/hosts/${hostId}`);
        this.hosts = this.hosts.filter((el) => el.id !== hostId);

        // eslint-disable-next-line no-undef
        ElNotification({
          title: "Notification",
          message: "A host has been successfully deleted.",
          type: "success",
          duration: 5000,
        });
      } catch (error) {
        console.log(error);
      }
    },
  },
  async beforeRouteEnter(routeTo, routeFrom, next) {
    try {
      const { data } = await apiClient.get("/hosts?includeActivity=true");
      data.result.forEach((el) => {
        if (el.performances.length > 0) {
          el.activity = "Active";
        } else {
          el.activity = "Inactive";
        }
      });
      next((component) => {
        component.hosts = data.result;
        component.backup = data.result;
      });
    } catch (error) {
      console.log(error);
    }
  },
};
</script>

<style scoped>
.active-avatar {
  border: 2px solid rgb(0, 201, 167);
}

.inactive-avatar {
  border: 2px solid rgb(237, 76, 120);
}
</style>
