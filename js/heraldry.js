const form = document.querySelector('form');
const heraldry = document.querySelector('#heraldry');

const updateHeraldry = () => {
    window.localStorage.setItem(
        'heraldryConfig',
        JSON.stringify(config)
    );
    let out = '';
    for (t of Object.keys(config)) {
        out += `
      <li>
          ${t}: ${config[t]}
      </li>`;
    }
    heraldry.innerHTML = out;
  };

let config = window.localStorage.getItem('heraldryConfig') ?
    JSON.parse(window.localStorage.getItem('heraldryConfig')) : {
        "shape" : "shape test",
        "colours": ["colour1", "colour2"],
        "device": "device"
    };
updateHeraldry(config)
form.addEventListener('submit', updateHeraldry);