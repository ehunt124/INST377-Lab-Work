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
      return item.name.toLowerCase().includes(query.toLowerCase());
    });
  }
  
  function cutRestaurantList(list) {
    console.log("fired cutRestaurantList");
    const range = [...Array(15).keys()];
    return newArray = range.map((item) => {
      const index = getRandomIntInclusive(0, list.length - 1);
      return list[index];
    });
  }

  function initMap() {
    const carto = L.map('map').setView([38.989697, -76.937759], 13);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(carto);
    return carto;
  }

  function markerPlace(array, map) {
    console.log('array for marker', array)
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        layer.remove();
      }
    });
    array.forEach((item) => {
      console.log('markerPlace', item);
      if (item.hasOwnProperty('geocoded_column_1')) {
        const {coordinates} = item.geocoded_column_1;
        L.marker([coordinates[1], coordinates[0]]).addTo(map);
      }
    });
    // Fly to first element that has a coordinate in the list
    for (let i = 0; i < array.length; i++) { 
      if (array[i].hasOwnProperty('geocoded_column_1')) {
        map.flyTo([array[i].geocoded_column_1.coordinates[1], array[i].geocoded_column_1.coordinates[0]]);
        break;
      }
    }
  }
  
  async function mainEvent() {
    const form = document.querySelector('.main_form');
    const dataLoadButton = document.querySelector('#data_load');
    const dataClearButton = document.querySelector('#data_clear');
    const generateButton = document.querySelector('#generate');
    const textField = document.querySelector("#resto");

    const loadAnimation = document.querySelector('#load_animation');
    loadAnimation.style.display = 'none';
    generateButton.classList.add('hidden');

    const carto = initMap();
    
    let storedData = JSON.parse(localStorage.getItem('storedData'));
    if(storedData?.length > 0) {
      generateButton.classList.remove('hidden');
    }
    
    let currentList = [];

    dataLoadButton.addEventListener('click', async (submitEvent) => {
      console.log('Load data');
      loadAnimation.style.display = 'inline-block';
      const results = await fetch('https://data.princegeorgescountymd.gov/resource/umjn-t2iz.json');
      const storedList = await results.json();
      localStorage.setItem('storedData', JSON.stringify(storedList));
      storedData = storedList;
      if(storedData?.length > 0) {
        generateButton.classList.remove('hidden');
      }
      loadAnimation.style.display = 'none';
      console.log(storedList);
    });

    dataClearButton.addEventListener('click', (event) => {
      console.log('clear browser data');
      localStorage.clear();
      generateButton.classList.add('hidden');
      console.log('localStorage Check', localStorage.getItem('storedData'));
    });
  
    generateButton.addEventListener('click', (event) => {
      console.log('Generate new list');
      currentList = cutRestaurantList(storedData);
      console.log(currentList);
      injectHTML(currentList);
      markerPlace(currentList, carto);
    });

    textField.addEventListener('input', (event) => {
        console.log('input', event.target.value);
        const newList = filterList(currentList, event.target.value);
        console.log(newList);
        injectHTML(newList);
        markerPlace(newList, carto);
    });
  }
  
  document.addEventListener('DOMContentLoaded', async () => mainEvent());