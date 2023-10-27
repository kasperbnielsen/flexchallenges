<script setup lang="ts">
import Match from "./Match.vue";
defineProps<{
  matchList: Array<any>;
  user: { name: string; puuid: string };
  region: string;
  winArr: Array<boolean>;
}>();
</script>
<template>
  <div>
    <Match
      v-for="(match, matchIndex) of matchList"
      :key="matchIndex"
      :match="match"
      :user="user"
      :region="region"
      :win="winArr[matchIndex]"
    />
  </div>
</template>
<style scoped lang="scss">
.showmore {
  &__icon {
    color: black;
  }
  width: 50rem;
  margin-bottom: -2rem;
  background-color: #3d3d3d;
  border: none;
  margin-top: 1rem;
}
</style>
