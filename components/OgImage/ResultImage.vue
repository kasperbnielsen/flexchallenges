<script lang="ts" setup>
import { PropType } from "vue";
import { storeToRefs } from "pinia";
import { useModeStore } from "@/stores/mode";

type PlayerType = {
  players: {
    player1: { name: string; assignedChamp: string; key: string };
    player2: { name: string; assignedChamp: string; key: string };
    player3: { name: string; assignedChamp: string; key: string };
    player4: { name: string; assignedChamp: string; key: string };
    player5: { name: string; assignedChamp: string; key: string };
  };
  region: string;
  order: number[];
  pointsList: number[];
  levelList: number[];
};

const props = defineProps({
  myObject2: { type: Object as PropType<PlayerType>, required: true },
  showRoles: Boolean,
});
const role: string[] = [
  "bot_challenger.png",
  "support_challenger.png",
  "jungle_challenger.png",
  "middle_challenger.png",
  "top_challenger.png",
];

const { mode } = storeToRefs(useModeStore());

defineOptions({
  inheritAttrs: false,
});
</script>
<template>
  <div ref="resultReference" class="result">
    <div
      v-for="(player, playerIndex, index) of myObject2.players"
      :key="playerIndex"
      class="result__div"
    >
      <div class="result__div__div">
        <img
          :id="player.key.toString()"
          class="result__div__div__image"
          :src="
            'https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-icons/' +
            player.assignedChamp +
            '.png'
          "
        />
        <button
          :id="player.key.toString() + 'button'"
          class="result__div__div__button"
        >
          <font-awesome-icon
            class="result__div__div__button__refresh"
            :icon="['fas', 'rotate-right']"
          />
        </button>
        <div class="result__div__div__player">
          <p>{{ player.name }}</p>
        </div>
        <div class="result__div__div__mastery">
          <img
            class="result__div__div__mastery__img"
            :src="`mastery${myObject2.levelList[index] ?? 0}.png`"
          />
          <p>{{ myObject2.pointsList[index] }}</p>
        </div>
        <div>
          <img
            v-if="mode && showRoles && role"
            class="result__div__div__role"
            :src="role[myObject2.order[index]]"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
.result {
  display: flex;
  flex-direction: column;
  margin-top: 1rem;
  margin-left: 2rem;
  text-align: center;

  &__name {
    color: green !important;
  }

  &__div {
    margin-left: 4rem;
    &__div {
      margin-left: -4rem;
      padding-top: 1.1875rem;
      padding-bottom: 1.1875rem;
      margin-bottom: 1.1875rem;
      padding-right: 10rem;
      background-color: #0a323c;
      border: 5px solid #c89b3c;

      display: grid;
      grid-template-columns: 1fr 1fr 5fr 1fr 1fr;

      &__role {
        width: 2rem;
        margin-right: -22rem;
      }

      &__image {
        margin-left: 1.25rem;
        width: 5rem;
        border: 1px solid #c8aa6e;
      }

      &__mastery {
        position: absolute;
        margin-left: 20rem;
        margin-top: -1rem;
        color: #c8aa6e;
        font-weight: 700;
        &__img {
          width: 5rem;
          height: 5rem;
        }
      }

      &__player {
        margin-left: 2rem;
        margin-top: 1.5rem;
        font-weight: 700;
        text-transform: capitalize;
        color: #c8aa6e;
      }

      &__button {
        border: none;
        background: none;

        &__refresh {
          color: #c8aa6e;
          width: 1rem;
          height: auto;
          margin-left: 0.5rem;
        }
      }
    }
  }
}
</style>
