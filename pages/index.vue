<script setup lang="ts">
import { ref, watch } from "vue";
import champions from "../assets/champions";
import axios, { Axios, all, type AxiosResponse } from "axios";
import Multiselect from "@vueform/multiselect";

type Mastery = Array<{
  championId: number;
  championLevel: number;
  championPoints: number;
  championPointsSinceLastLevel: number;
  championPointsUntilNextLevel: number;
  chestGranted: boolean;
  lastPlayTime: number;
  puuid: string;
  summonerId: string;
  tokensEarned: number;
}>;

let value = ref<string[]>([]);
let optionsList = Object.keys(champions.regions);


type PlayerType = {
  player1: { name: string[]; assignedChamp: string[]; key: string[] };
  player2: { name: string[]; assignedChamp: string[]; key: string[] };
  player3: { name: string[]; assignedChamp: string[]; key: string[] };
  player4: { name: string[]; assignedChamp: string[]; key: string[] };
  player5: { name: string[]; assignedChamp: string[]; key: string[] };
};

type ResponseBody = {
  player1: number;
  player2: number;
  player3: number;
  player4: number;
  player5: number;
};

type RequestBody = {
  namesList: {
    player1: string;
    player2: string;
    player3: string;
    player4: string;
    player5: string;
  };
};

type Setting = {
  option1: boolean;
  option2: boolean;
  option3: boolean;

  players: {
    player1: string;
    player2: string;
    player3: string;
    player4: string;
    player5: string;
  };
};

let settings = ref<Setting>({
  option1: false,
  option2: false,
  option3: false,
  players: {
    player1: "Huez",
    player2: "IL0V3TH1SGAM3",
    player3: "Duke Camel",
    player4: "Knifedog",
    player5: "Jazyjewbag112",
  },
});

function encodeData(list: {}) {
  let stringified = JSON.stringify(list);

  const base64Filter = btoa(stringified);

  if (base64Filter.endsWith("=")) return base64Filter.replace(/=/g, "");

  return base64Filter;
}

let championList = ref<string[]>([]);
let assignedChampions = ref<string[]>([]);
let keys = ref<string[]>([]);
let myObject2 = ref<PlayerType>();

async function fetchData2(list: string[], regions: string[]) {
  console.log(encodeData({ list: list, regions: regions }))
  const data = await fetch("/api/riot/" + encodeData({ list: list, regions: regions }), {
    method: "get",
  }).then((res) => {
    return res.json();
  });

  myObject2.value = data;

  return data;
}
</script>

<template>
  <main class="main">
    <div>
      <div class="options">
        <button :class="{
          'options__button--selected': settings.option1,
        }" class="options__button" type="button" @click="settings.option1 = !settings.option1">
          Reaccuring
        </button>
        <button class="options__button" :class="{
          'options__button--selected': settings.option2,
        }" type="button" @click="settings.option2 = !settings.option2">
          <span v-if="settings.option2">Comps</span>
          <span v-else>Regions</span>
        </button>
        <Multiselect class="options__select" v-model="value" :options="optionsList" mode="tags" aria-label="sup"
          placeholder="Include regions" />
      </div>
      <form class="form" @submit.prevent="
        fetchData2([
          settings.players.player1,
          settings.players.player2,
          settings.players.player3,
          settings.players.player4,
          settings.players.player5,
        ], value)
        ">
        <label class="form__label" for="player1">Player 1</label>
        <input v-model.lazy="settings.players.player1" class="form__input" name="player1" />

        <label class="form__label" for="player2">Player 2</label>
        <input v-model.lazy="settings.players.player2" class="form__input" name="player2" />

        <label class="form__label" for="player3">Player 3</label>
        <input v-model.lazy="settings.players.player3" class="form__input" name="player3" />

        <label class="form__label" for="player4">Player 4</label>
        <input v-model.lazy="settings.players.player4" class="form__input" name="player4" />

        <label class="form__label" for="player5">Player 5</label>
        <input v-model.lazy="settings.players.player5" class="form__input" name="player5" />

        <button type="submit" class="form__button">Submit</button>
      </form>
    </div>
    <div class="result">
      <div v-for="(player, playerIndex) of myObject2" :key="playerIndex" :class="'result__div'">
        <p>{{ player.name }}</p>
        <p>{{ player.key ?? "not found" }}</p>
        <img :src="'https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-icons/' +
          player.assignedChamp +
          '.png'
          " :class="'result__div--image'" />
      </div>
    </div>
  </main>
</template>
<style scoped lang="scss">
.main {
  padding: 4rem 8rem;
  display: grid;
  grid-template-columns: 1.5fr 2.5fr;
  width: 100%;
  height: 100%;
  justify-content: center;
}

.result {
  &__button {
    &--image {}
  }
}

.result {
  display: flex;
  justify-content: center;

  &__name {
    color: green !important;
  }

  &__div {
    text-align: center;
    margin-left: 4rem;

    &--image {}
  }
}

.options {
  margin-bottom: 2rem;
  justify-content: center;

  &__select {
    height: 5rem;
    width: 20rem;
  }

  &__button {
    padding: 0.5rem 1.5rem;
    margin: 0 1rem;
    border: 3px solid black;

    &--selected {
      background-color: grey;
    }
  }
}

.form {
  display: flex;
  flex-direction: column;
  justify-content: center;

  &__label {
    font-weight: 600;
  }

  &__button {
    border: none;
    background: none;
    padding: 1rem 2rem;
    font-size: 1.125rem;
    font-weight: 500;
    border: 2px solid black;
    border-radius: 5px;

    &:hover {
      background: black;
      color: white;
    }
  }

  &__input {
    margin-bottom: 2rem;
    padding: 1rem 2rem;
    border: 2px solid grey;
    border-radius: 5px;

    &--error {}

    &:focus {}
  }
}
</style>
<style src="@vueform/multiselect/themes/default.css"></style>
