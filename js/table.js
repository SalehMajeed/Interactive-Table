class Table {
  constructor() {
    this.table_div = document.getElementById('table');
    this.options = document.getElementById('options');
    this.search_input = document.getElementById('search-input');

    this.table = document.createElement('table');
    this.thead = document.createElement('thead');
    this.tbody = document.createElement('tbody');

    this.thead_elements = [];
    this.search_column = null;

    this.table.setAttribute('border', '1');
    this.table.append(this.thead, this.tbody);
    this.table_div.append(this.table);

    this.thead.append(this.create_thead());
    this.tbody.append(this.create_tbody());

    this.table.addEventListener('keyup', (event) => this.update_row(event));
    this.table.addEventListener('click', (event) => this.sort_table(event));
    this.options.addEventListener('click', (event) => this.get_column(event));
    this.search_input.addEventListener('keyup', (event) => this.search(event));
  }

  search(event) {
    for (const tr of this.tbody.children) {
      const columns_search = tr.children[
        this.search_column
      ].innerText.toLowerCase();
      if (columns_search.indexOf(this.search_input.value.toLowerCase()) == 0) {
        tr.style.display = '';
      } else {
        tr.style.display = 'none';
      }
    }
  }

  get_column(event) {
    this.search_column = this.thead_elements.indexOf(event.target.value);
  }

  update_row(event) {
    event.target.textContent = event.target.textContent.trim();
    const empty_child = this.tbody.querySelectorAll('tr > td:empty').length;
    const current_row = event.target.parentElement;
    const current_row_id = current_row.children[0].textContent;
    const last_row = this.tbody.querySelector('tr:last-child');
    const last_row_id = last_row.children[0].textContent;

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
  sort_table(event) {
    const thead_elements = Array.from(
      document.querySelector('thead > tr').children
    );
    if (thead_elements.includes(event.target)) {
      this.tbody.classList.toggle('asc');
      const index_value = Array.prototype.indexOf.call(
        event.target.parentElement.children,
        event.target
      );

      let new_values = [...this.tbody.rows].sort((a, b) =>
        a.children[index_value].innerText > b.children[index_value].innerText
          ? 1
          : -1
      );
      new_values = this.tbody.classList.contains('asc')
        ? new_values.reverse()
        : new_values;
      this.tbody.append(...new_values);
    }
  }

  get_row_data(type) {
    return document.createElement(type);
  }

  create_tbody() {
    const child_count = this.thead.querySelector('tr').childElementCount;
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

      const option = this.get_row_data('option');
      option.innerText = th;
      this.options.append(option);

      thead.innerText = th;

      this.thead_elements.push(th);
      return thead;
    });

    tr.append(...table_heading);

    return tr;
  }
}

document.addEventListener('DOMContentLoaded', new Table());
