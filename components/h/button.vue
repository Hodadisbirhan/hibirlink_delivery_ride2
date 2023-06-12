<template>
  <div>
    <button
      :type="type"
      :disabled="props.isLoading"
      :class="[
        props.gradient && !props.outlined
          ? 'bg-gradient-to-r from-primaryvar1 to-primary'
          : '',
        props.isLoading ? 'cursor-default' : 'cursor-pointer',
        props.outlined
          ? props.outlinedClass
            ? props.outlinedClass
            : 'bg-transparent border-2 border-primary hover:border-primaryvar1 text-primary hover:text-primaryvar1'
          : props.btnClass
          ? props.btnClass
          : 'bg-primary hover:bg-primaryvar1 text-light400  ',
        props.rounded
          ? props.roundedClass
            ? props.roundedClass
            : 'rounded-full'
          : '',
      ]"
      class="h-8 w-full hover:shadow-md shadow-current font-semibold focus:outline-none focus:shadow-outline transition-all duration-300 ease-in-out"
    >
      <div
        class="relative flex justify-center items-center gap-1 text-sm h-full"
      >
        <Icon
          v-if="props.isLoading"
          name="svg-spinners:dot-revolve"
          class="w-5 h-5 text-light300"
        />

        <div
          v-if="props.leadingIcon"
          class="w-8 h-full flex items-center justify-center"
          :class="[
            props.isLoading ? 'invisible' : '',
            props.leadingIconClass
              ? props.leadingIconClass
              : ' text-current bg-inherent',
            props.rounded
              ? props.roundedClass
                ? props.roundedClass.replace('-', '-l-')
                : 'rounded-l-full'
              : '',
            props.outlined ? '-ml-[0.5px]' : '',
          ]"
        >
          <Icon
            class="w-[1.25rem] h-[1.25rem] text-inherit"
            :name="props.leadingIcon"
          />
        </div>

        <p
          :class="[
            props.isLoading ? 'invisible' : '',
            props.btnNameClass
              ? props.btnNameClass
              : 'text-sm bg-inherit h-full flex items-center justify-center',
            props.leadingIcon && !props.trailingIcon ? 'pr-3' : '',
            !props.leadingIcon && props.trailingIcon ? 'pl-3' : '',
            !props.leadingIcon && !props.trailingIcon ? 'px-3' : '',
          ]"
        >
          {{ $t(props.btnName) }}
        </p>

        <div
          v-if="props.trailingIcon"
          class="w-8 h-full flex items-center justify-center"
          :class="[
            props.isLoading ? 'invisible' : '',
            props.trailingIconClass
              ? props.trailingIconClass
              : ' text-current bg-inherent',
            props.rounded
              ? props.roundedClass
                ? props.roundedClass.replace('-', '-r-')
                : 'rounded-r-full'
              : '',
            props.outlined ? '-mr-[0.5px]' : '',
          ]"
        >
          <Icon
            class="w-[1.25rem] h-[1.25rem] text-inherit"
            :name="props.trailingIcon"
          />
        </div>
      </div>
    </button>
  </div>
</template>

<script setup lang="ts">
interface PropsInterface {
  btnName: string;
  btnNameClass?: string;
  btnClass?: string;
  isLoading?: boolean;
  loadingText?: string;
  loadingTextClass?: string;
  type: "button" | "submit" | "reset";
  leadingIcon?: string;
  leadingIconClass?: string;
  trailingIcon?: string;
  trailingIconClass?: string;
  rounded?: boolean;
  roundedClass?: string;
  outlined?: boolean;
  outlinedClass?: string;
  gradient?: boolean;
  gradientClass?: string;
}

const props = withDefaults(defineProps<PropsInterface>(), {
  rounded: true,
  gradient: true,
  loadingText: "Loading...",
});
</script>
