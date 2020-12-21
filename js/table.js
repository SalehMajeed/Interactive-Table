class Table {
  constructor() {
    this.config = {
      childList: true,
    };

    this.table_div = document.getElementById('table');
    this.global_search = document.getElementById('global-search');

    this.table = document.createElement('table');
    this.thead = document.createElement('thead');
    this.tbody = document.createElement('tbody');
    this.tfoot = document.createElement('tfoot');

    this.row = '';

    this.search_column = [];

    this.table.setAttribute('border', '1');
    this.table.append(this.thead, this.tfoot, this.tbody);
    this.table_div.append(this.table);

    this.thead.append(this.create_thead());
    this.tbody.append(this.create_tbody());

    this.global_search.addEventListener('keyup', (event) =>
      this.global_searching(event)
    );
    this.tfoot.addEventListener('keyup', (event) => this.search(event));
    this.thead.addEventListener('click', (event) => this.sort_table(event));
    this.tbody.addEventListener('keyup', (event) => this.update_row(event));
  }
  global_searching(event) {
    for (const tr of this.tbody.children) {
      let found = false;
      for (const td of tr.children) {
        if (
          td.innerText
            .toLowerCase()
            .indexOf(event.target.value.toLowerCase()) == 0
        ) {
          found = true;
        }
      }
      if (found == true) {
        tr.style.display = '';
      } else {
        tr.style.display = 'none';
      }
    }
  }

  create_div() {
    const div = document.createElement('div');

    div.style.position = 'absolute';
    div.style.top = 0;
    div.style.right = 0;
    div.style.width = `5px`;
    div.style.height = this.table.offsetHeight + 'px';
    div.style.backgroundColor = 'green';
    return div;
  }

  search(event) {
    const current_column_text = event.target.value;
    const current_column = this.search_column.indexOf(
      event.target.parentElement
    );

    for (const tr of this.tbody.children) {
      const columns_search = tr.children[
        current_column
      ].innerText.toLowerCase();

      if (columns_search.indexOf(current_column_text.toLowerCase()) == 0) {
        tr.style.display = '';
      } else {
        tr.style.display = 'none';
      }
    }
  }

  update_row(event) {
    // event.target.innerText = event.target.innerText.trim();
    const empty_child = this.tbody.querySelectorAll('tr > td:empty').length;
    const current_row = event.target.parentElement;
    const current_row_id = current_row.children[0].innerText;
    const last_row = this.tbody.querySelector('tr:last-child');
    const last_row_id = last_row.children[0].innerText;

    if (empty_child == 0) {
      this.tbody.append(this.create_tbody());
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

      let new_values = [...this.tbody.rows]
        .filter((row) => {
          return (
            row.querySelectorAll('td:empty').length != thead_elements.length - 1
          );
        })
        .sort((a, b) => {
          return a.children[index_value].innerText >
            b.children[index_value].innerText
            ? 1
            : -1;
        });
      new_values = this.tbody.classList.contains('asc')
        ? new_values.reverse()
        : new_values;
      this.tbody.prepend(...new_values);
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

    tr.setAttribute('draggable', 'true');
    tr.append(...td);
    return tr;
  }

  create_thead() {
    const tr = this.get_row_data('tr');
    const search_attributes = {
      type: 'input',
      placeholder: 'Search...',
      class: 'search-input',
    };

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

      const tfoot = this.get_row_data('th');
      const search_input = this.get_row_data('input');

      for (const attr in search_attributes) {
        search_input.setAttribute(attr, search_attributes[attr]);
      }

      this.search_column.push(tfoot);

      tfoot.append(search_input);
      this.tfoot.append(tfoot);

      thead.innerText = th;

      return thead;
    });

    tr.append(...table_heading);

    return tr;
  }
}

document.addEventListener('DOMContentLoaded', new Table());
