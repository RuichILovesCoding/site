import throttle from "lodash/throttle";
import debounce from "lodash/debounce";
class StickyHeader {
  constructor() {
    this.siteHeader = document.querySelector(".site-header");
    this.pageSections = document.querySelectorAll(".page-section");
    this.browserHeight = window.innerHeight;
    this.previousScrollY = window.scrollY;
    this.events();
  }

  events() {
    window.addEventListener(
      "scroll",
      throttle(() => this.runOnScroll(), 200)
    );
    window.addEventListener(
      "resize",
      debounce(() => {
        console.log("Resize just ran");
        this.browserHeight = window.innerHeight;
      }, 333)
    );
  }

  runOnScroll() {
    this.determineScrollDirection();

    if (window.scrollY > 60) {
      this.siteHeader.classList.add("site-header--dark");
    } else {
      this.siteHeader.classList.remove("site-header--dark");
    }
    // calculate if the current element is scrolled to
    this.pageSections.forEach(el => this.calcSection(el));
  }

  calcSection(el) {
    // see the top edge of the element & above the bottom edge of the element
    if (
      window.scrollY + this.browserHeight > el.offsetTop &&
      window.scrollY < el.offsetTop + el.offsetHeight
    ) {
      let scrollPercent =
        (el.getBoundingClientRect().y / this.browserHeight) * 100;
      // scrolling down the page
      if (
        (scrollPercent < 18 &&
          scrollPercent > -0.1 &&
          this.scrollDirection == "down") ||
        (scrollPercent < 33 && this.scrollDirection == "up")
      ) {
        // the page section element data matching link points to the link in the header
        let matchingLink = el.getAttribute("data-matching-link");
        document
          .querySelectorAll(`.primary-nav a:not(${matchingLink})`)
          .forEach(el => el.classList.remove("is-current-link"));
        document.querySelector(matchingLink).classList.add("is-current-link");
      }
    }
  }
  // determine if you scroll up or down
  determineScrollDirection() {
    if (window.scrollY > this.previousScrollY) {
      this.scrollDirection = "down";
    } else {
      this.scrollDirection = "up";
    }
    this.previousScrollY = window.scrollY;
  }
}

export default StickyHeader;
