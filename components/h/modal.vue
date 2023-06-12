<template>
  <div
    v-if="isOpenVariable"
    :class="['fixed z-50 h-[100vh]', parentClass]"
    aria-labelledby="modal-title"
    role="dialog"
    aria-modal="true"
  >
    <div
      class="fixed inset-0 z-50 bg-neutral300 bg-opacity-75 transition-opacity"
    ></div>

    <div :class="['fixed inset-0 z-50  overflow-y-auto', subParentClass]">
      <div class="relative " :class="contentParentClass">
        <div class="absolute z-50 top-1 right-3">
          <Icon
            name="ep:circle-close"
            class="text-2xl cursor-pointer font-bold hover:text-darkblue"
            @click="isOpenVariable = false"
          />
        </div>
        <slot name="content"></slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface PropsInterface {
  parentClass?: string;
  subParentClass?: string;
  modelValue?: Boolean;
  contentParentClass?: string;
}
const emits = defineEmits(["update:modelValue"]);
const props = defineProps<PropsInterface>();

const isOpenVariable = computed({
  get: () => {
    console.log(props.modelValue);
    return props.modelValue;
  },
  set: (newValue) => {
    emits("update:modelValue", newValue);
  },
});
</script>
