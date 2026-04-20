import { createApp } from "vue";
import { createPinia } from "pinia";
import "./style.css";
import App from "./App.vue";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "simple-notify/dist/simple-notify.css";
import Notify from "simple-notify";
import protobuf from "google-protobuf";
import { useAppStore } from "./stores/app";

(window as any).Notify = Notify;
(window as any).jspb = protobuf;
(window as any).google = {
  protobuf: {
    Timestamp: protobuf.Timestamp,
    FieldMask: protobuf.FieldMask,
  },
  rpc: {},
};

const app = createApp(App);
const pinia = createPinia();
app.use(pinia);
useAppStore(pinia);
app.mount("#app");
