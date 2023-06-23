const deleteForms = document.querySelectorAll('#delete-form');
const confirmButton = document.querySelector("#modal-confirm")
const cancelButton = document.querySelector("#modal-cancel")
const modal = document.querySelector("#modal")
const modalMessage = document.querySelector("#modal-message")
const overlay = document.querySelector("#overlay")

deleteForms.forEach((deleteForm) => {
    const deleteButton = deleteForm.querySelector('button[type="submit"]')
    deleteButton.addEventListener('click', (event) => {
        event.preventDefault();
        // display your modal here
        let message = "Are you sure you want to delete this entry?"
        modalMessage.textContent = message;
        modal.style.display = 'block';
        overlay.style.display = "block";
        document.body.style.overflowY = "hidden"
    });
    confirmButton.addEventListener("click", () => {
        deleteForm.submit()
    })
})

// if the user confirms the deletion, you can submit the form by calling deleteForm.submit()

cancelButton.addEventListener("click", () => {
    modal.style.display = 'none';
    overlay.style.display = "none";
    document.body.style.overflowY = "auto"
})