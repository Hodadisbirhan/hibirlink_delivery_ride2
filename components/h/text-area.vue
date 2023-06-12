<script setup lang="ts">
import { useField } from "vee-validate";
const props = defineProps({
  name: {
    type: [String],
    required: true,
  },
  id: {
    type: [String],
    required: true,
  },
  rules: {
    type: String,
  },
  placeholder: {
    type: [String],
    required: false,
  },

  label: {
    type: [String],
    required: false,
  },

  parentClass: {
    type: [String],
    required: false,
  },
  inputClass: {
    type: [String],
    required: false,
  },
  labelClass: {
    type: [String],
    required: false,
  },
  modelValue: {
    type: [String, Number, Object],
    required: false,
  },
});

const { errorMessage, value } = useField(props.name, props.rules, {
  initialValue: props.modelValue,
});

watchEffect(() => {
  console.log(errorMessage.value);
});

watch(
  () => props.modelValue,
  (newValue) => {
    value.value = newValue;
  }
);
</script>

<template>
  <div :class="['w-full flex flex-col ', parentClass]">
    <label
      :for="id"
      :class="[
        'text-neutral400 font-semibold capitalize group-hover:font-bold mb-1 text-sm',
        labelClass,
      ]"
      >{{ label }}</label
    >

    <textarea
      :class="[
        'w-full placeholder:text-neutral400 placeholder:text-sm placeholder:font-medium bg-opacity-30 px-3 outline-none hover:border-primaryvar3 text-sm font-semibold text-neutral300 focus-within:border-primaryvar3 bg-light400 border  rounded border-neutral500 appearance-none min-h-[4rem]',
        inputClass,
      ]"
      :placeholder="placeholder"
      :name="props.name"
      v-model="value"
      :id="id"
    ></textarea>
    <span v-if="errorMessage" class="text-xs px-1 font-medium text-red "
      >{{ errorMessage || "" }} &nbsp;
    </span>
  </div>
</template>
