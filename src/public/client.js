// Global state container
let store = Immutable.fromJS({
  rovers: ['Curiosity', 'Opportunity', 'Spirit'],
  currentRover: '',
  currentPhotos: []
});

// Add markup to the page
const root = document.getElementById('root');

/**
 * @description Update store with new state information and rerenders to DOM
 * @param {object} - store
 * @param {object} - new state information
 */
const updateStore = (store, newState) => {
  const oldState = JSON.stringify(store);
  store = store.merge(newState);

  // Only rerender if state values have changed
  if (oldState === JSON.stringify(store)) return;

  render(root, store);
};

/**
 * @description Update DOM with store
 * @param {object} - DOM element with ID of 'root'
 * @param {object} - store
 */
const render = async (root, state) => {
  root.innerHTML = App(state);
};

/**
 * @description Click event handler for nav buttons
 * @param {object} - Event object
 */
const handleClick = (event) => {
  if (store.currentRover === event.target.value) return;

  updateStore(store, {currentRover: event.target.value});
};

/**
 * @description App component
 * @param {object} - store
 * @returns {string} - HTML with base App elements
 */
const App = (state) => {
  const currentRover = state.get('currentRover');

  const fullContent = (
    `
    <div class='app'>
      ${Header()}
      ${Nav(state)}
      <main>
        ${currentRover && RoverInfo(state)}
        ${currentRover && RoverPhotos(state)}
      </main>
      ${Footer()}
    </div>
    `
  );

  const preContent = (
    `
    <div class='app'>
      ${Header()}
      ${Nav(state)}
      ${Precontent()}
      ${Footer()}
    </div>
    `
  );

  return currentRover ? fullContent : preContent;
};

// listening for load event because page should load before any JS is called
window.addEventListener('load', () => {
  render(root, store);
});

/* -----COMPONENTS----- */
/**
 * @description Header component
 * @param {object} - store
 * @returns {string} - HTML with header elements
 */
const Header = () => {
  return (
    `
    <header>
      <h1 class='header__title'>Mars Rovers</h1>
    </header>
    `
  );
};

/**
 * @description Nav component
 * @param {object} - store
 * @returns {string} - HTML with Nav buttons
 */
const Nav = (state) => {
  const rovers = state.get('rovers');

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

/**
 * @description RoverInfo component calls getRoverManifest() to access NASA API info
 * @param {object} - store
 * @returns {string} - HTML with Rover manifest info
 */
const RoverInfo = (state) => {
  getRoverManifest(state);
  const currentPhoto = state.getIn(['currentPhotos', 0]);

  if (!currentPhoto) return Loading();

  return (
    `
    <section class='rover-info__container'>
      <h2 class='rover-info__content-title'>${currentPhoto.getIn(['rover', 'name'])}</h2>
      <div class='rover-info__content-text'>Launch date: ${currentPhoto.getIn(['rover', 'launch_date'])}</div>
      <div class='rover-info__content-text'>Landing date: ${currentPhoto.getIn(['rover', 'landing_date'])}</div>
      <div class='rover-info__content-text'>Status: ${currentPhoto.getIn(['rover', 'status'])}</div>
    </section>
    `
  );
};

/**
 * @description RoverPhotos component selects latest 10 photos from currentPhotos
 * @param {object} - store
 * @returns {string} - HTML string with latest 10 Rover photos
 */
const RoverPhotos = (state) => {
  const currentPhotos = state.get('currentPhotos');

  const tenPhotos = currentPhotos.slice(0, 10).map((photo, index) => {
    return (
      `
      <div class='rover-photos__content'>
        <img
          class='rover-photos__content-image'
          src='${photo.get('img_src')}'
          key=${index}
          alt='${photo.getIn('rover', 'name')} rover photo'
        />
        <p class='rover-photos__content-text'>Date taken: ${photo.get('earth_date')}</p>
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

/**
 * @description Precontent component
 * @param {object} - store
 * @returns {string} - HTML string with Precontent instructions
 */
const Precontent = () => {
  return (
    `
    <div class='precontent__container'>
      <div class='precontent__text'>Select a rover to access its manifest and most recent photos.</div>
    </div>
    `
  );
};

/**
 * @description Loading component
 * @param {object} - store
 * @returns {string} - HTML string with loading gif
 */
const Loading = () => {
  return (
    `
    <div class='loading__container'>
      <img class='loading__loader' src='./assets/images/loading.gif' alt='loading' />
    </div>
    `
  );
};

/**
 * @description Footer component
 * @param {object} - store
 * @returns {string} - HTML string with footer text
 */
const Footer = () => {
  return (
    `
    <footer class='footer__container'>
      <div class='footer__content'>All information courtesy of NASA Open APIs</div>
    </footer>
    `
  );
};

/* -----API CALLS----- */
/**
 * @description Accesses NASA API json from backend with appropriate max_date for latest photos and updates store
 * @param {object} - store
 */
const getRoverManifest = (state) => {
  const currentRover = state.get('currentRover');
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
