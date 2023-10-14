<script lang="ts" setup>
import { useRouter, useRoute } from "vue-router";

const username = ref();

const currentRegion = ref<string>("EUW");

const regionsList = ref([
  { name: "Europe West", region: "EUW" },
  { name: "North America", region: "NA" },
  { name: "Europe East", region: "EUNE" },
  { name: "Australia", region: "OCE" },
]);

const route = useRoute();
const router = useRouter();

async function search() {
  await router.push(
    `/player/${currentRegion.value.toLowerCase()}1/${username.value}/`
  );
  router.go(0);
}
</script>
<template>
  <div class="body">
    <div class="header">
      <div>
        <a class="header__logo" href="/">
          <h1 class="header__logo">
            <span class="header__logo--color">Flex</span>Challenges
          </h1>
        </a>
      </div>
      <div v-if="route.path != '/'">
        <div class="input-group mb-3 header__search">
          <button
            aria-expanded="false"
            class="btn btn-outline-secondary dropdown-toggle searchdropdown"
            data-bs-toggle="dropdown"
            type="button"
          >
            {{ currentRegion }}
          </button>
          <ul class="dropdown-menu">
            <div v-for="(reg, regionIndex) of regionsList" :key="regionIndex">
              <li>
                <button
                  class="dropdown-item"
                  @click.prevent="currentRegion = reg.region"
                >
                  {{ reg.name }}
                </button>
              </li>
            </div>
          </ul>
          <input
            v-model="username"
            aria-label="Text input with dropdown button"
            class="form-control"
            type="text"
            @keydown.enter="search"
          />
        </div>
      </div>
      <!---<div class="header__section">
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
        <ul class="nav">
          <li class="nav-item">
            <a class="nav-link header__link" data-bs-target="#exampleModal" data-bs-toggle="modal">What is this?</a>
          </li>
        </ul>
      <div id="exampleModal" aria-hidden="true" aria-labelledby="exampleModalLabel" class="modal fade" tabindex="-1">
        <div class="modal-dialog">
          <div class="modal-content modal__content">
            <div class="modal-header modal__header">
              <h5 class="modal-title modal__title">What is this?</h5>
              <button aria-label="Close" class="btn-close" data-bs-dismiss="modal" type="button"></button>
            </div>
            <div class="modal-body">
              <p class="modal__text">
                This is a tool for any group of friends that enjoy playing flex queue together who are also looking for
                something new and challenging. With the release of challenges in 2022, you can as a group try to compete
                and win with team comps you wouldn’t normally play. By entering the names of your teammates, each player
                will receive a random champion that is included in a team that completes an achievement (if you win) -
                but don’t worry - we make sure that whoever is the best at the given champion gets assigned that
                champion. This is based entirely on mastery, so make sure to set your expectations at a reasonable
                level. THIS IS NOT EASY. Sometimes you might get champions that have a really hard time winning. Best of
                luck to any fucking gigachad gamers willing to try.
              </p>
            </div>
          </div>
        </div>
      </div>--->

      <!---<div class="header__div">
        <div>
          <button
            id="success-outlined"
            class="btn btn-outline-success header__button"
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
            class="btn btn-outline-danger header__button"
            name="options-outlined"
            :style="{ backgroundColor: mode ? 'transparent' : 'red' }"
            @click="mode = false"
          >
            Hard
          </button>
        </div>
      </div>-->
    </div>
    <div class="header__nav">
      <ul class="nav">
        <li class="nav-item">
          <a aria-current="page" class="nav-link active" href="/">Home</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="/challenge">Challenge</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="#">Champions</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="/rankings">Rankings</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="#">Coaching</a>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped lang="scss">
* {
  color: white;
}

.body {
  background-image: var(--bs-gradient);
  background-color: #091428;
  border-bottom: 2px solid #c8aa6e;
}

.input-group {
  margin-top: 3rem;
  margin-left: 5rem;
}

.dropdown-item {
  color: rgba(255, 255, 255, 0.575);
  &:hover {
    background-color: #494948;
  }
}
.nav-link {
  color: #c8aa6e;

  &:hover {
    outline: 1px solid white;
    color: white;
    border-radius: 2px;
  }

  &:active {
    background-color: #091428;
  }
}

.searchdropdown {
  font-weight: 700;
  border: none;
  background-color: rgba(255, 255, 255, 0.575);
  color: #575756;
  width: 6rem;
  &:focus {
    color: #575756;
    background-color: rgba(255, 255, 255, 0.575);
  }
}

button:focus {
  box-shadow: none !important;
  outline: none !important;
}

.dropdown-menu {
  transition: none;
  background-color: #575756;
  opacity: 1;
}
.header {
  display: grid;
  grid-template-columns: 1fr 5fr;
  text-align: center;
  padding: 0 0 0 0;
  margin-right: 21rem;

  &__search {
    margin-top: 3.5rem;
    margin-left: 3rem;
    display: flex;
    width: 100%;
  }

  &__h1 {
    margin-top: 1rem;
  }

  &__nav {
    margin-left: 17rem;
  }

  &__section {
    display: flex;
  }

  &__link {
    margin-top: 2rem;
    margin-left: 8rem;
    color: #c89b3c;
    &:hover {
      color: white;
    }
  }

  &__select {
    width: 8rem;
    margin-left: 2rem;
    height: fit-content;
    margin-top: 2rem;
    color: #c89b3c;
    background-color: #0a323c;
    font-weight: 700;
    border: 1px solid #c8aa6e;
    &:focus {
      box-shadow: none;
      outline: none;
    }
    &__option {
      color: #c89b3c;
      font-weight: 700;

      &:hover {
        background-color: #091428;
      }
    }
  }

  &__div {
    display: flex;
    justify-content: right;
  }

  .btn:focus,
  .btn:active:focus,
  .btn.active:focus,
  .btn.focus,
  .btn:active.focus,
  .btn.active.focus {
    outline: none !important;
    box-shadow: none !important;
  }

  &__button {
    background-image: var(--bs-gradient);
    border: none;
    font-weight: 700;
    padding: 0.5rem 1rem;
    width: 10rem;
    height: 3rem;
    justify-self: right;
    margin-top: 1.5rem;

    &:focus {
      outline: none !important;
      box-shadow: none;
    }

    &--easy {
      background-color: green;
    }
  }

  &__icon {
    width: 2rem;
    height: auto;
  }

  .modal {
    color: #c89b3c;
    &__text {
      color: #c89b3c;
    }
    &__title {
      color: #c89b3c;
    }
    &__header {
      border-color: #c89b3c;
    }

    &__content {
      background-color: #0a323c;
      padding: 2rem;
    }
  }

  &__logo {
    justify-self: center;
    background: none;
    color: #c8aa6e;
    font-weight: 700;
    font-size: 32px;
    text-decoration: none;
    border-radius: 10px;
    margin-left: 18rem;
    &--color {
      color: white;
    }
  }
}
</style>
