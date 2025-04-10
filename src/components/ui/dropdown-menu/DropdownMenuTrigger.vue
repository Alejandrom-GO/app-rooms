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

const props = defineProps<{
  class?: string
}>()
</script> 