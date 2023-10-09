<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { useModeStore } from "@/stores/mode";
const { dataObject, showRolesRef } = storeToRefs(useModeStore());

const ogImageOptions = {
  component: "ResultImage",
  myObject2: dataObject.value,
  showRoles: showRolesRef.value,
};
</script>
<template>
  <OgImage v-bind="ogImageOptions" />
</template>
<style lang="scss" scoped></style>
