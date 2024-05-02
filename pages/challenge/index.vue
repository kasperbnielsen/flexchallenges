<script setup lang="ts">
import { ref } from "vue";
import { storeToRefs } from "pinia";
import champions from "../../assets/champions";
import { useModeStore } from "@/stores/mode";
const { mode, server } = storeToRefs(useModeStore());
const config = useRuntimeConfig();

const SERVER_HOST = config.public.SERVER_HOST;

const dropdown = ref(false);
const showRoles = ref(false);
const encodedData = ref("");
const state = ref<boolean>(true);
const serverRegion = ref("");

type PlayerType = {
  players: {
    player1: {
      name: string;
      assignedChamp: string;
      key: string;
      puuid: string;
    };
    player2: {
      name: string;
      assignedChamp: string;
      key: string;
      puuid: string;
    };
    player3: {
      name: string;
      assignedChamp: string;
      key: string;
      puuid: string;
    };
    player4: {
      name: string;
      assignedChamp: string;
      key: string;
      puuid: string;
    };
    player5: {
      name: string;
      assignedChamp: string;
      key: string;
      puuid: string;
    };
  };
  region: string;
  order: number[];
  pointsList: number[];
  levelList: number[];
};

const role: string[] = [
  "bot_challenger.png",
  "support_challenger.png",
  "jungle_challenger.png",
  "middle_challenger.png",
  "top_challenger.png",
];

type List = {
  name: string[];
  disabled: boolean[];
  selected: boolean[];
};

const currentRegion = ref();

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
  option1: true,
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

function resetOptions() {
  for (let i = 0; i < item.value.length; i++) {
    item.value[i] = false;
  }
}

function resetSelect(isRegions: boolean) {
  if (isRegions) {
    dropdownListRegions.value.selected.forEach((e) => {
      e = false;
    });
  } else {
    dropdownListTeamComps.value.selected.forEach((e) => {
      e = false;
    });
  }
}

function encodeData(list: {}) {
  const stringified = JSON.stringify(list);

  const base64Filter = btoa(stringified);

  if (base64Filter.endsWith("=")) return base64Filter.replace(/=/g, "");

  return base64Filter;
}

const myObject2 = ref<PlayerType>();
const dropdownListRegions = ref<List>({
  name: Object.keys(champions.regions),
  disabled: Array(13).fill(false),
  selected: Array(13).fill(false),
});
const dropdownListTeamComps = ref<List>({
  name: Object.keys(champions.teamComps),
  disabled: Array(11).fill(false),
  selected: Array(11).fill(false),
});

function resetDropdown(str: string) {
  if (str === "region") {
    for (let i = 0; i < dropdownListRegions.value.selected.length; i++) {
      dropdownListRegions.value.selected[i] = false;
      dropdownListRegions.value.disabled[i] = false;
    }
  }
}
computed(() => (settings.value.option2 ? dropdownListTeamComps.value : dropdownListRegions.value));

watch(myObject2, () => {
  if (myObject2.value) {
    if (!settings.value.option2) {
      const index = dropdownListRegions.value.name.indexOf(myObject2.value.region);
      if (settings.value.option1) {
        dropdownListRegions.value.disabled[index] = true;
        dropdownListRegions.value.selected[index] = true;
      }
    } else {
      const index = dropdownListTeamComps.value.name.indexOf(myObject2.value.region);
      if (settings.value.option1) {
        dropdownListTeamComps.value.disabled[index] = true;
        dropdownListTeamComps.value.selected[index] = true;
      }
    }
  }
});

watch(settings.value, () => {
  if (!settings.value.option1) {
    for (let i = 0; i < 13; i++) {
      dropdownListRegions.value.disabled[i] = false;
      dropdownListTeamComps.value.disabled[i] = false;
      dropdownListRegions.value.selected[i] = false;
      dropdownListTeamComps.value.selected[i] = false;
    }
  }
});

