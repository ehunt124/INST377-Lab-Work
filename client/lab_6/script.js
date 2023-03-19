function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min); // The maximum is inclusive and the minimum is inclusive
}

function injectHTML(list) {
  console.log('fired injectHTML');
  const target = document.querySelector('#restaurant_list');
  target.innerHTML = '';
  list.forEach((item, index) =>{
    target.innerHTML += `<li>${item.name}</li>`;
  });
}

function filterList(list, query) {
  return list.filter((item) => {
    return item.name.toLowerCase().includes(query.toLowerCase())
  })
}

function cutRestaurantList(list) {
  console.log("fired cutRestaurantList");
  const range = [...Array(15).keys()];
  return newArray = range.map((item) => {
    const index = getRandomIntInclusive(0, list.length - 1);
    return list[index]
  })
}

let currentList = []

async function mainEvent() {
  const form = document.querySelector('.main_form');
  const dataLoadButton = document.querySelector('#data_load');
  const filterButton = document.querySelector('#filter');
  const generateButton = document.querySelector('#generate');
  const loadAnimation = document.querySelector('#load_animation')

  loadAnimation.style.display = 'none'

  dataLoadButton.addEventListener('click', async (event) => {
    console.log('Load data');
    loadAnimation.style.display = 'inline-block'
    const results = await fetch('https://data.princegeorgescountymd.gov/resource/umjn-t2iz.json');
    currentList = await results.json();
    loadAnimation.style.display = 'none'
    console.table(currentList);
    injectHTML(currentList)
  });

  filterButton.addEventListener('click', (event) => {
    console.log('Clicked Filter Button');
    const formData = new FormData(form);
    const formProps = Object.fromEntries(formData);
    console.log(formProps)
    const newList = filterList(currentList, formProps.resto)
    console.log(newList)
    injectHTML(newList)
  });

  generateButton.addEventListener('click', (event) => {
    console.log('Generate new list');
    const resturantList = cutRestaurantList(currentList);
    console.log(resturantList)
    injectHTML(resturantList)
  })
}

document.addEventListener('DOMContentLoaded', async () => mainEvent());