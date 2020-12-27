class table {
  constructor() {
    this.table_div = document.getElementById('table');
    this.global_search = document.createElement('input');
    this.table = document.createElement('table');
    this.thead = document.createElement('thead');
    this.tbody = document.createElement('tbody');
    this.tfoot = document.createElement('tfoot');

    this.init();

    this.global_search.addEventListener('keyup', (event) =>
      this.global_searching(event)
    );
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

  sort_table(event) {
    this.tbody.classList.toggle('asc');
    const current_column = [...this.thead.firstChild.children].indexOf(
      event.target
    );

    let new_values = [...this.tbody.rows]
      .filter((row) => {
        return (
          row.querySelectorAll('td:empty').length !=
          this.thead.firstChild.childElementCount - 1
        );
      })
      .sort((a, b) => {
        return a.children[current_column].innerText >
          b.children[current_column].innerText
          ? 1
          : -1;
      });
    new_values = this.tbody.classList.contains('asc')
      ? new_values.reverse()
      : new_values;
    this.tbody.prepend(...new_values);
  }

  update_row(event) {
    if (event.code == 'Space' || event.code == 'Tab') return;
    const empty_child = event.target.parentElement.querySelectorAll('td:empty')
      .length;
    const last_row = this.tbody.querySelector('tr:last-child');
    const last_row_child = last_row.querySelectorAll('td:empty').length;
    if (
      empty_child == 0 &&
      this.tbody.querySelectorAll('td:empty').length == 0
    ) {
      this.tbody.append(this.create_tbody());
    }

    if (
      this.tbody.childElementCount > 1 &&
      empty_child > 0 &&
      last_row_child == this.thead.firstChild.childElementCount - 1
    ) {
      console.log(empty_child);
      last_row.remove();
    }
  }

  init() {
    this.global_search.setAttribute('placeholder', 'Search...');
    this.global_search.setAttribute('id', 'global-search');

    this.thead.append(this.create_thead());
    this.tfoot.append(this.create_tfoot());
    this.tbody.append(this.create_tbody());
    this.table.append(this.thead, this.tfoot, this.tbody);
    this.table_div.append(this.global_search, this.table);
  }

  create_element(type) {
    return document.createElement(type);
  }

  create_tbody() {
    const tr = this.create_element('tr');
    const td = Array(this.thead.firstChild.childElementCount)
      .fill()
      .map((each_column) => {
        const td = this.create_element('td');
        td.setAttribute('contenteditable', true);
        return td;
      });
    td[0].innerText = this.tbody.childElementCount + 1;
    td[0].removeAttribute('contenteditable');

    tr.append(...td);
    return tr;
  }

  create_tfoot() {
    const tr = this.create_element('tr');
    const td = Array(this.thead.firstChild.childElementCount)
      .fill()
      .map((each_child) => {
        const th = this.create_element('th');
        const span = this.create_element('span');
        span.setAttribute('contenteditable', 'true');
        span.setAttribute('placeholder', 'Search...');
        span.innerText = 'hello';
        th.append(span);
        return th;
      });

    tr.append(...td);
    return tr;
  }

  create_thead() {
    const tr = this.create_element('tr');
    const table_heading = [
      '#',
      'Name',
      'Address',
      'Mobile Number',
      'Email',
      'Age',
      'Country',
      'City',
    ].map((each_column) => {
      const th = this.create_element('th');
      th.innerHTML = each_column;
      return th;
    });
    tr.append(...table_heading);
    return tr;
  }
}

document.addEventListener('DOMContentLoaded', new table());
