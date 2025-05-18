const form = document.querySelector('form');
const heraldry = document.querySelector('#heraldry');
// Better solution to this for static page?
const deviceList = ["img/devices/boar-rampant.png",
                    "img/devices/boars-head-erased.png",
                    "img/devices/bulls-head-cabossed.png",
                    "img/devices/castle-1.png",
                    "img/devices/castle-2.png",
                    "img/devices/castle-3.png",
                    "img/devices/castle-of-three-towers.png",
                    "img/devices/cormorants-head-erased.png",
                    "img/devices/cross-formy.png",
                    "img/devices/cross-formy-fitchy-1.png",
                    "img/devices/cross-formy-fitchy-2.png",
                    "img/devices/crown.png",
                    "img/devices/crown-flory.png",
                    "img/devices/cup.png",
                    "img/devices/dragon-rampant.png",
                    "img/devices/dragon-rampant-inflamed.png",
                    "img/devices/dragon-rampant-regardant.png",
                    "img/devices/dragon-statant.png",
                    "img/devices/eagle.png",
                    "img/devices/estoile.png",
                    "img/devices/fleur-de-lys-1.png",
                    "img/devices/fleur-de-lys-2.png",
                    "img/devices/fleur-de-lys-3.png",
                    "img/devices/fleur-de-lys-4.png",
                    "img/devices/fleur-de-lys-trident-1.png",
                    "img/devices/fleur-de-lys-trident-2.png",
                    "img/devices/goutte.png",
                    "img/devices/green-man.png",
                    "img/devices/griffins-leg-erased.png",
                    "img/devices/griffins-leg-with-hand-erased.png",
                    "img/devices/key.png",
                    "img/devices/lion.png",
                    "img/devices/lion-passant.png",
                    "img/devices/lion-passant-guardant.png",
                    "img/devices/lion-queue-nowed.png",
                    "img/devices/lion-regardant.png",
                    "img/devices/lions-head-cabossed.png",
                    "img/devices/lions-head-jessant-de-lys.png",
                    "img/devices/mace-spiked.png",
                    "img/devices/mourning-drape.png",
                    "img/devices/pegasus-courant.png",
                    "img/devices/pegasus-segreant-1.png",
                    "img/devices/pegasus-segreant-2.png",
                    "img/devices/pegasus-segreant-displayed.png",
                    "img/devices/pegasus-segreant-regardant.png",
                    "img/devices/raven.png",
                    "img/devices/rose-slipped-and-leaved.png",
                    "img/devices/sea-lion-embowed.png",
                    "img/devices/sea-lion-ii.png",
                    "img/devices/sea-lion-iii.png",
                    "img/devices/sea-lion-iv.png",
                    "img/devices/serpent-erect.png",
                    "img/devices/skull.png",
                    "img/devices/stag-head.png",
                    "img/devices/stag-rampant.png",
                    "img/devices/stag-rampant-regardant.png",
                    "img/devices/stags-head-couped.png",
                    "img/devices/stag-trippant.png",
                    "img/devices/sun.png",
                    "img/devices/sun-2.png",
                    "img/devices/sun-rays.png",
                    "img/devices/sword.png",
                    "img/devices/sword-2.png",
                    "img/devices/toad.png",
                    "img/devices/tower.png",
                    "img/devices/trident.png",
                    "img/devices/trident-2.png",
                    "img/devices/unicorn.png",
                    "img/devices/unicorn-passant.png",
                    "img/devices/unicorn-passant-regardant.png",
                    "img/devices/unicorn-rampant-regardant.png",
                    "img/devices/wings-conjoined-in-lure.png",
                    "img/devices/wyvern-erect-inflamed.png",
                    "img/devices/axe.png",
                    "img/devices/balance.png",
                    "img/devices/basilisk-sejant.png",
                    "img/devices/battle-axe.png",
                    "img/devices/boar.png"]

var colours = {
    0: "#d4af34", // or
    1: "#ffffff", // argent
    2: "#3953a4", // azure
    3: "#790000", //gules
    4: "#000000", //sable
    5: "#11671d", // vert
    6: "#dbdbdb" // cendree
}

var shapes = {
    0: "partyPerFess",
    1: "partyPerPale",
    2: "partyPerBendSinister",
    3: "quarterly",
    4: "quarterlyWithHeart",
    5: "chief",
    6: "pale",
    7: "fess",
    8: "bend",
    9: "bendSinister",
    10: "chevron",
    11: "cross",
    12: "saltire",
    13: "pall",
    14: "flaunches",
    15: "pile",
    16: "bordure",
    17: "barry",
    18: "pally",
    19: "bendy",
    20: "chevronny",
    21: "chequy",
    22: "lozengy",
    23: "gyronny"
}

function randomColour() {
    var value = colours[Math.floor(Math.random() * Object.keys(colours).length)];
    return value;
}

const updateHeraldry = () => {
    const device = deviceList[Math.floor(Math.random() * deviceList.length)];
    const colourOne = randomColour();
    const colourTwo = randomColour();
    const shape = shapes[Math.floor(Math.random() * Object.keys(shapes).length)];

    let out = `
      <li>device: <img src="${device}" alt="device" class="heraldry-device"></li>
      <li>colour 1: ${colourOne}</li>
      <li>colour 2: ${colourTwo}</li>
      <li>shape: ${shape}</li>
      `;
    heraldry.innerHTML = out;
  };

updateHeraldry()
form.addEventListener('submit', updateHeraldry);