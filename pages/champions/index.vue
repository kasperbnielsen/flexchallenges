<script setup lang="ts">
import { ref } from "vue";
import champions from "../../assets/champions";
const searchStr = ref("");
</script>
<template>
  <div class="top"></div>
  <div class="innerbody">
    <div class="champions">
      <input v-model="searchStr" class="champions__search" placeholder="Search for champion" />
      <div
        v-for="(champ, champIndex) of Object.entries(champions.champions).filter((e) =>
          e[0].toLowerCase().includes(searchStr.toLowerCase()),
        )"
        class="champions__icons"
        :key="champIndex"
      >
        <div class="champions__icons__div">
          <img
            class="champions__icons__img"
            :src="`https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-icons/${champ[1]}.png`"
          />
          <p class="champions__icons__name">{{ champ[0].substring(0, 7) }}</p>
        </div>
      </div>
    </div>
    <div class="list"></div>
  </div>
</template>
<style scoped lang="scss">
.top {
  height: 5rem;
  background-color: #3d3d3d;
  margin: 3rem 3rem 0 3rem;
  border-radius: 5px;
}
.innerbody {
  display: grid;
  grid-template-columns: 1fr 2fr;
  margin: 0;
  padding: 0 3rem;
}

.champions {
  background-color: #3d3d3d;
  height: fit-content;
  margin: 1rem 0.5rem 3rem 0;
  border-radius: 5px;
  padding: 2.125rem;
  &__search {
    margin-left: 3.125rem;
    margin-bottom: 1rem;
    padding: 0.5rem 2rem;
  }
  &__icons {
    display: inline-block;
    padding: 0.25rem;

    &__img {
      height: 4rem;
      width: 4rem;
    }
    &__div {
      display: inline;
    }
    &__name {
      font-size: 14px;
      text-align: center;
      margin: 0;
    }
  }
}

.list {
  background-color: #3d3d3d;
  height: 50rem;
  margin: 1rem 0 3rem 0.5rem;
  border-radius: 5px;
}
</style>
