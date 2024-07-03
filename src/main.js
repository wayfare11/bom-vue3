import { createApp } from 'vue';
import App from './App.vue';
import router from './router'; // 假设你的路由文件名为 router.js
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

const app = createApp(App)
app.use(ElementPlus)
app.use(router).mount('#app');