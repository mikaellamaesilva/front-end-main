import { createStore } from "vuex";

export default createStore({
  state: {
    announcementOptions: [
      {
        type: "PK Battle",
        color: "#4287f5",
      },
      {
        type: "Reminder",
        color: "#f5aa42",
      },
      {
        type: "Task",
        color: "#70a127",
      },
      {
        type: "Others",
        color: "#6b6b6b",
      },
    ],
    genderOptions: ["Male", "Female"],
    specialTalentOptions: ["Singing", "Dancing", "Other"],
    groupOptions: ["Host", "Admin"],
    fileStackApiKey: "A0IzJ1YkeRKOB9bDN2dOkz",
    dateOptions: {
      year: "numeric",
      month: "long",
      day: "numeric",
      // hour: "numeric",
      // minute: "numeric",
    },
    dateTimeOptions: {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    },
    exportOptions: (filename) => {
      return {
        filename: filename,
        margin: 15,
        image: {
          type: "jpeg",
          quality: 1,
        },
        html2canvas: { scale: 3 },
        jsPDF: {
          unit: "mm",
          format: "a4",
          orientation: "l",
        },
      };
    },
    userDetails: {
      id: "",
      email: "",
      adminLevel: "",
      fullName: "",
      fullNameReversed: "",
      avatarImageUrl: "",
      isAuthenticated: false,
    },
    accessToken: "",
    notifications: [],
    websocket: null,
    silentMode: false,
    defaultAvatar:
      "https://ik.imagekit.io/intelliemed/default-avatar_cunOc4PbJ.jpg?ik-sdk-version=javascript-1.4.3&updatedAt=1660126551582",
  },
  getters: {
    validateForm: () => (form) => {
      let isComplete = true;
      delete form.avatarImageUrl;
      delete form.hasConfirmedEmail;
      delete form.createdBy;
      delete form.createdAt;
      delete form.adminLevel;
      Object.entries(form).forEach(([key, value]) => {
        if (!Array.isArray(value)) {
          if (!key.includes("assword")) {
            if (typeof value !== "boolean") {
              if (!value || value == "") {
                isComplete = false;
                console.log(key, value);
              }
            }
          }
        }
      });

      return isComplete;
    },
    isNumber: () => (event) => {
      const keysAllowed = [
        "0",
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        ".",
      ];
      const keyPressed = event.key;

      if (!keysAllowed.includes(keyPressed)) {
        event.preventDefault();
      }
    },
    isNotNumber: () => (event) => {
      const keysNotAllowed = [
        "0",
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        ".",
      ];
      const keyPressed = event.key;

      if (keysNotAllowed.includes(keyPressed)) {
        event.preventDefault();
      }
    },
  },
  mutations: {
    // eslint-disable-next-line no-unused-vars
    LOGOUT(state, value) {
      state.userDetails = {
        id: "",
        email: "",
        adminLevel: "",
        fullName: "",
        fullNameReversed: "",
        avatarImageUrl: "",
        isAuthenticated: false,
      };
      state.accessToken = "";
    },
    SET_AUTHENTICATION(state, value) {
      state.userDetails = value.userDetails;
      state.accessToken = value.accessToken;
    },
    CONNECT_WEBSOCKET(state, value) {
      state.websocket = value.websocket;
    },
    PUSH_NOTIFICATIONS(state, value) {
      value.notification.isOpened = false;
      state.notifications.push(value.notification);
      new Notification("E-See Notification", {
        body: value.notification.message,
      });
    },
    SET_OPEN_NOTIFICATION(state) {
      state.notifications.forEach((el) => {
        el.isOpened = true;
      });
    },
    SET_CALENDAR_REMINDERS(state, value) {
      value.forEach((event) => {
        state.notifications.push(event);
      });
    },
  },
  actions: {
    logout(context) {
      localStorage.removeItem("userDetails");
      localStorage.removeItem("accessToken");
      context.commit("LOGOUT");
    },
    initializeApplication(context) {
      let userDetails = JSON.parse(localStorage.getItem("userDetails"));
      let accessToken = localStorage.getItem("accessToken");
      if (userDetails && accessToken && userDetails.isAuthenticated) {
        context.commit("SET_AUTHENTICATION", { userDetails, accessToken });
      } else {
        userDetails = {
          id: "",
          email: "",
          adminLevel: "",
          fullName: "",
          avatarImageUrl: "",
          fullNameReversed: "",
          isAuthenticated: false,
        };
        context.commit("SET_AUTHENTICATION", { userDetails, accessToken });
      }
    },
    initializeWebsocket({ commit, state }) {
      const websocket = new WebSocket(`wss://e-see.azurewebsites.net/`);
      commit("CONNECT_WEBSOCKET", { websocket });

      state.websocket.onopen = function () {
        console.log("Websocket connected");
      };

      state.websocket.onmessage = (event) => {
        // eslint-disable-next-line no-undef
        const data = JSON.parse(event.data);
        if (!data.showToHost) {
          if (state.userDetails.adminLevel.includes("admin")) {
            commit("PUSH_NOTIFICATIONS", {
              notification: data,
            });
          }
        } else {
          commit("PUSH_NOTIFICATIONS", {
            notification: data,
          });
        }
      };

      state.websocket.onclose = (event) => {
        console.log("Chat socket closed | Code:", event.code);
      };
    },
    setNotificationState(context) {
      context.commit("SET_OPEN_NOTIFICATION");
    },
    setCalendarReminders(context, value) {
      context.commit("SET_CALENDAR_REMINDERS", value);
    },
  },
  modules: {},
});
