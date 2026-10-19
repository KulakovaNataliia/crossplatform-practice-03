const listButton = document.getElementById('list-directory');
const selectButton = document.getElementById('select-directory');
const directoryList = document.getElementById('directory-entries');
const directoryPath = document.getElementById('directory-path');
let currentDirectory = '.';

function setBusy(busy) {
  listButton.disabled = busy;
  selectButton.disabled = busy;
}

function renderEntries(entries) {
  const items = entries.map(entry => {
    const item = document.createElement('li');
    item.textContent = entry.isDir ? `[Каталог] ${entry.name}` : entry.name;
    if (entry.isDir) item.classList.add('directory');
    return item;
  });
  if (items.length === 0) {
    const item = document.createElement('li');
    item.textContent = 'Каталог пуст.';
    items.push(item);
  }
  directoryList.replaceChildren(...items);
}

function showError(error) {
  const item = document.createElement('li');
  item.textContent = `Не удалось прочитать каталог: ${error.message}`;
  item.setAttribute('role', 'alert');
  directoryList.replaceChildren(item);
}

async function showDirectory(dir) {
  const entries = await window.api.listDir(dir);
  currentDirectory = dir;
  directoryPath.textContent = `Каталог: ${dir}`;
  renderEntries(entries);
}

listButton.addEventListener('click', async () => {
  setBusy(true);
  try {
    await showDirectory(currentDirectory);
  } catch (error) {
    showError(error);
  } finally {
    setBusy(false);
  }
});

selectButton.addEventListener('click', async () => {
  setBusy(true);
  try {
    const dir = await window.api.selectDirectory();
    if (dir !== null) await showDirectory(dir);
  } catch (error) {
    showError(error);
  } finally {
    setBusy(false);
  }
});
