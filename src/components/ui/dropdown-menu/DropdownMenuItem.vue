<template>
  <DropdownMenuPrimitiveItem
    :class="[
      'relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      props.class
    ]"
    v-bind="$attrs"
  >
    <slot />
  </DropdownMenuPrimitiveItem>
</template>

<script setup lang="ts">
import { DropdownMenuItem as DropdownMenuPrimitiveItem } from 'reka-ui'

const props = defineProps<{
  class?: string
}>()
</script> 