// src/installI18n.js
import i18n from './i18n';

export default {
  install(app) {
    app.use(i18n);
  },
};
