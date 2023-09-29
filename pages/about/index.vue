<script lang="ts" setup></script>
<template>
  <p>
    This is a tool for any group of friends that enjoy playing flex queue
    together who are also looking for something new and challenging. With the
    release of challenges in 2022, you can as a group try to compete and win
    with team comps you wouldn’t normally play. By entering the names of your
    teammates, each player will receive a random champion that is included in a
    team that completes an achievement (if you win) - but don’t worry - we make
    sure that whoever is the best at the given champion gets assigned that
    champion. This is based entirely on mastery, so make sure to set your
    expectations at a reasonable level. THIS IS NOT EASY. Sometimes you might
    get champions that have a really hard time winning. Best of luck to any
    fucking gigachad gamers willing to try.
  </p>
  <div class="dropdown">
            <button class="btn btn-success dropdown-toggle"
                    type="button" 
                    id="multiSelectDropdown"
                    data-bs-toggle="dropdown" 
                    aria-expanded="false">
                Select
            </button>
            <ul class="dropdown-menu" 
                aria-labelledby="multiSelectDropdown">
                <li>
                  <label>
                    <input type="checkbox" 
                           value="Java">
                        Java
                    </label>
                </li>
                <li>
                  <label>
                    <input type="checkbox" 
                           value="C++">
                        C++
                    </label>
                </li>
                <li>
                  <label>
                    <input type="checkbox" 
                           value="Python">
                        Python
                    </label>
                </li>
            </ul>
        </div>
</template>