function refreshChampion(index: string) {
  const player = myObject2.value?.players;
  if (myObject2.value !== undefined) {
    const newChampion = myObject2.value.region;
    currentRegion.value = newChampion;
    const tempArr: (typeof champions.champions.Aatrox)[] = [];
    const championArr = settings.value.option2
      ? champions.teamComps[newChampion as keyof typeof champions.teamComps]
      : champions.regions[newChampion as keyof typeof champions.regions];
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

const rateLimit = ref(false);
const order: string[] = [];

watch(rateLimit, () => {
  if (rateLimit.value) {
    setTimeout(() => {
      rateLimit.value = false;
    }, 120000);
  }
});

async function fetchData2() {
  settings.value.option2 = !!Math.round(Math.random());
  const list = Object.values(settings.value.players);
  const newList: string[] = [];
  const newList2: string[] = [];
  let isRegions = true;
  const count = !settings.value.option2 ? 13 : 11;
  for (let i = 0; i < count; i++) {
    if (!settings.value.option2) {
      if (!dropdownListRegions.value.selected[i]) newList.push(Object.keys(champions.regions)[i]);
    } else if (!dropdownListTeamComps.value.selected[i]) newList2.push(Object.keys(champions.teamComps)[i]);
  }
  let options;
  if (settings.value.option2) {
    options = newList2;
    isRegions = false;
  } else {
    isRegions = true;
    options = newList;
  }

  const easyMode = mode.value;

  switch (server.value) {
    case "EUW":
      serverRegion.value = "EUW1";
      break;
    case "JP":
      serverRegion.value = "JP1";
      break;
    case "NA":
      serverRegion.value = "NA1";
      break;
    case "EUNE":
      serverRegion.value = "EUN1";
      break;
    case "KR":
      serverRegion.value = "KR";
      break;
    case "LA1":
      serverRegion.value = "LA1";
      break;
    case "LA2":
      serverRegion.value = "LA2";
      break;
    case "BR":
      serverRegion.value = "BR1";
      break;
    case "OCE":
      serverRegion.value = "OC1";
      break;
    case "PH":
      serverRegion.value = "PH2";
      break;
    case "RU":
      serverRegion.value = "RU";
      break;
    case "SG":
      serverRegion.value = "SG2";
      break;
    case "TH":
      serverRegion.value = "TH2";
      break;
    case "TR":
      serverRegion.value = "TR1";
      break;
    case "TW":
      serverRegion.value = "TW2";
      break;
    case "VN":
      serverRegion.value = "VN2";
      break;
    default:
      serverRegion.value = "EUW";
      break;
  }
  encodedData.value = encodeData({
    list,
    options,
    isRegions,
    easyMode,
    serverRegion,
  });
  const data = await fetch(`${SERVER_HOST}/riot/${encodedData.value}`, {
    method: "get",
  }).then((res) => {
    rateLimit.value = res.status === 429;
    console.log(res);
    if (res.status === 429) console.log(res.status);
    else return res.json();
  });

  if (easyMode) showRoles.value = true;

  myObject2.value = data;
  if (myObject2.value) {
    for (let i = 0; i < role.length; i++) {
      order[i] = role[myObject2.value?.order[i]];
    }
  }
}
</script>

<template>
  <div v-if="rateLimit" class="alert alert-warning alert alert-dismissible" role="alert">
    <strong>Ratelimit hit!</strong> Please wait 2 minutes before trying again.
    <button aria-label="Close" class="btn-close" data-bs-dismiss="alert" type="button"></button>
  </div>
  <main class="main">
    <div class="main__div">
      <div v-if="state">
        <form class="form" @submit.prevent="state = false">
          <label class="form__label" for="player1">Player 1</label>
          <input v-model.lazy="settings.players.player1" class="form__input" name="player1" required />

          <label class="form__label" for="player2">Player 2</label>
          <input v-model.lazy="settings.players.player2" class="form__input" name="player2" required />
          <label class="form__label" for="player3">Player 3</label>
          <input v-model.lazy="settings.players.player3" class="form__input" name="player3" required />
          <label class="form__label" for="player4">Player 4</label>
          <input v-model.lazy="settings.players.player4" class="form__input" name="player4" required />

          <label class="form__label" for="player5">Player 5</label>
          <input v-model.lazy="settings.players.player5" class="form__input" name="player5" required />
          <div class="form__submit">
            <button v-if="!rateLimit" class="form__button btn btn-primary" type="submit">Submit</button>
            <button v-else class="form__button btn" disabled>
              <div class="spinner-border" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
            </button>
          </div>
        </form>
      </div>
      <div v-else class="leftdiv">
        <!---<button
          class="options__button options__button--nohover"
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
          @click="
            settings.option2 = !settings.option2;
            resetOptions();
          "
        >
          <span v-if="settings.option2" class="color">Comps</span>
          <span v-else class="color">Regions</span>
        </button>-->
        <button class="backbutton" @click="state = true">
          <font-awesome-icon class="backicon" :icon="['fas', 'arrow-left']" />
        </button>

        <div class="thisdiv">
          <div class="leftdiv__region">
            <select v-model="server" class="form-select header__select form-select-lg mb-3">
              <option class="header__select__option" value="EUW">EUW</option>
              <option class="header__select__option" value="EUNE">EUNE</option>
              <option class="header__select__option" value="NA">NA</option>
              <option class="header__select__option" value="OCE">OCE</option>
              <option class="header__select__option" value="KR">KR</option>
              <option class="header__select__option" value="JP">JP</option>
              <option class="header__select__option" value="LA1">LA1</option>
              <option class="header__select__option" value="LA2">LA2</option>
              <option class="header__select__option" value="PH">PH</option>
              <option class="header__select__option" value="RU">RU</option>
              <option class="header__select__option" value="SG">SH</option>
              <option class="header__select__option" value="TH">TH</option>
              <option class="header__select__option" value="TR">TR</option>
              <option class="header__select__option" value="TW">TW</option>
              <option class="header__select__option" value="VN">VN</option>
            </select>
          </div>
          <div class="modediv">
            <div>
              <button
                id="success-outlined"
                class="btn btn-outline-success modediv__button"
                name="options-outlined"
                :style="{ backgroundColor: mode ? 'green' : 'transparent' }"
                @click="mode = true"
              >
                Easy
              </button>
            </div>

            <div>
              <button
                id="danger-outlined"
                class="btn btn-outline-danger modediv__button"
                name="options-outlined"
                :style="{ backgroundColor: mode ? 'transparent' : 'red' }"
                @click="mode = false"
              >
                Hard
              </button>
            </div>
          </div>
        </div>
        <div class="dropdowns">
          <div class="dropdown">
            <button
              id="dropdownMenuClickableInside"
              aria-expanded="false"
              class="dropdown-toggle btn btn-secondary selectdiv__button dropdown__button"
              data-bs-auto-close="outside"
              data-bs-display="static"
              data-bs-toggle="dropdown"
              type="button"
              @click="dropdown = !dropdown"
            >
              Include regions
            </button>
            <ul aria-labelledby="dropdownMenuClickableInside" class="dropdown-menu dropdown-menu-dark dropdown__menu">
              <div v-for="(element, elementindex) of dropdownListRegions.selected" :key="elementindex">
                <li
                  class="infront"
                  @click="dropdownListRegions.selected[elementindex] = !dropdownListRegions.selected[elementindex]"
                >
                  <span
                    class="dropdown-item dropdown-link-color"
                    :class="{
                      active: !dropdownListRegions.selected[elementindex],
                      disabled: dropdownListRegions.disabled[elementindex],
                    }"
                    >{{ dropdownListRegions.name[elementindex] }}</span
                  >
                </li>
              </div>
            </ul>
          </div>
          <div class="dropdown">
            <button
              id="dropdownMenuClickableInside"
              aria-expanded="false"
              class="dropdown-toggle btn btn-secondary dropdown__button compsbutton"
              data-bs-auto-close="outside"
              data-bs-display="static"
              data-bs-toggle="dropdown"
              type="button"
              @click="dropdown = !dropdown"
            >
              Include comps
            </button>
            <ul aria-labelledby="dropdownMenuClickableInside" class="dropdown-menu dropdown-menu-dark dropdown__menu">
              <div v-for="(element, elementindex) of dropdownListTeamComps.selected" :key="elementindex">
                <li
                  class="infront"
                  @click="dropdownListTeamComps.selected[elementindex] = !dropdownListTeamComps.selected[elementindex]"
                >
                  <span
                    class="dropdown-item"
                    :class="{
                      active: !dropdownListTeamComps.selected[elementindex],
                      disabled: dropdownListTeamComps.disabled[elementindex],
                    }"
                    >{{ dropdownListTeamComps.name[elementindex] }}</span
                  >
                </li>
              </div>
            </ul>
          </div>
        </div>

        <div class="form__submit__second">
          <form @submit.prevent="fetchData2()">
            <button v-if="!rateLimit" class="form__button btn btn-primary" type="submit">Submit</button>
            <button v-else class="form__button btn" disabled>
              <div class="spinner-border" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
            </button>
          </form>
        </div>
      </div>
    </div>

    <div ref="resultReference" class="result">
      <div v-for="(player, playerIndex, index) of myObject2?.players" :key="playerIndex" class="result__div">
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
            <font-awesome-icon class="result__div__div__button__refresh" :icon="['fas', 'rotate-right']" />
          </button>
          <div class="result__div__div__player">
            <a :href="`/player/${serverRegion}/${player.name}`"
              ><p>{{ player.name }}</p></a
            >
          </div>
          <div class="result__div__div__mastery">
            <img class="result__div__div__mastery__img" :src="`mastery${myObject2?.levelList[index] ?? 0}.png`" />
            <p>{{ myObject2?.pointsList[index] }}</p>
          </div>
          <div>
            <img v-if="mode && showRoles" class="result__div__div__role" :src="role[myObject2?.order[index]]" />
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
<style scoped lang="scss">
button:focus {
  box-shadow: none;
  outline: none;
}

