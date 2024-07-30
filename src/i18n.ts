// src/i18n.js
import { createI18n } from 'vue-i18n';

const messages = {
  en: {
    welcome: 'Welcome',
    description: 'Description',
  },
  es: {
    welcome: 'Bienvenido',
    description: 'Descripción',
  },
};

const i18n = createI18n({
  locale: 'en', // Idioma por defecto
  fallbackLocale: 'en', // Idioma de respaldo
  messages,
});

export default i18n;
