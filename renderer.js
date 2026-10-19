const listButton = document.getElementById('list-directory');
const directoryList = document.getElementById('directory-entries');

listButton.addEventListener('click', async () => {
  listButton.disabled = true;
  directoryList.replaceChildren();

  try {
    const entries = await window.api.listDir('.');
    const items = entries.map(entry => {
      const item = document.createElement('li');
      item.textContent = entry.isDir ? `[Каталог] ${entry.name}` : entry.name;
      if (entry.isDir) item.classList.add('directory');
      return item;
    });
    directoryList.replaceChildren(...items);
  } catch (error) {
    const item = document.createElement('li');
    item.textContent = `Не удалось прочитать каталог: ${error.message}`;
    item.setAttribute('role', 'alert');
    directoryList.replaceChildren(item);
  } finally {
    listButton.disabled = false;
  }
});