.backbutton {
  border: none;
  background: none;
  margin-bottom: 2rem;
}
.backicon {
  width: 2rem;
  height: 2rem;
  color: #3d3d3d;
}

.compsbutton {
  padding: 1.75rem 0.5rem 1.75rem 0.5rem;
  margin: 0rem 0.5rem 0 0.5rem;
  border: none;
}

.comps {
  display: flex;
}

.modediv {
  display: flex;
  margin-left: 1rem;

  &__button {
    padding: 0.5rem 2.5rem;
  }
}

.form-select {
  background-color: #3d3d3d;
  border: none;
  color: #c8aa6e;
  &:hover {
    color: white;
  }
}

.thisdiv {
  display: flex;
}

.resetbutton {
  width: 15rem;
  height: 5rem;
  border: none;
  margin: 3rem 0.5rem 0 0.5rem;
}

.resetbutton2 {
  margin-left: 0.5rem;
}

.leftdiv {
  &__region {
    width: 15rem;
    background-color: #252525;
    margin-left: 0.5rem;
    margin-bottom: 3rem;
  }
}
.alert {
  top: 0;
  left: 0;
  z-index: 1;
  position: fixed;
  width: 100%;
}

.dropdowns {
  display: flex;
}
.main {
  padding: 3rem;
  display: grid;
  grid-template-columns: 1.5fr 2.5fr;
  width: 100%;
  height: 100%;
  align-items: center;

  justify-content: center;
  &__div {
    background-color: #252525;
    border-radius: 5px;
    padding: 2rem;
    width: 36rem;
    display: flex;
    flex-direction: row;
  }
}

