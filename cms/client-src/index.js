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

function initSimpleMDE() {
  const simplemde = new SimpleMDE({ element: document.querySelector('.editor'), autosave: true });
  if (simplemde) {
    simplemde.codemirror.on("change", () => {
      const { pathname } = window.location;
      updateDatabase(`cms-api${pathname}`, simplemde.value());
    });
  }
}
initSimpleMDE();


function updateDatabase(url, value) {
  const body = { value };
  fetch(url, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json'
    }
  }).then((res) => res.json()).then((data) => console.log(data));
}

const buildButton = document.querySelector('.buildButton');
buildButton.addEventListener('click', () => {
  fetch('cms-compile')
    .then(async (res) => {
      const data = await res.json();
      console.info(JSON.stringify(data));
      const visit = confirm('Successfully built, would you like to visit the site?');
      if (visit) {
        fetch('cms-visit');
      } else {
        window.location.reload();
      }
    });
});