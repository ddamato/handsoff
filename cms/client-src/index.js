const tagList = document.querySelector('.tagList');
const filterInput = document.querySelector('.filterInput');
filterInput.addEventListener('input', (ev) => {
  [...tagList.children].forEach((li) => {
    const tagLowerCase = li.dataset.tag.toLowerCase();
    const inputLowerCase = ev.target.value.toLowerCase();
    const exclude = inputLowerCase && !tagLowerCase.startsWith(inputLowerCase);
    li.classList.toggle('exclude', exclude);
  });
});