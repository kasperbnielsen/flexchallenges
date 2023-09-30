<script setup lang="ts">
import { ref } from "vue";
import Multiselect from "@vueform/multiselect";
import champions from "../assets/champions";

const value = ref<string[]>([]);
const value2 = ref<string[]>([]);
const optionsList = Object.keys(champions.regions);
const optionsList2 = Object.keys(champions.teamComps);
const dropdown = ref(false);

type PlayerType = {
  players: {
    player1: { name: string; assignedChamp: string; key: string };
    player2: { name: string; assignedChamp: string; key: string };
    player3: { name: string; assignedChamp: string; key: string };
    player4: { name: string; assignedChamp: string; key: string };
    player5: { name: string; assignedChamp: string; key: string };
  };
  region: string;
};

const item = ref<boolean[]>([
  false,
  false,
  false,
  false,
  false,
  false,
  false,
  false,
  false,
  false,
  false,
  false,
  false,
]);

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

const settings = ref<Setting>({
  option1: false,
  option2: false,
  option3: false,
  players: {
    player1: "",
    player2: "",
    player3: "",
    player4: "",
    player5: "",
  },
});

function encodeData(list: {}) {
  const stringified = JSON.stringify(list);

  const base64Filter = btoa(stringified);

  if (base64Filter.endsWith("=")) return base64Filter.replace(/=/g, "");

  return base64Filter;
}

const myObject2 = ref<PlayerType>();

function refreshChampion(index: string) {
  const player = myObject2.value?.players;
  console.log("index ", index);
  if (myObject2.value !== undefined) {
    const newChampion = myObject2.value.region;
    const tempArr: (typeof champions.champions.Aatrox)[] = [];
    const championArr = settings.value.option2
      ? champions.teamComps[newChampion[0] as keyof typeof champions.teamComps]
      : champions.regions[newChampion[0] as keyof typeof champions.regions];
    championArr.forEach((element) => {
      if (
        element.toString() !== player?.player1.key.toString() &&
        element.toString() !== player?.player2.key.toString() &&
        element.toString() !== player?.player3.key.toString() &&
        element.toString() !== player?.player4.key.toString() &&
        element.toString() !== player?.player5.key.toString()
      ) {
        tempArr.push(element);
      }
    });
    const i: number = parseInt(index.slice(-1));
    const random = Math.floor(Math.random() * tempArr.length);
    myObject2.value.players[`player${i}`].key = tempArr[random];
    myObject2.value.players[`player${i}`].assignedChamp =
      champions.champions[tempArr[random] as keyof typeof champions.champions];
  }
}

async function fetchData2() {
  const list = Object.values(settings.value.players);
  const newList: string[] = [];
  const newList2: string[] = [];
  let isRegions = true;
  const count = !settings.value.option2 ? 13 : 11;
  for (let i = 0; i < count; i++) {
    if (!item.value[i]) {
      if (!settings.value.option2) {
        newList.push(Object.keys(champions.regions)[i]);
      } else {
        newList2.push(Object.keys(champions.teamComps)[i]);
      }
    }
  }
  let options;
  if (settings.value.option2) {
    options = newList2;
    isRegions = false;
  } else {
    isRegions = true;
    options = newList;
  }
  const data = await fetch(
    `/api/riot/${encodeData({ list, options, isRegions })}`,
    {
      method: "get",
    }
  ).then((res) => res.json());

  myObject2.value = data;

  return data;
}
</script>

