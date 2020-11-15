
let store = {
  rovers: ['Curiosity', 'Opportunity', 'Spirit'],
  currentRover: 'Curiosity',
  currentPhotos: []
};

// add our markup to the page
const root = document.getElementById('root');

const updateStore = (store, newState) => {
  const oldState = JSON.stringify(store);
  store = Object.assign(store, newState);

  // Only rerender if state values have changed
  if (oldState === JSON.stringify(store)) return;

  render(root, store);
};

const render = async (root, state) => {
  root.innerHTML = App(state);
};

// Event handlers
const handleClick = (event) => {
  if (store.currentRover === event.target.value) return;

  updateStore(store, {currentRover: event.target.value});
};

// create content
const App = (state) => {
  const { currentPhotos } = state;

  return (
    `
    ${Header()}
    ${Nav(state)}
    <main>
      ${RoverInfo(state)}
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
  getRoverManifest(state);
  const currentPhoto = state.currentPhotos[0];

  if (!currentPhoto) return;

  return (
    `
    <section class = 'rover-info'>
      <h2>${currentPhoto.rover.name}</h2>
      <p>${currentPhoto.rover.launch_date}</p>
      <p>${currentPhoto.rover.landing_date}</p>
      <p>${currentPhoto.rover.status}</p>
    </section>
    `
  );
};

const RoverPhotos = (state) => {
  const { currentPhotos } = state;

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
  let date = '';

  // FIGURE OUT THE CURIOSITY DATE THING--DO A COUPLE DAYS IN THE PAST
  if (currentRover === 'Opportunity') {
    date = '2018-06-11';
  } else if (currentRover === 'Spirit') {
    date = '2010-03-21';
  } else {
    const newDate = new Date();
    date = `${newDate.getFullYear()}-${newDate.getMonth() + 1}-01`;
  }

  fetch(`/${currentRover}/${date}`)
    .then(res => res.json())
    .then(manifest => updateStore(state, { currentPhotos: manifest.images.photos }));
};
