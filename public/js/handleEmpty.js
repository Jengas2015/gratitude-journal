const form = document.querySelector('form');
const titleInput = document.querySelector('#title');
const modal = document.querySelector('#modal');
const modalMessage = document.querySelector("#modal-message")
const closeButton = document.querySelector('#modal-close');
const overlay = document.querySelector('#overlay');

  form.addEventListener('submit', (event) => {
    const bodyInputValue = CKEDITOR.instances.body.getData();
    if (!titleInput.value || !bodyInputValue) {
      event.preventDefault();
      let message = 'Please fill in the ';
      if (!titleInput.value) {
        message += 'title';
      }
      if (!titleInput.value && !bodyInputValue) {
        message += ' and ';
      }
      if (!bodyInputValue) {
        message += 'body';
      }
      message += ' field';
      if ((!titleInput.value && !bodyInputValue) || (!titleInput.value && bodyInputValue)) {
        message += 's';
      }
      modalMessage.textContent = message;
      modal.style.display = 'block';
      overlay.style.display = "block";
      document.body.style.overflowY="hidden"
    }
  });

  closeButton.addEventListener('click', () => {
    modal.style.display = 'none';
    overlay.style.display = "none";
    document.body.style.overflowY = "auto"
  });