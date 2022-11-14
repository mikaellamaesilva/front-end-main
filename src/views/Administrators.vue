<template lang="pug">
div
  .d-flex.align-items-md-center.flex-wrap.flex-column.flex-md-row
    span.h2.fw-bold Administrators
    .ms-md-auto(v-if='String($store.state.userDetails.adminLevel).includes("admin")')
      router-link(:to="{ name: 'CreateAdministrator' }" )
        el-button(type='primary') 
            i.bi.bi-plus-lg.me-2
            | Add New
  el-divider
  SearchBar(v-model='search' @update:modelValue='searchNow')
 
  div
   
    div(v-if='administrators.length > 0')
      el-card(shadow='never' :body-style='{padding:0}')
        div.px-5.py-4.common-gradient
            .fs-4.fw-bold List of Administrators
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


          el-table.w-100(:data="administrators")
            el-table-column(width="70")
              template(#default='scope')
                el-avatar(:src='scope.row.avatarImageUrl ? scope.row.avatarImageUrl : $store.state.defaultAvatar' :size='35')
            el-table-column(prop='lastName' label='Last name' sortable)
            el-table-column(prop='firstName' label='First name' sortable)
            el-table-column(prop='email' label='Email' sortable)
            el-table-column(label='Action')
              template(#default='scope')
                div
                  el-button(plain type="info" link @click='$router.push({ name: "ViewAdministrator", params: { id: scope.row.id } })')
                    i.bi.bi-eye-fill
                  el-button(plain type="primary" link @click='$router.push({ name: "EditAdministrator", params: { id: scope.row.id } })')
                    i.bi.bi-pencil-square
                  el-popconfirm(title='Are you sure you want to delete this?' confirm-button-type='danger' @confirm="deleteAdministrator(scope.row.id)")
                    template(#reference)
                      el-button(plain type="danger" link)
                        i.bi.bi-trash-fill
    div(v-else)
      el-empty(description='There are no administrator data here')
</template>

<script>
import { apiClient } from "@/services/MainService";
export default {
  name: "Administrators",
  data() {
    return {
      exportDate: "",
      isExporting: false,
      administrators: [],
      backup: [],
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
            name: "Filter by email",
            value: "email",
            type: "text",
          },
        ],
      },
    };
  },
  methods: {
    download(type) {
      let file = "data:text/csv;charset=utf-8,";
      const fileKey =
        "id,email,lastName,firstName,birthDate,gender,address,country,mobileNumber\r\n";
      file += fileKey;
      const fileKeyArray = fileKey.split(",");

      this.administrators.forEach(function (data) {
        let rowDataArray = [];
        fileKeyArray.forEach((key) => {
          rowDataArray.push(data[key.trim()]);
        });

        file += String(rowDataArray.join(",")) + "\r\n";
      });
      var encodedUri = encodeURI(file);

      if (type === "spreadsheet") {
        const link = document.createElement("a");
        link.download = `Administrators (${new Date()})`;
        link.href = encodedUri;
        link.click();
      }
    },
    searchNow() {
      const searchInput = this.search?.input?.trim().toLowerCase();
      this.administrators = [...this.backup];
      if (searchInput) {
        const [key1, key2] = this.search.filter.value.split(".");
        if (this.search.filter.type == "text") {
          if (key1 && key2) {
            this.administrators = this.administrators.filter((el) =>
              String(el[key1][key2]).toLowerCase().trim().includes(searchInput)
            );
          } else {
            this.administrators = this.administrators.filter((el) =>
              String(el[key1]).toLowerCase().trim().includes(searchInput)
            );
          }
        } else if (this.search.filter.type == "select") {
          this.administrators = this.administrators.filter(
            (el) => String(el[key1]).toLowerCase().trim() == searchInput
          );
        } else {
          this.administrators = [...this.backup];
          if (key1 && key2) {
            this.administrators = this.administrators.filter((el) =>
              new Date(el[key1][key2])
                .toLocaleDateString("en-CA")
                .includes(searchInput)
            );
          } else {
            this.administrators = this.administrators.filter((el) =>
              new Date(el[key1])
                .toLocaleDateString("en-CA")
                .includes(searchInput)
            );
          }
        }
      } else {
        this.administrators = [...this.backup];
      }
    },
    async deleteAdministrator(administratorId) {
      try {
        await apiClient.delete(`/admins/${administratorId}`);
        this.administrators = this.administrators.filter(
          (el) => el.id !== administratorId
        );

        // eslint-disable-next-line no-undef
        ElNotification({
          title: "Notification",
          message: "An administrator has been successfully deleted.",
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
      const { data } = await apiClient.get("/admins");
      const filtered = data.result.filter(
        (el) => el.adminLevel !== "superadmin"
      );
      next((component) => {
        component.administrators = filtered;
        component.backup = filtered;
      });
    } catch (error) {
      console.log(error);
    }
  },
};
</script>
