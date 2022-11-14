/* eslint-disable prettier/prettier */
import { createRouter, createWebHistory } from "vue-router";
import store from "@/store/index";
import BaseAppLayout from "../views/BaseAppLayout.vue";

import Announcements from "../views/Announcements.vue";
import CreateEditAnnouncement from "../views/CreateEditAnnouncement.vue";

import Administrators from "../views/Administrators.vue";
import CreateEditViewAdministrator from "../views/CreateEditViewAdministrator.vue";

import Hosts from "../views/Hosts.vue";
import CreateEditViewHost from "../views/CreateEditViewHost.vue";

import PendingHosts from "../views/PendingHosts.vue";
import ViewPendingHost from "../views/ViewPendingHost.vue";

import CalendarActivities from "../views/CalendarActivities.vue";
import CreateEditCalendarActivity from "../views/CreateEditCalendarActivity.vue";

import HostPerformance from "../views/HostPerformance.vue";

import ApplyAsAHost from "../views/ApplyAsAHost.vue";

import Leaderboard from "../views/Leaderboard.vue";

import Faq from "../views/Faq.vue";

import Login from "../views/Login.vue";
import LoginAdmin from "../views/LoginAdmin.vue";

import Index from "../views/Index.vue";

import ReportRecruitment from "../views/ReportRecruitment.vue";
import ReportPerformance from "../views/ReportPerformance.vue";
import ReportActivity from "../views/ReportActivity.vue";

import Dashboard from "../views/Dashboard.vue";

import Audits from "../views/Audits.vue";

import Performances from "../views/Performances.vue";

import EmailVerified from "../views/EmailVerified.vue";
import NProgress from "nprogress";

