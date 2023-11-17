import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import YqFacedetector from 'yq-facedetector';
import "yq-facedetector/dist/style.css"
createApp(App)
    .use(YqFacedetector)
    .mount('#app')
