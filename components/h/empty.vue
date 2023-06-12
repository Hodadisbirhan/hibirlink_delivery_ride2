<template>
  <section
    class="w-full h-full flex-1 flex flex-col items-center justify-center"
  >
    <slot name="image"></slot>
    <h4 :class="['font-extrabold text-neutral300 text-xl', contentClass]">
      {{ $t(content) }}
    </h4>
    <slot name="action"></slot>
  </section>
</template>
<script setup lang="ts">
interface Input {
  content: string;
  contentClass?: string;
}

const props = defineProps<Input>();
</script>