const routes = [
  {
    path: "/login-host",
    name: "Login",
    component: Login,
    meta: {
      permissions: {
        requireAuth: false,
        allowedRoles: [],
      },
    },
  },
  {
    path: "/login-admin",
    name: "LoginAdmin",
    component: LoginAdmin,
    meta: {
      permissions: {
        requireAuth: false,
        allowedRoles: [],
      },
    },
  },
  {
    path: "/apply-as-a-host",
    name: "ApplyAsAHost",
    component: ApplyAsAHost,
    meta: {
      permissions: {
        requireAuth: false,
        allowedRoles: [],
      },
    },
  },
  {
    path: "/verify-email",
    name: "EmailVerified",
    component: EmailVerified,
    meta: {
      permissions: {
        requireAuth: false,
        allowedRoles: [],
      },
    },
  },
  {
    path: "/",
    name: "Index",
    component: Index,
    meta: {
      permissions: {
        requireAuth: false,
        allowedRoles: [],
      },
    },
  },
  {
    path: "/",
    name: "BaseAppLayout",
    component: BaseAppLayout,
    redirect: () => {
      return { name: "Announcements" };
    },
    children: [
      {
        path: "/dashboard",
        name: "Dashboard",
        component: Dashboard,
        meta: {
          permissions: {
            requireAuth: true,
            allowedRoles: ["admin", "superadmin", "null"],
          },
        },
      },
      {
        path: "/announcements",
        name: "Announcements",
        component: Announcements,
        meta: {
          permissions: {
            requireAuth: true,
            allowedRoles: ["admin", "superadmin", "null"],
          },
        },
      },
      {
        path: "/announcements",
        name: "Announcements",
        component: Announcements,
        meta: {
          permissions: {
            requireAuth: true,
            allowedRoles: ["admin", "superadmin", "null"],
          },
        },
      },
      {
        path: "/announcements/edit/:id",
        name: "EditAnnouncement",
        component: CreateEditAnnouncement,
        meta: {
          permissions: {
            requireAuth: true,
            allowedRoles: ["admin", "superadmin"],
          },
        },
      },
      {
        path: "/announcements/create",
        name: "CreateAnnouncement",
        component: CreateEditAnnouncement,
        meta: {
          permissions: {
            requireAuth: true,
            allowedRoles: ["admin", "superadmin"],
          },
        },
      },
      {
        path: "/administrators",
        name: "Administrators",
        component: Administrators,
        meta: {
          permissions: {
            requireAuth: true,
            allowedRoles: ["superadmin"],
          },
        },
      },
      {
        path: "/administrators/create",
        name: "CreateAdministrator",
        component: CreateEditViewAdministrator,
        meta: {
          permissions: {
            requireAuth: true,
            allowedRoles: ["superadmin"],
          },
        },
      },
      {
        path: "/administrators/edit/:id",
        name: "EditAdministrator",
        component: CreateEditViewAdministrator,
        meta: {
          permissions: {
            requireAuth: true,
            allowedRoles: ["superadmin", "admin"],
          },
        },
      },
      {
        path: "/administrators/view/:id",
        name: "ViewAdministrator",
        component: CreateEditViewAdministrator,
        meta: {
          permissions: {
            requireAuth: true,
            allowedRoles: ["superadmin"],
          },
        },
      },
      {
        path: "/hosts",
        name: "Hosts",
        component: Hosts,
        meta: {
          permissions: {
            requireAuth: true,
            allowedRoles: ["superadmin", "admin"],
          },
        },
      },
      {
        path: "/hosts/view/:id/performance",
        name: "HostPerformance",
        component: HostPerformance,
        meta: {
          permissions: {
            requireAuth: true,
            allowedRoles: ["superadmin", "admin", "null"],
          },
        },
      },
      {
        path: "/hosts/create",
        name: "CreateHost",
        component: CreateEditViewHost,
        meta: {
          permissions: {
            requireAuth: true,
            allowedRoles: ["superadmin", "admin"],
          },
        },
      },
      {
        path: "/hosts/view/:id",
        name: "ViewHost",
        component: CreateEditViewHost,
        meta: {
          permissions: {
            requireAuth: true,
            allowedRoles: ["superadmin", "admin", "null"],
          },
        },
      },
      {
        path: "/hosts/edit/:id",
        name: "EditHost",
        component: CreateEditViewHost,
        meta: {
          permissions: {
            requireAuth: true,
            allowedRoles: ["superadmin", "admin", "null"],
          },
        },
      },
      {
        path: "/application-requests",
        name: "PendingHosts",
        component: PendingHosts,
        meta: {
          permissions: {
            requireAuth: true,
            allowedRoles: ["superadmin", "admin"],
          },
        },
      },
      {
        path: "/application-requests/:id",
        name: "ViewPendingHost",
        component: ViewPendingHost,
        meta: {
          permissions: {
            requireAuth: true,
            allowedRoles: ["superadmin", "admin"],
          },
        },
      },
      {
        path: "/calendar-activities",
        name: "CalendarActivities",
        component: CalendarActivities,
        meta: {
          permissions: {
            requireAuth: true,
            allowedRoles: ["superadmin", "admin", "null"],
          },
        },
      },
      {
        path: "/calendar-activities/create",
        name: "CreateCalendarActivity",
        component: CreateEditCalendarActivity,
        meta: {
          permissions: {
            requireAuth: true,
            allowedRoles: ["superadmin", "admin"],
          },
        },
      },
      {
        path: "/calendar-activities/edit/:id",
        name: "EditCalendarActivity",
        component: CreateEditCalendarActivity,
        meta: {
          permissions: {
            requireAuth: true,
            allowedRoles: ["superadmin", "admin"],
          },
        },
      },
      {
        path: "/help-center",
        name: "HelpCenter",
        component: Faq,
        meta: {
          permissions: {
            requireAuth: true,
            allowedRoles: ["superadmin", "admin", "null"],
          },
        },
      },
      {
        path: "/leaderboard",
        name: "Leaderboard",
        component: Leaderboard,
        meta: {
          permissions: {
            requireAuth: true,
            allowedRoles: ["superadmin", "admin", "null"],
          },
        },
      },
      {
        path: "/reports/activity",
        name: "ReportActivity",
        component: ReportActivity,
        meta: {
          permissions: {
            requireAuth: true,
            allowedRoles: ["superadmin", "admin"],
          },
        },
      },
      {
        path: "/reports/performance",
        name: "ReportPerformance",
        component: ReportPerformance,
        meta: {
          permissions: {
            requireAuth: true,
            allowedRoles: ["superadmin", "admin"],
          },
        },
      },
      {
        path: "/reports/recruitment",
        name: "ReportRecruitment",
        component: ReportRecruitment,
        meta: {
          permissions: {
            requireAuth: true,
            allowedRoles: ["superadmin", "admin"],
          },
        },
      },
      {
        path: "/audits",
        name: "Audits",
        component: Audits,
        meta: {
          permissions: {
            requireAuth: true,
            allowedRoles: ["superadmin"],
          },
        },
      },
      {
        path: "/performances",
        name: "Performances",
        component: Performances,
        meta: {
          permissions: {
            requireAuth: true,
            allowedRoles: ["superadmin", "admin"],
          },
        },
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach((to) => {
  NProgress.start();
  // if route requires authentication and user is not authenticated
  if (to.meta.permissions?.requireAuth && !store.state.userDetails.isAuthenticated) {

    return { name: "Login" };
  }

  // if route does not require authentication and user is authenticated
  if (!to.meta.permissions?.requireAuth && store.state.userDetails.isAuthenticated) {

    return { name: "Announcements" };
  }

  // if route requires roles and authentication and user is authenticated
  if (to.meta.permissions?.requireAuth && store.state.userDetails.isAuthenticated) {
    if (!to.meta.permissions.allowedRoles.includes(store.state.userDetails.adminLevel)) {

      return { name: "Announcements" };
    }
  }
});

router.afterEach(() => {
  NProgress.done();
});

export default router;
