let store = {
  rovers: ['Curiosity', 'Opportunity', 'Spirit'],
  currentRover: '',
  currentManifest: ''
};

// add our markup to the page
const root = document.getElementById('root');

const updateStore = (store, newState) => {
  const oldState = JSON.stringify(store);
  store = Object.assign(store, newState);

  // Only rerender if state values have changed
  if (oldState !== JSON.stringify(store)) {
    render(root, store);
  }
};

const render = async (root, state) => {
  root.innerHTML = App(state);
};

// Event handlers
const handleClick = (event) => {
  if (store.currentRover !== event.target.value) {
    updateStore(store, {currentRover: event.target.value});
  }

  return;
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
      ${state.currentRover && RoverInfo(state)}
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
  const { currentRover, currentManifest } = state;

  if (!currentManifest || currentRover !== currentManifest.manifest.rover.name) {
    getRoverInfo(state);
    return (`<p>loading...</>`);
  }

  console.log(currentRover);
  return (
    `
    <section>
      <h2>${currentManifest.manifest.rover.name}</h2>
      <div>${currentManifest.manifest.rover.launch_date}</div>
      <div>${currentManifest.manifest.rover.landing_date}</div>
      <div>${currentManifest.manifest.rover.status}</div>
    </section>
    `
  );
};


// ------------------------------------------------------  API CALLS

/**
 * API call to backend for requested rover manifest info
 * @param {object} state - The global store object
 */
const getRoverInfo = (state) => {
  const { currentRover } = state;
  console.log(currentRover);

  fetch(`/${currentRover}`)
    .then(res => res.json())
    .then(currentManifest => updateStore(state, { currentManifest }));
};
