import champions from "~/assets/champions";

const APIKEY = "RGAPI-7aa9f16d-2c4c-4387-a769-5fa6c11c3630";

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

function getChampions(region: string[]) {
  const champList = new Set<string>();

  while (champList.size < 5) {
    const n = Math.floor(Math.random() * region.length);
    champList.add(region[n]);
  }
  return Array.from(champList);
}

function getPlayerMastery(champs: Mastery, champList: string[]) {
  const playerMasteries: number[] = [1, 1, 1, 1, 1];
  console.log(champList);
  for (let i = 0; i < champList.length; i++) {
    for (let j = 0; j < champs.length; j++) {
      if (champs[j].championId.toString() === champList[i]) {
        playerMasteries[i] = champs[j].championPoints;
      }
    }
  }
  return playerMasteries;
}

function getRegion() {
  const reg = champions.regionsList;
  Object.keys(champions.regions);
  return reg[Math.floor(Math.random() * reg.length)];
}

function getKeys(championList: string[]) {
  const keyList: string[] = [];
  championList.forEach((element) => {
    if (champions.champions.hasOwnProperty(element)) {
      keyList.push(
        champions.champions[element as keyof typeof champions.champions]
      );
    }
  });
  return keyList;
}

function decode(input: string) {
  const padded = input.padEnd(input.length + (4 - (input.length % 4)), "=");

  const json = Buffer.from(padded, "base64").toString();
  return JSON.parse(json);
}

function getMax(arr: number[]) {
  let tempMax = 0;
  console.log(arr);
  arr.forEach((element) => {
    if (element > tempMax) {
      tempMax = element;
    }
  });
  return tempMax;
}

// Returns which index point[index], contains the biggest number
function getHighest(points: number[][]) {
  let maximum = 0;
  let index = 0;
  points.forEach((element, i) => {
    const temp = getMax(element);
    console.log(`max =${temp}`);
    if (maximum < temp) {
      maximum = temp;
      index = i;
    }
  });
  console.log(`hieghest = ${maximum}`);
  return index;
}

async function getMastery(puuid: number, apiKey: string) {
  const url = `https://euw1.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-puuid/${puuid}?api_key=${apiKey}`;
  return await fetch(url, { method: "GET" }).then((res) => res.json());
}

async function getId(username: string, apiKey: string) {
  const url = `https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${username}?api_key=${apiKey}`;
  const resp = await fetch(url, { method: "GET" }).then((response) => response);
  return await resp.json();
}

export default defineEventHandler(async (event) => {
  if (!event?.context?.params?.nameslist) {
    return;
  }

  const names: { list: string[]; options: string[]; isRegions: boolean } =
    decode(event?.context?.params?.nameslist);
  console.log(names);
  let champs;

  if (names.options.length === 0) {
    champs = names.isRegions
      ? getChampions(getRegion())
      : getChampions(
          champions.teamCompsList[
            Math.floor(Math.random() * champions.teamCompsList.length)
          ]
        );
  } else {
    champs = names.isRegions
      ? getChampions(
          // @ts-expect-error Shitty type
          champions.regions[
            names.options[Math.floor(Math.random() * names.options.length)]
          ]
        )
      : getChampions(
          // @ts-expect-error Shitty type
          champions.teamComps[
            names.options[Math.floor(Math.random() * names.options.length)]
          ]
        );
  }
  const keys = getKeys(champs);

  const masteryPoints: Array<Array<number>> = [];

  for (const name of names.list) {
    const id = await getId(name, APIKEY);
    const mastery = await getMastery(id.puuid, APIKEY);
    const playerMastery = getPlayerMastery(mastery, keys);
    masteryPoints.push(playerMastery);
  }

  console.log(masteryPoints);
  const newChampList = [];

  const assignedChamps = [];

  for (let i = 0; i < 5; i++) {
    const indexOfPlayer = getHighest(masteryPoints);
    const indexOfChampion = masteryPoints[indexOfPlayer].findIndex(
      (element) => element === getMax(masteryPoints[indexOfPlayer])
    );

    assignedChamps[indexOfPlayer] = keys[indexOfChampion];
    newChampList[indexOfPlayer] = champs[indexOfChampion];

    masteryPoints[indexOfPlayer] = [0, 0, 0, 0, 0];

    for (let j = 0; j < 5; j++) {
      masteryPoints[j][indexOfChampion] = 0;
    }
  }

  const myObject2 = {
    player1: {
      name: names.list[0],
      assignedChamp: assignedChamps[0],
      key: newChampList[0],
    },
    player2: {
      name: names.list[1],
      assignedChamp: assignedChamps[1],
      key: newChampList[1],
    },
    player3: {
      name: names.list[2],
      assignedChamp: assignedChamps[2],
      key: newChampList[2],
    },
    player4: {
      name: names.list[3],
      assignedChamp: assignedChamps[3],
      key: newChampList[3],
    },
    player5: {
      name: names.list[4],
      assignedChamp: assignedChamps[4],
      key: newChampList[4],
    },
  };

  console.log(myObject2);

  return myObject2;
});
