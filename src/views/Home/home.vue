<template>
  <h2>{{ langConfig.home.internationTip[lang] }}</h2>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { langConfig } from "@/utils/constant/config";
import { useStore } from "@/store/index";
const store = useStore();
const lang = computed((): string => store.getters["settingsModule/getLangState"]);
</script>
