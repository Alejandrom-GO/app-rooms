import { createI18n } from 'vue-i18n'

// Importar los archivos de traducción
import es from './locales/es.json'
import en from './locales/en.json'

// Crear la instancia de i18n
const i18n = createI18n({
  legacy: false, // Usar la API de composición
  locale: localStorage.getItem('language') || 'es', // Idioma por defecto
  fallbackLocale: 'es', // Idioma de respaldo
  messages: {
    es,
    en
  }
})

export default i18n 