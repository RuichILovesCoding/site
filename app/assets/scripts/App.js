import "../styles/styles.css";
import MobileMenu from "../scripts/modules/MobileMenu";
import RevealOnScroll from "../scripts/modules/RevealOnScroll";
// accept the hot module updates
if (module.hot) {
  module.hot.accept();
}

let mobileMenu = new MobileMenu();

// create a reusable class
new RevealOnScroll(document.querySelectorAll(".feature-item"), 75);
new RevealOnScroll(document.querySelectorAll(".testimonial"), 65);
