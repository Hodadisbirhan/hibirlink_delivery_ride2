<template>
  <div
    class="fixed top-16 z-50 max-w-sm flex items-center rounded shadow-[0px_0px_24px_8px_rgba(120,120,120,0.2)] overflow-hidden bg-light400 transition-all ease-in-out duration-300"
    :class="[showNotification ? 'right-4' : '-right-full']"
  >
    <div class="px-4 py-2 flex-1">
      <h3
        class="font-bold text-md"
        :class="[success ? 'text-primary' : 'text-red']"
      >
        {{ success ? "Success" : "Error" }}
      </h3>
      <p class="line-clamp-3 pr-4 text-sm text-neutral-500">
        <slot v-if="!message"></slot>
        {{ message }}
      </p>
    </div>

    <div
      @click="onClose"
      :class="success ? 'bg-primary' : 'bg-red'"
      class="self-stretch flex items-center px-2 flex-shrink-0 cursor-pointer transition-colors duration-200 ease-in-out"
    >
      <Icon
        name="material-symbols:cancel-outline-rounded"
        class="rounded-tr-md rounded-bl-md w-6 h-6 text-light400 cursor-pointer shrink-0 transition-colors ease-in-out duration-300"
      />
    </div>
  </div>

  <!--  -->
</template>
<script setup lang="ts">
interface Props {
  message?: string;
  success?: boolean;
  modelValue?: boolean;
}

const emits = defineEmits(["close","update:modelValue"]);
const props = withDefaults(defineProps<Props>(), {
  success: false,
  
});

//const showNotification = ref(props.showNotification);

const showNotification = computed({

get:()=>{

  return props.modelValue;
},
set:(newValue)=>{

emits("update:modelValue",newValue);
}

})

watch(
  () => props.modelValue,
  (value) => {
    if (value) showNotificationMethod();
  }
);

const onClose = () => {
  showNotification.value = false;
  emits("close");
};

const showNotificationMethod = () => {
  showNotification.value = true;
  return setTimeout(() => {
    showNotification.value = false;
    emits("close");
  }, 6000);
};
</script>
