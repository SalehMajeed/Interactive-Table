class Table {
  constructor() {
    this.table = document.createElement('table');
    this.thead = document.createElement('thead');
    this.tbody = document.createElement('tbody');
    this.table_div = document.getElementById('table');

    this.table.setAttribute('border', '1');
    this.table.append(this.thead, this.tbody);
    this.table_div.append(this.table);

    this.thead.append(this.create_thead());

    this.tbody.append(this.create_tbody(this.thead.rows[0].childElementCount));

    table.addEventListener('keyup', (event) => this.update_row(event));
  }

  get_row_data(type) {
    return document.createElement(type);
  }

  create_tbody(child_count) {
    const tr = this.get_row_data('tr');
    const td = Array(child_count)
      .fill()
      .map((each_child) => {
        const td = this.get_row_data('td');
        td.setAttribute('contenteditable', 'true');
        return td;
      });
    td[0].innerText = this.tbody.childElementCount + 1;
    td[0].removeAttribute('contenteditable');

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

  update_row(event) {
    event.target.textContent = event.target.textContent.trim();
    const empty_child = this.tbody.querySelectorAll('tr > td:empty').length;
    const current_row = event.target.parentElement;
    const current_row_id = current_row.children[0].innerText;
    const last_row = this.tbody.querySelector('tr:last-child');
    const last_row_id = last_row.children[0].innerText;

    if (empty_child == 0) {
      this.tbody.append(
        this.create_tbody(this.thead.rows[0].childElementCount)
      );
    }

    if (
      current_row_id < last_row_id &&
      current_row.querySelectorAll('td:empty').length > 0 &&
      last_row.querySelectorAll('td:empty').length ==
        this.thead.rows[0].childElementCount - 1
    ) {
      this.tbody.querySelector('tr:last-child').remove();
    }
  }
}

document.addEventListener('DOMContentLoaded', new Table());
