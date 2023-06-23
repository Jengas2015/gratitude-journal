const form = document.querySelector('form');
const titleInput = document.querySelector('#title');
const bodyInput = document.querySelector("#body")
const modal = document.querySelector('#modal');
const modalMessage = document.querySelector("#modal-message")
const closeButton = document.querySelector('#modal-close');
const overlay = document.querySelector('#overlay');

  form.addEventListener('submit', (event) => {
    if (!titleInput.value || !bodyInput.value) {
      event.preventDefault();
      let message = 'Please fill in the ';
      if (!titleInput.value) {
        message += 'title';
      }
      if (!titleInput.value && !bodyInput.value) {
        message += ' and ';
      }
      if (!bodyInput.value) {
        message += 'body';
      }
      message += ' field';
      if ((!titleInput.value && !bodyInput.value) || (!titleInput.value && bodyInput.value)) {
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