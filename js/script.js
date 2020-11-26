const remove = document.querySelectorAll('.table-remove');

for (const [index, remove_row] of remove.entries()) {
  remove_row.addEventListener('click', () => {
    console.log(remove_row);
    console.log(document.querySelectorAll('tbody > tr')[index].remove());
  });
}
