<script lang="ts" setup>
import { ref } from "vue";
const menu = ref(false);
</script>
<template>
  <div>
    <div class="header">
      <a href="/" class="header__logo">
        <h1 class="header__logo">
          <span class="header__logo--color">Flex</span>Challenges
        </h1>
      </a>
    </div>
  </div>
</template>
<style scoped lang="scss">
* {
  color: white;
}

.header {
  display: grid;
  grid-template-columns: 1fr;
  text-align: center;
  padding: 0 0 0 0;
  background-color: #091428;
  border-bottom: 2px solid #c8aa6e;
  &__h1 {
    margin-top: 1rem;
  }

  &__button {
    background: none;
    border: none;
    width: fit-content;
    margin-top: 1rem;
    margin-left: 2rem;
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
