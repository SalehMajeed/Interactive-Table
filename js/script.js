function init() {
  const table_heading = document.querySelector('table > thead > tr');
  const first_item = document.createElement('th');
  load_data();
}

init();

async function load_data() {
  const data = (await fetch(`./table_heading.json`)).json();
  data.then((value) => console.log(value));
}
