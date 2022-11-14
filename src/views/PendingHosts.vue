<template lang="pug">
div
  .d-flex.align-items-md-center.flex-wrap.flex-column.flex-md-row
    span.h2.fw-bold Application Requests
  el-divider
  SearchBar(v-model='search' @update:modelValue='searchNow')

  div(v-if='pendingHosts.length > 0')
    el-card(:body-style='{padding:0}')
      div.px-5.py-4.common-gradient
        .fs-4.fw-bold List of Applications
      .p-5
        el-table.w-100(:data="pendingHosts")
          el-table-column(prop='lastName' label='Last name' sortable)
          el-table-column(prop='firstName' label='First name' sortable)
          el-table-column(prop='createdAt' label='Submission date' sortable :formatter="(row, column) => new Date(row.createdAt).toLocaleString('en-CA', $store.state.dateTimeOptions)")
          el-table-column(label='Action')
            template(#default='scope')
              div
                el-button(plain type="info" link @click='$router.push({ name: "ViewPendingHost", params: { id: scope.row.id } })')
                      i.bi.bi-eye-fill
                el-popconfirm(title='Are you sure you want to accept this application?' confirm-button-type='primary' @confirm="accept(scope.row.id)")
                  template(#reference)
                    el-button(plain type="success" link)
                      i.bi.bi-check-circle-fill
                el-popconfirm(title='Are you sure you want to reject this application?' confirm-button-type='danger' @confirm="reject(scope.row.id)")
                  template(#reference)
                    el-button(plain type="danger" link)
                      i.bi.bi-x-circle-fill
  div(v-else)
    el-empty(description='There are no application request data here')
</template>

<script>
import { apiClient } from "@/services/MainService";
import SearchBar from "@/components/SearchBar.vue";
export default {
  name: "PendingHosts",
  components: {
    SearchBar,
  },
  data() {
    return {
      pendingHosts: [],
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
    searchNow() {
      const searchInput = this.search?.input?.trim().toLowerCase();
      this.pendingHosts = [...this.backup];
      if (searchInput) {
        const [key1, key2] = this.search.filter.value.split(".");
        if (this.search.filter.type == "text") {
          if (key1 && key2) {
            this.pendingHosts = this.pendingHosts.filter((el) =>
              String(el[key1][key2]).toLowerCase().trim().includes(searchInput)
            );
          } else {
            this.pendingHosts = this.pendingHosts.filter((el) =>
              String(el[key1]).toLowerCase().trim().includes(searchInput)
            );
          }
        } else if (this.search.filter.type == "select") {
          this.pendingHosts = this.pendingHosts.filter(
            (el) => String(el[key1]).toLowerCase().trim() == searchInput
          );
        } else {
          this.pendingHosts = [...this.backup];
          if (key1 && key2) {
            this.pendingHosts = this.pendingHosts.filter((el) =>
              new Date(el[key1][key2])
                .toLocaleDateString("en-CA")
                .includes(searchInput)
            );
          } else {
            this.pendingHosts = this.pendingHosts.filter((el) =>
              new Date(el[key1])
                .toLocaleDateString("en-CA")
                .includes(searchInput)
            );
          }
        }
      } else {
        this.pendingHosts = [...this.backup];
      }
    },
    async reject(pendingHostId) {
      try {
        await apiClient.patch(`/pending-hosts/${pendingHostId}`, {
          isRecruited: false,
        });
        this.pendingHosts = this.pendingHosts.filter(
          (el) => el.id !== pendingHostId
        );

        // eslint-disable-next-line no-undef
        ElNotification({
          title: "Notification",
          message: "An application request has been successfully rejected.",
          type: "success",
          duration: 5000,
        });
      } catch (error) {
        console.log(error);
      }
    },
    async accept(pendingHostId) {
      try {
        await apiClient.patch(`/pending-hosts/${pendingHostId}`, {
          isRecruited: true,
        });
        this.pendingHosts = this.pendingHosts.filter(
          (el) => el.id !== pendingHostId
        );

        // eslint-disable-next-line no-undef
        ElNotification({
          title: "Notification",
          message: "An application request has been successfully accepted.",
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
      const { data } = await apiClient.get("/pending-hosts");
      next((component) => {
        component.pendingHosts = data.result.filter((el) => !el.isRecruited);
        component.backup = data.result.filter((el) => !el.isRecruited);
      });
    } catch (error) {
      console.log(error);
    }
  },
};
</script>
