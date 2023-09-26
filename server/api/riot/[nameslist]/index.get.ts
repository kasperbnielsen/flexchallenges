const APIKEY = "RGAPI-066f5cbe-d050-4e2b-b64a-841ed7d4626f";
import champions from "../../../../assets/champions";

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
  let champList = new Set<string>();

  while (champList.size < 5) {
    let n = Math.floor(Math.random() * region.length);
    champList.add(region[n]);
  }
  return Array.from(champList);
}

function getPlayerMastery(champs: Mastery, champList: string[]) {
  let playerMasteries: number[] = [1, 1, 1, 1, 1];
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
  return champions.regions[
    Math.floor(Math.random() * champions.regions.length)
  ];
}

function getKeys(championList: string[]) {
  let keyList: string[] = [];
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

// Returns which index point[index], contains the biggest number
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

async function getMastery(puuid: number, apiKey: string) {
  const url =
    "https://euw1.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-puuid/" +
    puuid +
    "?api_key=" +
    apiKey;
  return await fetch(url, { method: "GET" }).then((res) => {
    return res.json();
  });
}

async function getId(username: string, apiKey: string) {
  const url =
    "https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-name/" +
    username +
    "?api_key=" +
    apiKey;
  let resp = await fetch(url, { method: "GET" }).then((response) => {
    return response;
  });
  return await resp.json();
}

export default defineEventHandler(async (event) => {
  if (!event?.context?.params?.nameslist) {
    return;
  }
  let names: string[] = decode(event?.context?.params?.nameslist);

  let champs = getChampions(getRegion());

  let keys = getKeys(champs);

  let masteryPoints: Array<Array<number>> = [];

  for (const name of names) {
    let id = await getId(name, APIKEY);
    let mastery = await getMastery(id.puuid, APIKEY);
    let playerMastery = getPlayerMastery(mastery, keys);
    masteryPoints.push(playerMastery);
  }

  console.log(masteryPoints);
  let newChampList = [];

  let assignedChamps = [];

  for (let i = 0; i < 5; i++) {
    let indexOfPlayer = getHighest(masteryPoints);
    let indexOfChampion = masteryPoints[indexOfPlayer].findIndex(
      (element) => element == getMax(masteryPoints[indexOfPlayer])
    );

    assignedChamps[indexOfPlayer] = keys[indexOfChampion];
    newChampList[indexOfPlayer] = champs[indexOfChampion];

    masteryPoints[indexOfPlayer] = [0, 0, 0, 0, 0];

    for (let j = 0; j < 5; j++) {
      masteryPoints[j][indexOfChampion] = 0;
    }
  }

  let myObject2 = {
    player1: {
      name: names[0],
      assignedChamp: assignedChamps[0],
      key: newChampList[0],
    },
    player2: {
      name: names[1],
      assignedChamp: assignedChamps[1],
      key: newChampList[1],
    },
    player3: {
      name: names[2],
      assignedChamp: assignedChamps[2],
      key: newChampList[2],
    },
    player4: {
      name: names[3],
      assignedChamp: assignedChamps[3],
      key: newChampList[3],
    },
    player5: {
      name: names[4],
      assignedChamp: assignedChamps[4],
      key: newChampList[4],
    },
  };

  let myObject = {
    names: assignedChamps,
    keys: keys,
    champs: champs,
  };

  console.log(assignedChamps);

  return myObject2;
});
