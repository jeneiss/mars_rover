let store = {
  rovers: ['Curiosity', 'Opportunity', 'Spirit'],
  currentRover: '',
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
  const { currentRover } = state;

  const fullContent = (
    `
    <div class='app'>
      ${Header()}
      ${Nav(state)}
      <main>
        ${currentRover && RoverInfo(state)}
        ${currentRover && RoverPhotos(state)}
      </main>
      <footer></footer>
    </div>
    `
  );

  const preContent = (
    `
    <div class='app'>
      ${Header()}
      ${Nav(state)}
      <footer></footer>
    </div>
    `
  );

  return currentRover ? fullContent : preContent;
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
      <h1 class='header__title'>Mars Rovers</h1>
    </header>
    `
  );
};

const Nav = (state) => {
  const { rovers } = state;

  const buttons = rovers.map((rover, index) => {
    return (
      `
      <button class='nav__rover-btn'
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
      <ul class='nav__rover-btn-container'>
        ${buttons}
      </ul>
    </nav>
    `
  );
};

const RoverInfo = (state) => {
  getRoverManifest(state);
  const currentPhoto = state.currentPhotos[0];

  if (!currentPhoto) return Loading();

  return (
    `
    <section class='rover-info__container'>
      <h2 class='rover-info__content-title'>${currentPhoto.rover.name}</h2>
      <div class='rover-info__content-text'>Launch date: ${currentPhoto.rover.launch_date}</div>
      <div class='rover-info__content-text'>Landing date: ${currentPhoto.rover.landing_date}</div>
      <div class='rover-info__content-text'>Status: ${currentPhoto.rover.status}</div>
    </section>
    `
  );
};

const RoverPhotos = (state) => {
  const { currentPhotos } = state;

  const tenPhotos = currentPhotos.slice(0, 10).map((photo, index) => {
    return (
      `
      <div class='rover-photos__content'>
        <img
          class='rover-photos__content-image'
          src='${photo.img_src}'
          key=${index}
          alt='${photo.rover.name} rover photo'
        />
        <p class='rover-photos__content-text'>Date taken: ${photo.earth_date}</p>
      </div>
      `
    );
  }).join('');

  return (
    `
    <section class='rover-photos__container'>
      ${tenPhotos}
    </section>
    `
  );
};

const Loading = () => {
  return (
    `
    <div class='loading__container'>
      <img class='loading__loader' src='./assets/images/loading.gif' alt='loading' />
    </div>
    `
  );
};

//API CALLS
const getRoverManifest = (state) => {
  const { currentRover } = state;
  let date = '';

  // Hardcode Opp and Spirit's final dates; Curiosity still active so get date a few days before today
  if (currentRover === 'Opportunity') {
    date = '2018-06-11';
  } else if (currentRover === 'Spirit') {
    date = '2010-03-21';
  } else {
    const newDate = new Date();
    date = `${newDate.getFullYear()}-${newDate.getMonth() + 1}-${newDate.getDate() - 2 < 0 ? 30 : newDate.getDate() - 2}`;
  }

  fetch(`/${currentRover}/${date}`)
    .then(res => res.json())
    .then(manifest => updateStore(state, { currentPhotos: manifest.images.photos }));
};
