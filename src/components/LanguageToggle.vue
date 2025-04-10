<template>
  <div class="flex items-center space-x-2">
    <Button variant="outline" size="sm" @click="toggleLanguage">
      <span class="mr-2">{{ currentLanguageLabel }}</span>
      <Icon icon="radix-icons:globe" class="h-4 w-4" />
    </Button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { Button } from './ui/button'
import { Icon } from '@iconify/vue'

const { locale } = useI18n()

const currentLanguageLabel = computed(() => {
  return locale.value === 'es' ? 'Español' : 'English'
})

const toggleLanguage = () => {
  locale.value = locale.value === 'es' ? 'en' : 'es'
  localStorage.setItem('language', locale.value)
}
</script> 