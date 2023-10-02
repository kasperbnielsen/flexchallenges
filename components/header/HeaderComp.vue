<script lang="ts" setup>
import { ref } from "vue";
const mode = ref(false);
</script>
<template>
  <div>
    <div class="header">
      <div></div>
      <a class="header__logo" href="/">
        <h1 class="header__logo">
          <span class="header__logo--color">Flex</span>Challenges
        </h1>
      </a>
      <div class="header__div">
        <div>
          <input
            id="success-outlined"
            autocomplete="off"
            checked
            class="btn-check"
            name="options-outlined"
            type="radio"
          />
          <label
            class="btn btn-outline-success header__button"
            for="success-outlined"
            >Easy</label
          >
        </div>

        <div>
          <input
            id="danger-outlined"
            autocomplete="off"
            class="btn-check"
            name="options-outlined"
            type="radio"
          />
          <label
            class="btn btn-outline-danger header__button"
            for="danger-outlined"
            >Hard</label
          >
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
* {
  color: white;
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

  &__div {
    display: flex;
    justify-content: right;
    margin-right: 3rem;
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

    &--easy {
      background-color: green;
    }
  }

  &__icon {
    width: 2rem;
    height: auto;
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
