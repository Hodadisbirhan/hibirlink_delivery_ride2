<template>
  <div
    v-if="_showDialog"
    class="fixed z-50 top-0 left-0 min-h-screen w-full bg-neutral100 bg-opacity-20"
  >
    <div
      class="min-h-screen w-full flex items-center justify-center bg-neutral100 bg-opacity-20"
    >
      <div
        ref="target"
        :class="[
          'relative flex flex-col gap-2 p-6 rounded-md shadow-custom bg-light400 text-neutral-500',
          props.class,
        ]"
      >
        <Icon
          @click="($event) => $emit('update:modelValue', false)"
          v-if="!hideClosIcon"
          name="ion:close-outline"
          class="absolute right-1.5 top-1.5 rounded-tr-md rounded-bl-md w-8 h-8 text-neutral300 hover:text-dark200 cursor-pointer shrink-0 transition-colors ease-in-out duration-300"
        />
        <h2
          :class="[
            props.titleClass
              ? props.titleClass
              : 'text-primary font-bold text-xl',
          ]"
          class="flex items-center gap-2 text-sm font-semibold leading-tight tracking-wide"
        >
          <Icon
            v-if="props.titleLeadingIcon"
            :class="
              props.titleLeadingIconClass
                ? props.titleLeadingIconClass
                : 'w-5 h-5 fill-current shrink-0'
            "
            :name="props.titleLeadingIcon"
          />
          {{ $t(title) }}
        </h2>
        <p
          v-if="content"
          :class="contentClass ? contentClass : 'flex-1 text-sm'"
        >
          {{ $t(content) }}
        </p>

        <form @submit.prevent="handleFormSubmit">
          <slot name="content"></slot>
        </form>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onClickOutside } from "@vueuse/core";
import { valueFromAST } from "graphql";
import { useForm } from "vee-validate";
interface PropsInterface {
  title: string;
  titleClass?: string;
  titleLeadingIcon?: string;
  titleLeadingIconClass?: string;
  content?: string;
  contentClass?: string;
  modelValue: boolean;
  hideClosIcon?: boolean;
  setValue?: object | any;
  class?: String;
}

const props = withDefaults(defineProps<PropsInterface>(), {
  modelValue: false,
});

const emits = defineEmits(["close", "formSubmit", "update:modelValue"]);
const _showDialog = computed(() => props.modelValue);

const target = ref(null);

onClickOutside(target, ($event) => emits("update:modelValue", false));

const { resetForm, handleSubmit, setValues } = useForm();

const handleFormSubmit = handleSubmit(
  (value) => {
    emits("formSubmit", value);
  },
  (error) => {
    console.log(error);
  }
);

watch(
  () => props.setValue,
  (newValue) => {
    console.log(newValue);
    setValues(newValue);
  }
);
</script>
