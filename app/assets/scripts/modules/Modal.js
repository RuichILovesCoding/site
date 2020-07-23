class Modal {
  constructor() {
    // the order matters, we need to inject html first then we can monitor the html element
    this.injectHTML();
    this.openModalBtns = document.querySelectorAll(".open-modal");
    this.modal = document.querySelector(".modal");
    this.closeIcon = document.querySelector(".modal__close");
    this.events();
  }

  events() {
    // listen for open click, el for element. e for event
    this.openModalBtns.forEach(el =>
      el.addEventListener("click", e => this.openTheModal(e))
    );
    // listen for close click
    this.closeIcon.addEventListener("click", () => this.closeTheModal());
    // push any key, e for event, means which key you press
    document.addEventListener("keyup", e => this.keyPressHandler(e));
  }

  openTheModal(e) {
    // prevent the default click event behaviour
    e.preventDefault();
    // then open the modal
    this.modal.classList.add("modal--is-visible");
  }

  closeTheModal() {
    this.modal.classList.remove("modal--is-visible");
  }
  // only the key is the escape key, then we want to close the modal
  keyPressHandler(e) {
    if (e.keyCode == 27) {
      this.closeTheModal();
    }
  }

  injectHTML() {
    document.body.insertAdjacentHTML(
      "beforeend",
      `
      <div class="modal">
      <div class="modal__inner">
        <h2 class="section-title section-title--blue section-title--less-margin"><img src="assets/images/icons/mail.svg" class="section-title__icon"> Get in <strong>Touch</strong></h2>
        <div class="wrapper wrapper--narrow">
          <p class="modal__description">We will have an online order system in place soon. Until then, connect with us on any of the platforms below!</p>
        </div>

        <div class="social-icons">
          <a href="#" class="social-icons__icon"><img src="assets/images/icons/facebook.svg" alt="Facebook"></a>
          <a href="#" class="social-icons__icon"><img src="assets/images/icons/twitter.svg" alt="Twitter"></a>
          <a href="#" class="social-icons__icon"><img src="assets/images/icons/instagram.svg" alt="Instagram"></a>
          <a href="#" class="social-icons__icon"><img src="assets/images/icons/youtube.svg" alt="YouTube"></a>
        </div>
      </div>
      <div class="modal__close">X</div>
    </div>
      `
    );
  }
}

export default Modal;
