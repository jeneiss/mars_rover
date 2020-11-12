let store = {
  rovers: ['Curiosity', 'Opportunity', 'Spirit'],
  currentRover: '',
  currentManifest: {},
  images: {}
};

// add our markup to the page
const root = document.getElementById('root');

const updateStore = (store, newState) => {
  store = Object.assign(store, newState);
  render(root, store);
};

const render = async (root, state) => {
  root.innerHTML = App(state);
};

// Event handlers
const handleClick = (event) => {
  updateStore(store, {currentRover: event.target.value});
  console.log('clicked');
  console.log(store.currentRover);
};

// create content
const App = (state) => {
  return (
    `
    <header>
      <h1>Mars Rovers</h1>
    </header>
    <main>
      <section>
        <div>
          <ul>
            ${Button(state)}
          </ul>
        </div>
      </section>
      <section>
        ${RoverInfo(state)}
      </section>
    </main>
    <footer></footer>
  `
  );
};

// listening for load event because page should load before any JS is called
window.addEventListener('load', () => {
  render(root, store);
});

// ------------------------------------------------------  COMPONENTS

const Button = (state) => {
  const { rovers } = state;

  return rovers.map((rover, index) => {
    return (
      `
      <button type=button value=${rover} key=${index} onclick=handleClick(event)>
        ${rover}
      </button>
      `
    );
  }).join('');
};



const RoverInfo = (state) => {

  return (
    `
    `
  );
};


// ------------------------------------------------------  API CALLS

/**
 * API call to backend for requested rover manifest info
 * @param {object} state - The global store object
 * @returns {object} - API manifest data
 */
const getRoverInfo = (state) => {
  const { currentRover } = state;

  return fetch(`http://localhost:3000/manifest/${currentRover}`)
    .then(res => res.json())
    .then(currentManifest => updateStore(store, { currentManifest }));
};
