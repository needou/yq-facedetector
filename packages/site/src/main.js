import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import YqFacedetector from '../../components/src';

createApp(App)
    .use(YqFacedetector)
    .mount('#app')
