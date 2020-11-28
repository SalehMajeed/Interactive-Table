class Table {
  constructor() {
    const table = document.createElement('table');
    const thead = document.createElement('thead');
    const tbody = document.createElement('tbody');
    const table_div = document.getElementById('table');

    table.append(thead, tbody);
    table_div.append(table);

    thead.append(this.create_thead());

    tbody.append(this.create_tbody(thead.rows[0].childElementCount));
  }

  get_row_data(type) {
    return document.createElement(type);
  }

  create_tbody(child_count) {
    const tr = this.get_row_data('tr');
    const td = Array(child_count)
      .fill()
      .map((each_child) => this.get_row_data('td'));

    tr.append(...td);
    return tr;
  }

  create_thead() {
    const tr = this.get_row_data('tr');

    const table_heading = [
      '#',
      'Name',
      'Address',
      'Mobile Number',
      'Email',
      'Age',
      'Country',
      'City',
    ].map((th) => {
      const thead = this.get_row_data('th');
      thead.innerText = th;
      return thead;
    });

    tr.append(...table_heading);

    return tr;
  }
}

document.addEventListener('DOMContentLoaded', new Table());
