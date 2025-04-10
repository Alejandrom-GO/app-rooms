<template>
  <DropdownMenuPrimitiveTrigger
    :class="[
      'outline-none',
      props.class
    ]"
    v-bind="$attrs"
  >
    <slot />
  </DropdownMenuPrimitiveTrigger>
</template>

<script setup lang="ts">
import { DropdownMenuTrigger as DropdownMenuPrimitiveTrigger } from 'reka-ui'
import { cn } from '@/lib/utils'

const props = defineProps<{
  class?: string
}>()
</script> 