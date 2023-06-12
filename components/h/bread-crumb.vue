<template>
  <nav
    aria-label="breadcrumb"
    :class="
      breadCrumbClass ? breadCrumbClass : 'w-full px-4 py-1 text-neutral40'
    "
  >
    <ol class="flex h-8 space-x-2 items-center">
      <li v-if="showHomeIcon" class="flex items-center h-full">
        <p @click="() => {}" class="hover:underline h-full flex items-center">
          <Icon
            :name="homeIcon ? homeIcon : 'mdi:folder-home'"
            :class="
              homeIconClass
                ? homeIconClass
                : 'w-5 h-5 text-neutral400 cursor-pointer hover:text-primary hover:underline'
            "
          />
        </p>
      </li>
      <li
        v-for="key in _hashMap"
        :key="key[0]"
        class="flex items-center h-full"
      >
        <div class="flex gap-1 items-center h-full">
          <span class="text-neutral300">/</span>
          <p
            @click="() => handleClick(key[0])"
            :class="
              linkClass
                ? linkClass
                : 'px-1 capitalize hover:underline text-sm text-neutral300 hover:text-primary font-semibold cursor-pointer'
            "
          >
            {{ key[1] }}
          </p>
        </div>
      </li>
    </ol>
  </nav>
</template>

<script lang="ts" setup>
interface PropsInterface {
  showHomeIcon?: boolean;
  breadCrumbClass?: string;
  homeIcon?: string;
  homeIconClass?: string;
  linkClass?: string;
}
const hashMap = new Map<string, string>();
const _hashMap = ref(hashMap);

const route = useRoute();
const router = useRouter();
const props = withDefaults(defineProps<PropsInterface>(), {
  showHomeIcon: true,
});

const handleClick = (path: string) => {
  router.push(path);
};

const formHashMap = (fullPath: string) => {
  _hashMap.value.clear();
  const array = fullPath.split("/");
  const pathArray = array.splice(1, array.length);

  let key = "";
  pathArray.map((x) => {
    key += "/" + x;
    _hashMap.value.set(key, x);
  });
};
formHashMap(route.path);

watch(
  () => route.path,
  (currentPath: string) => {
    formHashMap(currentPath);
  }
);
</script>
