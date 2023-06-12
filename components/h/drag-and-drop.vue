<script setup lang="ts">
const event = reactive({ drag: false, hover: false });

const dragover = (e) => {
  e.preventDefault();
  event.drag = true;
};
const dragleave = (e) => {
  e.preventDefault();
  event.drag = false;
};
const mouseover = (e) => {
  e.preventDefault();
  event.hover = true;
};
const mouseleave = (e) => {
  e.preventDefault();
  event.hover = false;
};
// const drop = (e) => {
//   event.drag = false;
// };
</script>
<template>
  <div
    @dragover="dragover"
    @dragleave="dragleave"
    @mouseover="mouseover"
    @mouseleave="mouseleave"
  >
    <slot v-bind="event"> </slot>
  </div>
</template>
