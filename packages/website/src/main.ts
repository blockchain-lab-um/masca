import { createPinia } from 'pinia';
import { createApp } from 'vue';

import App from './App.vue';
import router from './router';
import { primeVueComponents } from './util/primeVue';
import './assets/default.css';
import 'primevue/resources/themes/tailwind-light/theme.css';
import 'primevue/resources/primevue.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';

const app = createApp(App);

app.use(primeVueComponents.PrimeVue, { ripple: true });
app.use(createPinia());
app.use(router);

app
  // eslint-disable-next-line vue/multi-word-component-names, vue/no-reserved-component-names
  .component('Button', primeVueComponents.Button)
  .component('InputText', primeVueComponents.InputText)
  .component('Textarea', primeVueComponents.Textarea)
  .component('Toast', primeVueComponents.Toast)
  .component('Dropdown', primeVueComponents.Dropdown)
  .component('Chip', primeVueComponents.Chip)
  .component('DataTable', primeVueComponents.DataTable)
  .component('Column', primeVueComponents.Column)
  .component('ColumnGroup', primeVueComponents.ColumnGroup)
  .component('Row', primeVueComponents.Row)
  .component('Dialog', primeVueComponents.Dialog)
  .component('InputSwitch', primeVueComponents.InputSwitch);

app.use(primeVueComponents.ToastService);

app.mount('#app');
