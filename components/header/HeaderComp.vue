<script lang="ts" setup>
import { ref } from "vue";
import { storeToRefs } from "pinia";
import { useModeStore } from "@/stores/mode";
const { mode } = storeToRefs(useModeStore());
const { server } = storeToRefs(useModeStore());
</script>
<template>
  <div>
    <div class="header">
      <div class="header__section">
        <select
          v-model="server"
          aria-label="Default select example"
          class="form-select header__select form-select-lg mb-3"
        >
          <option class="header__select__option" selected value="EUW">
            EUW
          </option>
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
            <a
              class="nav-link header__link"
              data-bs-target="#exampleModal"
              data-bs-toggle="modal"
              >What is this?</a
            >
          </li>
        </ul>
        <div
          id="exampleModal"
          aria-hidden="true"
          aria-labelledby="exampleModalLabel"
          class="modal fade"
          tabindex="-1"
        >
          <div class="modal-dialog">
            <div class="modal-content modal__content">
              <div class="modal-header modal__header">
                <h5 class="modal-title modal__title">What is this?</h5>
                <button
                  aria-label="Close"
                  class="btn-close"
                  data-bs-dismiss="modal"
                  type="button"
                ></button>
              </div>
              <div class="modal-body">
                <p class="modal__text">
                  This is a tool for any group of friends that enjoy playing
                  flex queue together who are also looking for something new and
                  challenging. With the release of challenges in 2022, you can
                  as a group try to compete and win with team comps you wouldn’t
                  normally play. By entering the names of your teammates, each
                  player will receive a random champion that is included in a
                  team that completes an achievement (if you win) - but don’t
                  worry - we make sure that whoever is the best at the given
                  champion gets assigned that champion. This is based entirely
                  on mastery, so make sure to set your expectations at a
                  reasonable level. THIS IS NOT EASY. Sometimes you might get
                  champions that have a really hard time winning. Best of luck
                  to any fucking gigachad gamers willing to try.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <a class="header__logo" href="/">
        <h1 class="header__logo">
          <span class="header__logo--color">Flex</span>Challenges
        </h1>
      </a>
      <div class="header__div">
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
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
* {
  color: white;
}

button:focus {
  box-shadow: none !important;
  outline: none !important;
}
.header {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  text-align: center;
  padding: 0 0 0 0;
  background-image: var(--bs-gradient);
  background-color: #091428;
  border-bottom: 2px solid #c8aa6e;
  &__h1 {
    margin-top: 1rem;
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
    margin-right: 3rem;
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
      border-color: #c8aa6e;
    }

    &__content {
      background-color: #0a323c;
      padding: 2rem;
    }
  }

  &__logo {
    padding: 0.5rem 1rem;
    justify-self: center;
    background: none;
    color: #0397ab;
    font-weight: 700;
    text-decoration: none;
    border-radius: 10px;
    &--color {
      color: #c89b3c;
    }
  }
}
</style>
