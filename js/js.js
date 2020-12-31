class table {
  constructor() {
    this.table_div = document.getElementById('table');
    this.global_search = document.createElement('input');
    this.table = document.createElement('table');
    this.thead = document.createElement('thead');
    this.tbody = document.createElement('tbody');
    this.tfoot = document.createElement('tfoot');

    this.init();
    this.change_height();
    this.obeser_change();

    this.global_search.addEventListener('keyup', (event) =>
      this.global_searching(event)
    );

    this.table.addEventListener('mousedown', (event) => this.mouse_down(event));
    this.thead.addEventListener('click', (event) => this.sort_table(event));
    this.tfoot.addEventListener('keyup', (event) =>
      this.search_by_column(event)
    );
    this.tbody.addEventListener('keyup', (event) => this.update_row(event));
    this.tbody.addEventListener('focusout', (event) => this.trimmed_row(event));
  }

  mouse_down(event) {
    if (event.srcElement.className == 'resize-column') {
      let event_elements = {
        pagex: null,
        cur_col: null,
        next_col: null,
        cur_col_width: null,
        next_col_width: null,
      };
      event_elements.cur_col = event.target.parentElement;
      event_elements.next_col = event_elements.cur_col.nextElementSibling;
      event_elements.pagex = event.pageX;
      event_elements.cur_col_width = event_elements.cur_col.offsetWidth;
      if (event_elements.next_col) {
        event_elements.next_col_width = event_elements.next_col.offsetWidth;
      }

      document.addEventListener('mousemove', (event) =>
        this.mouse_move({ event, event_elements, type: 'resize' })
      );
      document.addEventListener('mouseup', (event) =>
        this.mouse_up({ event, event_elements, type: 'resize' })
      );
    }
  }

  mouse_move({ event, event_elements, type }) {
    if (type == 'resize') {
      if (event_elements.cur_col) {
        const diffx = event.pageX - event_elements.pagex;

        if (event_elements.next_col) {
          event_elements.next_col.style.width =
            event_elements.next_col_width - diffx + 'px';
        }

        event_elements.cur_col.style.width =
          event_elements.cur_col_width + diffx + 'px';
      }
    }
  }
  mouse_up({ event, event_elements, type }) {
    if (type == 'resize') {
      for (const elements in event_elements) {
        delete event_elements[elements];
      }

      // document.removeEventListener('mousedown', this.mouse_down);
      // document.removeEventListener('mousemove', this.mouse_move)
      // document.removeEventListener('mouseup', this.mouse_up);
    }
  }

  trimmed_row(event) {
    event.target.innerText = event.target.innerText.trim();
  }

  obeser_change() {
    const change = new MutationObserver(this.change_height);
    change.observe(this.tbody, { childList: true });
  }

  change_height() {
    const div = document.getElementsByClassName('resize-column');
    for (const div_height of div) {
      div_height.style.height = `${
        document.querySelector('table').clientHeight
      }px`;
    }
  }

  search_by_column(event) {
    if (event.srcElement.localName == 'input') {
      const column_index = [...this.tfoot.firstElementChild.children].indexOf(
        event.target.parentElement
      );

      const len = this.tbody.childElementCount;
      for (const tr of this.tbody.children) {
        const column_text = tr.children[column_index].innerText
          .trim()
          .toLowerCase();
        const search_string = event.target.value.trim().toLowerCase();
        if (column_text.indexOf(search_string) == 0) {
          tr.style.display = '';
        } else {
          tr.style.display = 'none';
        }
      }
    }
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
          break;
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
    if (event.code == 'Space' || event.code == 'Tab') {
      return;
    }

    const current_row = event.target.parentElement;
    const last_row = this.tbody.querySelector('tr:last-child');
    const last_row_child = last_row.querySelectorAll('td:empty').length;

    if (this.tbody.querySelectorAll('td:empty').length == 0) {
      this.tbody.append(this.create_tbody());
    }

    if (
      this.tbody.childElementCount > 1 &&
      current_row.querySelectorAll('td:empty').length > 0 &&
      last_row_child == current_row.childElementCount - 1
    ) {
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
        const span = this.create_element('input');
        span.setAttribute('placeholder', 'Search...');
        span.style.width = `55px`;
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

      const div = document.createElement('div');
      div.classList.add('resize-column');
      th.append(div);
      th.style.position = 'relative';

      return th;
    });
    tr.append(...table_heading);
    return tr;
  }
}

document.addEventListener('DOMContentLoaded', new table());
