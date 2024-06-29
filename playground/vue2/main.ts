import { createApp, version } from 'vue-demi'
import 'uno.css'
import App from './src/App.vue'
console.log('vue版本', version)
createApp(App).mount('#play')
