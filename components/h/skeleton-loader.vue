<template>
  <section
    v-if="loading"
    :class="['flex flex-col rounded w-fit animate-pulse h-fit', rootClass]"
  >
    <slot>
      <div class="w-72 h-48 rounded-t bg-neutral500"></div>
      <div class="flex-1 px-4 py-8 space-y-4 sm:p-8">
        <div class="w-full h-6 rounded bg-neutral500"></div>
        <div class="w-full h-6 rounded bg-neutral500"></div>
        <div class="w-3/4 h-6 rounded bg-neutral500"></div>
      </div>
    </slot>
  </section>
</template>
<script setup lang="ts">
interface Input {
  loading: boolean;
  rootClass?: string;
}
defineProps<Input>();
</script>
