<script setup lang="ts">
import { ref, watch } from "vue";
import champions from "../assets/champions";
import axios, { Axios, all, type AxiosResponse } from "axios";

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
    player2: "Bøgvad",
    player3: "Duke Camel",
    player4: "Knifedog",
    player5: "Jazyjewbag112",
  },
});

let players = ref<Mastery[]>([]);

function submitForm() {
  let assignedChampions = [0, 0, 0, 0, 0];
  let temp = settings.value.players;
  let namesList = [
    temp.player1,
    temp.player2,
    temp.player3,
    temp.player4,
    temp.player5,
  ];
  namesList.forEach(async (player, i) => {
    const fetchedData = await fetch("/api/riot/" + player, {
      method: "get",
    }).then((res) => {
      return res;
    });
    let pointData: Mastery = await fetchedData.json();
    players.value.push(pointData);
  });

  let random = Math.random() * champions.regions.length;
  let region = champions.regions[Math.floor(random)].slice(0);
  let championList: string[] = [];
  namesList.forEach((element) => {
    let tempVal = Math.floor(Math.random() * region.length);
    championList.push(region[tempVal]);
    region.splice(tempVal, 1);
  });

  let keys: string[] = [];

  championList.forEach((element) => {
    keys.push(
      champions.champions.data[element as keyof typeof champions.champions.data]
        .key
    );
  });

  let points: Array<Array<number>> = [];
  for (let x = 0; x < 5; x++) {
    let championPoints = [0, 0, 0, 0, 0];
    for (let i = 0; i < keys.length; i++) {
      for (let j = 0; j < players.value[x]?.length; j++) {
        if (players.value[x][j].championId == +keys[i]) {
          championPoints[i] = players.value[x][j].championPoints;
          break;
        }
      }
    }
    points[x] = championPoints;
  }

  for (let i = 0; i < 5; i++) {
    let index = getHighest(points);
    assignedChampions[index] = points[index].findIndex(
      (element) => element == getMax(points[index])
    );
    console.log(assignedChampions[index]);
    points[index] = [0, 0, 0, 0, 0];
    points.forEach((e) => {
      e[assignedChampions[index]] = 0;
    });
  }

  namesList.forEach((element, i) => {
    console.log(element, championList[assignedChampions[i]]);
  });

  let resultdiv = document.querySelector(".result");

  if (
    resultdiv?.childElementCount != null &&
    resultdiv.childElementCount <= 1
  ) {
    namesList.forEach((element, i) => {
      let div = document.createElement("div");
      let name = document.createElement("p");
      let champ = document.createElement("p");
      let image = document.createElement("img");
      image.setAttribute(
        "src",
        "https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-icons/" +
          keys[assignedChampions[i]] +
          ".png"
      );
      name.innerHTML = element;
      champ.innerHTML = championList[assignedChampions[i]];
      div.setAttribute("style", "margin-left: 2rem");
      div.setAttribute("class", "result__div");
      div.appendChild(name);
      div.appendChild(champ);
      div.appendChild(image);
      resultdiv?.appendChild(div);
    });
  } else {
    let divs = document.querySelectorAll(".result__div");
    divs.forEach((element) => {
      element.remove();
    });
    namesList.forEach((element, i) => {
      let div = document.createElement("div");
      let name = document.createElement("p");
      let champ = document.createElement("p");
      let image = document.createElement("img");
      image.setAttribute(
        "src",
        "https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-icons/" +
          keys[assignedChampions[i]] +
          ".png"
      );
      name.innerHTML = element;
      champ.innerHTML = championList[assignedChampions[i]];
      div.setAttribute("style", "margin-left: 2rem");
      div.setAttribute("class", "result__div");
      div.appendChild(name);
      div.appendChild(champ);
      div.appendChild(image);
      resultdiv?.appendChild(div);
    });
  }
}

function getMax(arr: number[]) {
  let tempMax = 0;
  let index = 0;
  console.log(arr);
  arr.forEach((element, i) => {
    if (element > tempMax) {
      index = i;
      tempMax = element;
    }
  });
  return tempMax;
}

function getHighest(points: number[][]) {
  let maximum = 0;
  let index = 0;
  points.forEach((element, i) => {
    let temp = getMax(element);
    console.log("max =" + temp);
    if (maximum < temp) {
      maximum = temp;
      index = i;
    }
  });
  console.log("hieghest = " + maximum);
  return index;
}
</script>

<template>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link
    href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap"
    rel="stylesheet"
  />

  <main class="main">
    <div>
      <div class="options">
        <button
          :class="{
            'options__button--selected': settings.option1,
          }"
          class="options__button"
          type="button"
          @click="settings.option1 = !settings.option1"
        >
          Option 1
        </button>
        <button
          class="options__button"
          :class="{
            'options__button--selected': settings.option2,
          }"
          type="button"
          @click="settings.option2 = !settings.option2"
        >
          Option 2
        </button>
        <button
          class="options__button"
          :class="{
            'options__button--selected': settings.option3,
          }"
          type="button"
          @click="settings.option3 = !settings.option3"
        >
          <span v-if="settings.option3">Specific</span>
          <span v-else>Random</span>
        </button>
      </div>
      <form class="form" @submit.prevent="submitForm()">
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

        <button type="submit" class="form__button">Submit</button>
      </form>
    </div>
    <div class="result"></div>
  </main>
</template>
<style scoped lang="scss">
.main {
  padding: 4rem 8rem;
  display: grid;
  grid-template-columns: 1fr 3fr;
  width: 100%;
  height: 100%;
  justify-content: center;
}

.result {
  display: flex;
  &__name {
    color: green !important;
  }
}

.options {
  margin-bottom: 2rem;
  justify-content: center;
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
    &--error {
    }

    &:focus {
    }
  }
}
</style>
