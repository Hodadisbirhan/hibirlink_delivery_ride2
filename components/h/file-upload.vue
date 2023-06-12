<script setup lang="ts">
import { useField } from "vee-validate";

interface FileInterface {
  name: any;
  base64: any;
  size: any;
  type: any;
  preview: any;
}

const emits = defineEmits([
  "getFile",
  "exceed:limit",
  "exceed:size",
  "update:modelValue",
]);

const props = defineProps({
  accept: {
    type: String,
    default: "",
  },
  rules: {
    type: String,
  },
  limit: { type: Number, default: 4 },
  size: { type: String, default: "20 MB" },
  id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  text: { type: String },

  preview: {
    type: Boolean,
    default: true,
  },
  class: String,
  isCleared: {
    type: Boolean,
    default: false,
  },
  modelValue: {
    type: [String, Object, Array],
  },
});
const { value, errorMessage: fileError } = useField(props.name, props.rules, {
  initialValue: props.modelValue,
});

const file = ref(value.value || new Array<FileInterface>());
const sizes = ["BYTES", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

const formatBytes = (bytes: any, decimals: any = 2) => {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
};

const sizesValidation = (value: any) => {
  if (props.size !== " ") {
    const unitSelected = value.toString().split(" ")[1];

    const unitLimit = props.size.toString().split(" ")[1];

    const selected_value = value.toString().split(" ")[0];
    const limit_value = props.size.toString().split(" ")[0];
    const indexSelected = sizes.indexOf(unitSelected.toString().toUpperCase());
    const limit_Size_index = sizes.indexOf(unitLimit.toString().toUpperCase());
    // console.log("indexS", indexSelected);
    // console.log("hhh", limit_Size_index);

    if (indexSelected > limit_Size_index) {
      return false;
    } else if (
      indexSelected === limit_Size_index &&
      selected_value > limit_value
    ) {
      return false;
    }
  }
  return true;
};

const clearComputed = computed(() => {
  return props.isCleared;
});

watch(clearComputed, (newValue) => {
  if (newValue) {
    file.value = [];
    value.value = undefined;
  }
});

const readFile = (file_to: any) => {
  return new Promise((resolve, reject) => {
    const file_reader = new FileReader();
    console.log(file_to);
    file_reader.onload = () => {
      resolve(file_reader.result);
      console.log(file_reader.result);
      file.value.push({
        preview: file_reader.result?.toString(),
        base64: file_reader.result?.toString().split(",")[1],
        size: formatBytes(file_to.size),
        type: file_to.type,
        name: file_to.name,
      });
    };

    file_reader.readAsDataURL(file_to);
  });
};

const drop_and_click = async (files: any) => {
  file.value = [];

  await Promise.all(
    [...files].map((f) => {
      if (f && sizesValidation(formatBytes(f.size))) {
        return readFile(f);
      } else {
        emits("exceed:size", props.size);
      }
    })
  );
  value.value = file.value;
};

const drop = async (event: any) => {
  file.value = [];
  if (event.dataTransfer.files.length > 0)
    try {
      // console.log(event.dataTransfer.files[0].type);
      if (props.limit >= event.dataTransfer.files.length) {
        event = [...event.dataTransfer.files].slice(
          0,
          event.dataTransfer.files.length >= props.limit
            ? props.limit
            : event.dataTransfer.files.length
        );
        event = [...event].filter((value: any) => {
          return (value.type + "").includes(props.accept.split("*")[0]);
        });
        await drop_and_click(event);
        emits("getFile", file.value);
        emits("update:modelValue", file.value);
      } else {
        emits("exceed:limit", event.dataTransfer.files.length);
      }
    } catch (e) {
      emits("getFile", file.value);
    }
};

const change = async (event: any) => {
  if (event.target.files.length > 0)
    try {
      if (event.target.files.length <= props.limit) {
        await drop_and_click(
          [...event.target.files].slice(
            0,
            event.target.files.length >= props.limit
              ? props.limit
              : event.target.files.length
          )
        );
        emits("getFile", file.value);
        emits("update:modelValue", file.value);
      } else {
        emits("exceed:limit", event.target.files.length);
      }
    } catch (e) {
      emits("getFile", file.value);
    }
};

const delete_file = (index: number) => {
  file.value = file.value.filter((value: any, i: number) => {
    // if (index === i && value.type.toString().includes("image")) {
    //   if (i < file.value.length - 1) {
    //   } else if (i === file.value.length - 1 && i !== 0) {
    //   }
    // }
    return index !== i;
  });
  emits("getFile", file.value);
  emits("update:modelValue", file.value);
  value.value = file.value;
};
</script>

<template>
  <h-drag-and-drop
    :class="props.class"
    class="min-h-[13rem] relative py-2 border-dashed border-[3px] rounded-md border-primary/40 hover:border-primaryvar2"
  >
    <template #default>
      <!-- <div v-if="file && file.length >= 1">
        <video width="300" height="200" controls autoplay v-for="fil in file">
          <source :src="fil.preview" alt="show" type="video/mp4" />
        </video>
      </div> -->

      <div
        @drop.prevent="drop"
        class="w-[100%] flex min-h-[13rem] flex-col justify-center items-center gap-2"
      >
        <div
          v-if="preview && file.length > 0 && limit > 1"
          class="flex gap-3 w-full h-[11rem] overflow-x-auto px-7 border-b border-b-green300/30"
        >
          <div
            class="relative flex flex-col pr-[0.2px] bg-white w-[13rem] rounded-lg min-w-[13rem] min-h-[10rem] h-fit"
            v-for="(item_file, index) in file"
            :key="item_file.name"
          >
            <div
              class="flex flex-col h-[10rem] gap-1 group"
              v-if="item_file.type.includes('image')"
            >
              <nuxt-img
                format="webp"
                quality="100"
                :src="item_file.preview"
                :accept="props.accept"
                class="object-cover w-full aspect-square rounded-md h-[10rem] object-center"
              />
              <div
                class="absolute opacity-90 z-20 flex justify-between items-end -bottom-1 px-2 py-1 left-0 w-full text-light bg-gradient-to-tr from-primaryvar2 to-transparent invisible group-hover:visible"
              >
                <div class="flex w-[6rem] flex-col justify-center">
                  <span class="text-sm font-semibold line-clamp-1">{{
                    item_file.name
                  }}</span>
                  <span class="text-sm font-semibold line-clamp-1">
                    {{ item_file.size }}</span
                  >
                </div>
              </div>
            </div>

            <div v-else-if="item_file.type.includes('video')">
              <video class="w-[100%] h-full" controls>
                <source :src="item_file.preview" :alt="item_file.name" />
              </video>
            </div>
            <div class="flex flex-col gap-1 h-[8rem] px-2" v-else>
              <Icon name="uil:file" class="w-20 text-primary h-16" />
              <span class="text-sm font-medium line-clamp-1">{{
                item_file.name
              }}</span>
              <span class="text-sm line-clamp-1">{{ item_file.size }}</span>
            </div>

            <div
              v-if="limit > 1"
              class="bg-light400 rounded-[100%] flex items-center cursor-pointer justify-center absolute w-6 h-6 top-0 right-1"
              @click="limit > 1 ? delete_file(index) : null"
            >
              <Icon name="uil:trash-alt" class="w-6 h-6 text-red" />
            </div>
          </div>
        </div>

        <input
          type="file"
          @change="change"
          :multiple="limit > 1"
          class="hidden"
          :id="id"
          :name="props.id"
          :accept="props.accept"
        />
        <div class="flex flex-col w-full gap-0 items-center justify-center">
          <label
            v-if="typeof file === 'string'"
            :for="props.id"
            class="cursor-pointer w-full"
          >
            <nuxt-img
              format="webp"
              quality="100"
              :src="file"
              :accept="props.accept"
              class="object-contain w-full aspect-square rounded-md h-[10rem] object-center"
            />
          </label>
          <div
            v-if="typeof file !== 'string' && (limit !== 1 || file.length < 1)"
            class="flex flex-col w-full gap-0 items-center justify-center"
          >
            <Icon name="uil:cloud-upload" class="text-primary w-10 h-10" />
            <span class="text-sm text-green300 py-2"
              >{{ $t("drag_drop") }}
              <label
                :for="id"
                class="text-sm font-semibold px-2 text-primaryvar1 cursor-pointer"
                >{{ $t("browse") }}</label
              >
              {{ $t("your") }} {{ $t("files") }}
            </span>
            <span class="text-sm w-full text-center text-gray-light"
              >{{ $t("image_size_constraint") }} {{ props.size }} ! <br />
              {{ $t("files_limit") }} {{ props.limit }} {{ $t("files") }}</span
            >
          </div>

          <div
            v-else-if="typeof file !== 'string'"
            class="w-full cursor-pointer"
          >
            <div v-for="(item_file, index) in file" class="w-full">
              <label
                :for="props.id"
                class="flex flex-col h-full gap-1 group"
                v-if="item_file.type.includes('image')"
              >
                <nuxt-img
                  format="webp"
                  quality="100"
                  :src="item_file.preview"
                  :accept="props.accept"
                  class="object-contain w-full aspect-square rounded-md h-[10rem] object-center"
                />
              </label>
              <div v-else-if="item_file.type.includes('video')">
                <video class="w-full h-full" controls>
                  <source :src="item_file.preview" :alt="item_file.name" />
                </video>
              </div>

              <div class="flex flex-col gap-1 h-[8rem] px-2" v-else>
                <Icon name="uil:file" class="w-20 h-16" />
                <span class="text-sm line-clamp-1">{{ item_file.name }}</span>
                <span class="text-sm line-clamp-1">{{ item_file.size }}</span>
              </div>

              <div
                v-if="limit > 1"
                class="bg-light400 rounded-[100%] flex items-center cursor-pointer justify-center absolute w-6 h-6 top-0 right-1"
              >
                <Icon name="uil:trash-alt" class="w-6 h-6 text-red" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <p
        :visible="fileError"
        class="px-1 text-sm absolute -bottom-6 left-0 text-red font-body"
        id="email-error"
      >
        {{ fileError || "" }} &nbsp;
      </p>
    </template>
  </h-drag-and-drop>
</template>
