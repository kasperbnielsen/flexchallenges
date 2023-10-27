<script setup lang="ts">
import items from "~/assets/items";
import spells from "~/assets/summonerSpells";
defineProps<{
  match: any;
}>();

function getSummonerSpell(id: number): string {
  let fullPath = "";
  spells.forEach((e) => {
    if (e.id === id) {
      fullPath = `https://raw.communitydragon.org/latest/game/data/spells/icons2d/${e.iconPath
        .substring(42, e.iconPath.length)
        .toLowerCase()}`;
    }
  });
  return fullPath;
}
</script>
<template>
  <div class="details">
    <p>asd</p>
  </div>
  <div class="users">
    <div
      :key="userIndex"
      class="users__div"
      v-for="(user, userIndex) of match.info.participants"
      :style="
        userIndex < 5 ? 'background-color: blue' : 'background-color: darkred'
      "
    >
      <img
        class="users__champion"
        :src="`https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-icons/${user.championId}.png`"
      />
      <div class="users__summonerSpells">
        <img
          class="users__summonerSpell"
          :src="getSummonerSpell(user.summoner1Id)"
        />
        <img
          class="users__summonerSpell"
          :src="getSummonerSpell(user.summoner2Id)"
        />
      </div>
      <p class="users__name">
        {{ user.summonerName }}
      </p>
      <p class="users__kda">
        {{ user.kills }} / {{ user.deaths }} / {{ user.assists }}
      </p>
    </div>
  </div>
</template>
<style scoped lang="scss">
.users {
  margin-right: 2rem;
  &__div {
    padding: 0.5rem;

    display: flex;
  }
  &__name {
    width: 12rem;
    margin-left: 1rem;
  }
  &__champion {
    width: 2rem;
    height: 2rem;
  }
  &__summonerSpells {
    display: flex;
    flex-direction: column;
  }
  &__summonerSpell {
    width: 1rem;
    height: 1rem;
  }
}

.details {
  margin-top: 0.5rem;
  margin-right: 2rem;
  margin-bottom: -1rem;
  background-color: darkgray;
  border-top-right-radius: 5px;
  border-top-left-radius: 5px;
}
</style>
