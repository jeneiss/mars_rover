let store = {
  apod: '',
  rovers: ['Curiosity', 'Opportunity', 'Spirit'],
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


// create content
const App = (state) => {
  const { apod } = state;

  return `
    <header>
      <h1>Mars Rovers</h1>
    </header>
    <main>
      <section>
        <div>
          <ul>
            ${Button(store)}
          </ul>
        </div>
        ${ImageOfTheDay(apod)}
      </section>
    </main>
    <footer></footer>
  `;
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
      <button type=button value=${rover} key=${index}>
        ${rover}
      </button>
      `
    );
  }).join('');
};

// Example of a pure function that renders infomation requested from the backend
const ImageOfTheDay = (apod) => {

  // If image does not already exist, or it is not from today -- request it again
  const today = new Date();
  const photodate = new Date(apod.date);
  // console.log(photodate.getDate(), today.getDate());

  // console.log(photodate.getDate() === today.getDate());
  if (!apod || apod.date === today.getDate() ) {
    getImageOfTheDay(store);
  }

  getImages(store);

  // check if the photo of the day is actually type video!
  if (apod.media_type === 'video') {
    return (`
      <p>See today's featured video <a href='${apod.url}'>here</a></p>
      <p>${apod.title}</p>
      <p>${apod.explanation}</p>
    `);
  } else {
    return (`
      <img src='${apod.image.url}' height='350px' width='100%' />
      <p>${apod.image.explanation}</p>
    `);
  }
};

// ------------------------------------------------------  API CALLS

// Example API call
const getImageOfTheDay = (state) => {
  let { apod } = state;

  fetch('http://localhost:3000/apod')
    .then(res => res.json())
    .then(apod => updateStore(store, { apod }));

  return;
};

const getImages = (state) => {
  fetch('http://localhost:3000/curiosity/2020-11-01')
    .then(res => console.log(res.json()));

  // return data;
};
