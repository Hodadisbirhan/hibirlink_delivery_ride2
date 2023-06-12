<script setup lang="ts">
import { useField } from "vee-validate";

interface Props {
  modelValue?: string | number;
  name: string;
  id?: string;
  type?: string;
  placeholder?: string;
  label?: string;
  labelClass?: string;
  hideDetail?: boolean;
  trailingIcon?: string | number | (string & {});
  autocomplete?: string;
  leadingIcon?: string | number | (string & {});
  leadingText?: string;
  min?: string;
  max?: string;
  rules?: string;
  disabled?: boolean;
  class?: string;
  iconLeadingClass?: string;
  leadingTextClass?: string;
  placeholderStyle?: string;
  clearable?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: "",
  type: "text",
  hideDetail: false,
  rules: "",
  disabled: false,
});

const emit = defineEmits(["update:modelValue"]);

const {
  errorMessage,
  value: inputValue,
  meta,
} = useField(props.name, props.rules, {
  initialValue: props.modelValue,
});

const type = ref(props.type);
const trailingIcon = ref(props.trailingIcon);

const set = (event: any) => {
  emit("update:modelValue", event?.target?.value);
};

const togglePassword = () => {
  if (type.value === "password") {
    type.value = "text";
    trailingIcon.value = "mdi:eye-off";
    return;
  }
  if (type.value === "text") {
    type.value = "password";
    trailingIcon.value = "mdi:eye";
    return;
  }
};

watch(
  () => props.modelValue,
  (newVal) => {
    inputValue.value = newVal;
  }
);

const clear = () => {
  inputValue.value = "";
  emit("update:modelValue", undefined);
};
</script>

<template>
  <div :class="props.class" class="w-full group">
    <label
      :class="props.class"
      class="text-neutral400 font-semibold group-hover:font-bold mb-1 text-sm"
      :for="name"
    >
      {{ label }}
    </label>
    <div
      class="relative group flex items-center justify-center transition-all ease-in-out duration-300"
      :class="props.class"
    >
      <div
        v-if="props.leadingIcon || props.leadingText"
        class="h-full px-2 absolute top-0 left-0 bottom-0 flex items-center justify-evenly pointer-events-none bg-transparent"
      >
        <Icon
          v-if="props.leadingIcon"
          :name="props.leadingIcon"
          class="h-5 w-5 mr-1 text-neutral400 group-hover:text-primary"
          :class="[props.iconLeadingClass]"
        />
        <p
          v-if="props.leadingText && !props.leadingIcon"
          class="font-semibold text-sm w-10 text-neutral400 group-hover:text-primary"
          :class="[props.leadingTextClass]"
        >
          {{ leadingText && $t(leadingText) }}
        </p>
        <div
          class="w-[1px] h-[60%] bg-neutral400 group-hover:bg-primary self-end my-auto group-hover:bg-green400 transition-all ease-in-out duration-300"
        ></div>
      </div>

      <input
        v-model="inputValue"
        @input="set($event)"
        @change="set($event)"
        :autocomplete="props.autocomplete"
        :min="min"
        :max="max"
        :type="type"
        :name="props.name"
        step="any"
        :id="props.name"
        :class="[
          // errorMessage
          //   ? // ? 'focus:border-red-500 hover:border-red border-red'
          //     ''
          //   : 'focus:border-primary hover:border-green400 border-neutral-500',
          props.iconLeadingClass ? props.iconLeadingClass : '',
          props.trailingIcon ? 'pr-0' : '',
          props.class ? props.class : '',
          props.placeholderStyle
            ? props.placeholderStyle
            : ' placeholder-neutral400 font-medium',
          props.leadingIcon ? 'pl-10' : '',
          props.leadingText ? 'pl-14' : '',
          props.trailingIcon ? 'pr-9' : '',
        ]"
        class="appearance-none text-sm bg-light400 bg-opacity-30 font-semibold text-neutral300 border border-neutral500 rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline focus:border-primary hover:border-primary transition-colors duration-300 ease-in-out"
        :placeholder="placeholder"
        aria-invalid="true"
        aria-describedby="email-error"
        :disabled="props.disabled"
      />
      <!-- icon -->
      <div
        v-if="clearable"
        @click="clear"
        class="absolute inset-y-0 right-0 pr-2 flex items-center"
      >
        <Icon
          name="heroicons:backspace-20-solid"
          class="h-5 w-5 text-neutral400 hover:text-red cursor-pointer transition-all ease-in-out duration-300"
        />
      </div>
      <div
        v-if="trailingIcon"
        class="absolute inset-y-0 right-0 pr-2 flex items-center hover:cursor-pointer"
        @click="props.type == 'password' ? togglePassword() : () => {}"
      >
        <Icon
          :name="trailingIcon"
          class="h-5 w-5 text-neutral400 hover:text-primary"
        />
      </div>
    </div>

    <p
      v-if="!props.hideDetail"
      :visible="errorMessage"
      class="px-1 text-xs font-medium text-red mb-1"
      id="email-error"
    >
      {{ errorMessage || "" }} &nbsp;
    </p>
  </div>
</template>