.selectdiv {
  display: block;
  &__button {
    width: 15rem;
    height: 5rem;
    border: none;
    margin: 0 0.5rem 0 0.5rem;
  }
  &__select {
    position: absolute;
    width: 15rem;
  }
}

button {
  width: fit-content;
  color: #c8aa6e;
  font-size: 700;
  &:hover {
    color: white;
  }
}
.dropdown {
  &__menu {
    width: 15rem;
  }

  &__button {
    width: 15rem;
    background-color: #3d3d3d;
    &:focus {
      background-color: #3d3d3d;
      outline: none;
    }
    &:hover {
      background-color: #3d3d3d;
    }
  }
}

.active {
  background-color: #3d3d3d;
}

.result {
  background-color: #252525;
  display: flex;
  flex-direction: column;
  position: relative;
  margin-left: 1rem;
  text-align: center;
  padding: 2rem;
  height: 50rem;
  border-radius: 5px;
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
      background-color: #3d3d3d;
      border: 5px solid #c89b3c;

      display: grid;
      grid-template-columns: 1fr 1fr 5fr 1fr 1fr;

      &__role {
        width: 2rem;
        margin-right: -25rem;
      }

      &__image {
        margin-left: 1.25rem;
        width: 5rem;
        border: 1px solid #c8aa6e;
      }

      &__mastery {
        position: absolute;
        margin-left: 27rem;
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

.options {
  display: flex;
  margin: 1rem 3rem;
  margin-bottom: 2rem;
  justify-content: center;

  &__select {
    height: 5rem;
    width: 20rem;
    padding: 0.5rem 1.5rem;
    margin: 0 1rem;
    border: 3px solid black;
  }

  &__button {
    background-color: #3d3d3d;
    font-weight: 400;
    padding: 0.5rem 1.5rem;
    margin: 0 1rem;
    width: 10rem;
    border-radius: 5px;

    &:hover {
      background-color: #3d3d3d;
      color: white;
    }

    &--nohover {
    }

    &--nomargright {
      margin-right: -1.125rem;
    }

    &--notselected {
      background-color: green;
      &:hover {
        background-color: green;
      }
    }

    &--selected {
      background-color: red;
      &:hover {
        background-color: red;
      }
    }
  }
}

.color {
  color: #c8aa6e;
  font-weight: 400;
  &:hover {
    color: white;
  }
}

.dropdown-item {
  z-index: 0;
}

.active.dropdown-item {
  background-color: green;
}

.main__div {
  height: 50rem;
}

.dropdown-menu {
  margin-left: 1rem;
}
.form {
  display: flex;
  flex-direction: column;
  justify-content: center;

  &__submit {
    display: flex;
    &__second {
      margin-top: 24.625rem;
    }
  }

  &__settingsbtn {
    display: flex;
    background: none;
    border: none;
  }

  &__label {
    font-weight: 600;
    color: #c8aa6e;
  }

  &__button {
    background-color: #494948;
    color: black;
    padding: 1rem 2rem;
    font-size: 1.125rem;
    font-weight: 400;
    border: none;
    width: 100%;
    &:active {
      outline: none !important;
      box-shadow: none !important;
      background-color: #3d3d3d;
    }
    &:hover {
    }
  }

  &__input {
    &:focus {
      outline: none !important;
      box-shadow: none !important;
    }
    margin-bottom: 2rem;
    width: 32rem;
    padding: 1rem 2rem;
    border-radius: 5px;
    font-weight: 700;
    color: #0a323c;
    text-transform: capitalize;

    &--error {
    }

    &:focus {
    }
  }
}
</style>
