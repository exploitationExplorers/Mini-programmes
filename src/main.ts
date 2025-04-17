import { createSSRApp } from "vue";
import App from "./App.vue";

// 导入uni-ui组件
import uniPopup from '@/components/uni-popup/uni-popup.vue';

export function createApp() {
  const app = createSSRApp(App);

  // 注册uni-ui组件
  app.component('uni-popup', uniPopup);

  return {
    app,
  };
}
