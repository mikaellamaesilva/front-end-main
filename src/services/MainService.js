import axios from "axios";
import store from "@/store/index";
import router from "@/router";

axios.defaults.crossDomain = true;

axios.defaults.headers = {
  Accept: "application/json",
  "Content-Type": "application/json",
};

axios.defaults.timeout = 20000;
// axios.defaults.baseURL = "https://e-see.azurewebsites.net/api/";
axios.defaults.baseURL = "http://localhost:5000/api/";

const apiClient = axios.create();

apiClient.interceptors.request.use(
  function (config) {
    const accessToken = String(store.state.accessToken);
    config.headers.Authorization = `Bearer ${accessToken}`;
    return config;
  },
  function (error) {
    console.log(error.response);
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    if (error.response.data.status == 401) {
      if (
        error?.response?.data?.message?.description ==
        "The old password is incorrect."
      ) {
        //
      } else {
        store.dispatch("logout");
        if (router.currentRoute.value.name == "LoginAdmin") {
          router.replace({ name: "LoginAdmin" });
        } else {
          router.replace({ name: "Login" });
        }
      }
    } else if (error.response.data.status == 404) {
      router.replace({ name: "PageNotFound" });
    }
    // eslint-disable-next-line no-undef
    ElNotification({
      title: error.response.data.message.title,
      message: error.response.data.message.description,
      type: "error",
      duration: 5000,
    });
    return Promise.reject(error);
  }
);

export { apiClient };
