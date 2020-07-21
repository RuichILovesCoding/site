class MobileMenu {
  constructor() {
    this.menuIcon = document.querySelector(".site-header__menu-icon");
    this.menuContent = document.querySelector(".site-header__menu-content");
    this.siteHeader = document.querySelector(".site-header");
    this.events();
  }
  events() {
    this.menuIcon.addEventListener("click", () => this.toggleTheMenu()); // the arrow function will actually excute the toggleTheMenu function
  }

  toggleTheMenu() {
    this.menuContent.classList.toggle("site-header__menu-content--is-visible"); // add a new css class to the elment or remove the class if it exists
    this.siteHeader.classList.toggle("site-header--is-expanded");
    this.menuIcon.classList.toggle("site-header__menu-icon--close-x");
  }
}

export default MobileMenu;