<template>
  <main class="main">
    <div>
      <div class="options">
        <button
          class="options__button"
          :class="{
            'options__button--selected': settings.option1,
            'options__button--notselected': !settings.option1,
          }"
          type="button"
          @click="settings.option1 = !settings.option1"
        >
          Reaccuring
        </button>
        <button
          class="options__button options__button--nomargright btn btn-secondary"
          type="button"
          @click="settings.option2 = !settings.option2"
        >
          <span v-if="settings.option2">Comps</span>
          <span v-else>Regions</span>
        </button>
        <div v-if="!settings.option2" class="dropdown">
          <button
            id="dropdownMenuClickableInside"
            aria-expanded="false"
            class="dropdown-toggle btn btn-secondary selectdiv__button"
            data-bs-auto-close="outside"
            data-bs-toggle="dropdown"
            type="button"
            @click="dropdown = !dropdown"
          >
            Include regions
          </button>
          <ul
            aria-labelledby="dropdownMenuClickableInside"
            class="dropdown-menu dropdown__menu"
          >
            <div
              v-for="(element, elementindex) of Object.keys(champions.regions)"
              :key="elementindex"
            >
              <li v-if="item[elementindex]" @click="item[elementindex] = false">
                <span class="dropdown-item">{{ element }}</span>
              </li>
              <li v-else @click="item[elementindex] = true">
                <span class="active dropdown-item">{{ element }}</span>
              </li>
            </div>
          </ul>
        </div>
        <div v-else class="dropdown">
          <button
            id="dropdownMenuClickableInside"
            aria-expanded="false"
            class="dropdown-toggle btn btn-secondary selectdiv__button"
            data-bs-auto-close="outside"
            data-bs-toggle="dropdown"
            type="button"
            @click="dropdown = !dropdown"
          >
            Include comps
          </button>
          <ul
            aria-labelledby="dropdownMenuClickableInside"
            class="dropdown-menu dropdown__menu"
          >
            <div
              v-for="(element, elementindex) of Object.keys(
                champions.teamComps
              )"
              :key="elementindex"
            >
              <li v-if="item[elementindex]" @click="item[elementindex] = false">
                <span class="dropdown-item">{{ element }}</span>
              </li>
              <li v-else @click="item[elementindex] = true">
                <span class="active dropdown-item">{{ element }}</span>
              </li>
            </div>
          </ul>
        </div>
      </div>
      <form class="form" @submit.prevent="fetchData2()">
        <label class="form__label" for="player1">Player 1</label>
        <input
          v-model.lazy="settings.players.player1"
          class="form__input"
          name="player1"
        />

        <label class="form__label" for="player2">Player 2</label>
        <input
          v-model.lazy="settings.players.player2"
          class="form__input"
          name="player2"
        />

        <label class="form__label" for="player3">Player 3</label>
        <input
          v-model.lazy="settings.players.player3"
          class="form__input"
          name="player3"
        />

        <label class="form__label" for="player4">Player 4</label>
        <input
          v-model.lazy="settings.players.player4"
          class="form__input"
          name="player4"
        />

        <label class="form__label" for="player5">Player 5</label>
        <input
          v-model.lazy="settings.players.player5"
          class="form__input"
          name="player5"
        />

        <button class="form__button" type="submit">Submit</button>
      </form>
    </div>
    <div class="result">
      <div
        v-for="(player, playerIndex) of myObject2?.players"
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
            @click="refreshChampion(playerIndex)"
          >
            <font-awesome-icon
              class="result__div__div__button__refresh"
              :icon="['fas', 'rotate-right']"
            />
          </button>
        </div>
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

.selectdiv {
  display: block;
  &__button {
    width: 15rem;
    height: 5rem;
    margin-left: 1rem;
    border-left: 1px solid black;
  }
  &__select {
    position: absolute;
    width: 15rem;
  }
}

.dropdown {
  &__menu {
    width: 15rem;
  }
}

.result {
  display: flex;
  flex-direction: column;
  margin-top: 8.125rem;

  &__name {
    color: green !important;
  }

  &__div {
    margin-left: 4rem;

    &__div {
      margin-left: -4rem;
      display: flex;
      margin-bottom: 2.375rem;

      &__image {
        margin-left: 1.25rem;
        width: 5rem;
      }

      &__button {
        border: none;
        background: none;

        &__refresh {
          color: white;
          width: 1rem;
          height: auto;
          margin-left: 0.5rem;
        }
      }
    }
  }
}

.options {
  display: flex;
  margin-bottom: 2rem;
  justify-content: center;

  &__select {
    height: 5rem;
    width: 20rem;
    padding: 0.5rem 1.5rem;
    margin: 0 1rem;
    border: 3px solid black;
    color: black;
  }

  &__button {
    color: black;
    padding: 0.5rem 1.5rem;
    margin: 0 1rem;
    width: 10rem;

    &--nomargright {
      margin-right: -1.125rem;
    }

    &--notselected {
      background-color: green;
    }

    &--selected {
      background-color: red;
    }
  }
}

span {
  color: black;
}

.form {
  display: flex;
  flex-direction: column;
  justify-content: center;

  &__label {
    font-weight: 600;
    color: white;
  }

  &__button {
    border: none;
    background: none;
    padding: 1rem 2rem;
    font-size: 1.125rem;
    font-weight: 500;
    border: 2px solid black;
    border-radius: 5px;
    color: white;

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

    &--error {
    }

    &:focus {
    }
  }
}
</style>
<style src="@vueform/multiselect/themes/default.css"></style>
