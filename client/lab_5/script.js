function filterList(list, query) {
  return list.filter((item) => {
    return item.name.toLowerCase().includes(query.toLowerCase())
  })
}

let currentList = []

async function mainEvent() {
  const form = document.querySelector('.main_form');
  const filterButton = document.querySelector('.filter_button');
  form.addEventListener('submit', async (submitEvent) => {
    submitEvent.preventDefault();
    console.log('Form Submission');
    const formData = new FormData(submitEvent.target);
    const formProps = Object.fromEntries(formData);
    const results = await fetch('https://data.princegeorgescountymd.gov/resource/umjn-t2iz.json');
    currentList = await results.json();
    console.table(currentList);
  });

  form.addEventListener('click', (event) => {
    console.log('Clicked Filter Button');
    const formData = new FormData(form);
    const formProps = Object.fromEntries(formData);
    console.log(formProps)
    const newList = filterList(currentList, formProps.resto)
    console.log(newList)
  });
}

document.addEventListener('DOMContentLoaded', async () => mainEvent());
