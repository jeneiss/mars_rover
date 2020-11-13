let store = {
  rovers: ['Curiosity', 'Opportunity', 'Spirit'],
  currentRover: 'Curiosity',
  currentManifest: '',
  currentPhotos: []
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
  const { currentManifest, currentPhotos } = state;

  getRoverManifest(state);
  if (currentManifest) getRoverPhotos(state);

  return (
    `
    ${Header()}
    ${Nav(state)}
    <main>
      ${currentManifest && RoverInfo(state)}
      ${currentPhotos && RoverPhotos(state)}
    </main>
    <footer></footer>
    `
  );
};

// listening for load event because page should load before any JS is called
window.addEventListener('load', () => {
  render(root, store);
});

//COMPONENTS

const Header = () => {
  return (
    `
    <header>
      <h1>Mars Rover</h1>
    </header>
    `
  );
};

const Nav = (state) => {
  const { rovers } = state;

  const buttons = rovers.map((rover, index) => {
    return (
      `
      <button
        type=button
        value=${rover}
        key=${index}
        onclick=handleClick(event)
      >
        ${rover}
      </button>
      `
    );
  }).join('');

  return (
    `
    <nav>
      <ul>
        ${buttons}
      </ul>
    </nav>
    `
  );
};

const RoverInfo = (state) => {
  const { currentManifest } = state;

  return (
    `
    <section class = 'rover-info'>
      <h2>${currentManifest.manifest.rover.name}</h2>
    </section>
    `
  );
};

const RoverPhotos = (state) => {
  let { currentPhotos } = state;

  const tenPhotos = currentPhotos.slice(0, 10).map((photo, index) => {
    return (
      `
      <div>
        <img
          src='${photo.img_src}'
          key=${index}
        />
      </div>
      `
    );

  }).join('');

  return (
    `
    <section class='rover-photos'>
      ${tenPhotos}
    </section>
    `
  );
};

//API CALLS
const getRoverManifest = (state) => {
  const { currentRover } = state;

  fetch(`/${currentRover}`)
    .then(res => res.json())
    .then(currentManifest => updateStore(state, { currentManifest }));
};

const getRoverPhotos = (state) => {
  const { currentRover, currentManifest } = state;

  fetch(`/${currentRover}/${currentManifest.manifest.rover.max_date}`)
    .then(res => res.json())
    .then(photos => updateStore(state, { currentPhotos: photos.images.photos}));
};
