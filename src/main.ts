import { createApp } from 'vue'
import router from '@/presentation/router'
import './assets/main.css'
import App from './App.vue'

const app = createApp(App)
app.use(router)
app.mount('#app')
