function init(table_heading) {
  const table = document.createElement('table');
  const thead = document.createElement('thead');
  const tbody = document.createElement('tbody');

  table.setAttribute('border', '1');

  const table_heading_dom = table_heading.map((heading) => {
    const th = document.createElement('th');
    th.innerText = heading;
    return th;
  });

  {
    const tr = get_tr();
    tr.append(...table_heading_dom);
    thead.append(tr);
  }

  tbody.addEventListener('keyup', function tbody_keypress_event() {
    update_row(table, tbody);
  });

  table.append(thead, tbody);

  update_row(table, tbody);

  document.getElementById('table').append(table);
}

(async function load_data() {
  const data = (await fetch(`./table_heading.json`)).json();
  data
    .then((response) => {
      init(response);
    })
    .catch((err) => {
      console.log(err);
    });
})();

function get_tr(tbody) {
  return document.createElement('tr');
}

function update_row(table, tbody) {
  const empty_child = table.querySelectorAll('td:empty');

  console.log(empty_child);
  const empty_td_length = table.querySelectorAll('td:empty').length;

  if (empty_td_length == 0) {
    const tr = get_tr();
    const th_length = table.querySelectorAll('th').length;
    const td = Array(th_length)
      .fill()
      .map((ele) => get_td());

    td[0].innerText = tbody.childElementCount + 1;

    tr.append(...td);

    table.querySelector('tbody').append(tr);
  }
}

function get_td() {
  const td = document.createElement('td');
  td.setAttribute('contenteditable', 'true');
  return td;
}
