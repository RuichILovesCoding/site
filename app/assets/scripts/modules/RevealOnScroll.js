import throttle from "lodash/throttle";
import debounce from "lodash/debounce";

class RevealOnScroll {
  constructor(els, thresholdPercent) {
    this.thresholdPercent = thresholdPercent;
    this.itemsToReveal = els;
    this.hideInitially();
    this.scrollThrottle = throttle(this.calcCaller, 200).bind(this); // this key word will still point to the overall object
    this.events();
  }
  // listen to the scroll events
  events() {
    window.addEventListener("scroll", this.scrollThrottle);
    window.addEventListener(
      "resize",
      debounce(() => {
        console.log("resize just ran");
      }, 333)
    );
  }

  calcCaller() {
    console.log("scroll function run"); // call this function every single px we scroll
    this.itemsToReveal.forEach(el => {
      if (el.isReveal == false) {
        this.calculateIfScrollTo(el);
      }
    });
  }

  // hide the item initially, then reveal the item
  hideInitially() {
    this.itemsToReveal.forEach(el => {
      el.classList.add("reveal-item");
      el.isReveal = false;
    });
    this.itemsToReveal[this.itemsToReveal.length - 1].isLastItem = true;
  }

  calculateIfScrollTo(el) {
    // el.offsetTop is the total page height
    // only when we scroll to the element, we wll calculate it
    if (window.scrollY + window.innerHeight > el.offsetTop) {
      // measure of how far top edge of the elment to the edge of the viewport, measure in px
      //console.log(el.getBoundingClientRect().y);
      console.log("elememt was calculated");
      let scrollPercent =
        (el.getBoundingClientRect().y / window.innerHeight) * 100;
      if (scrollPercent < this.thresholdPercent) {
        el.classList.add("reveal-item--is-visible");
        el.isReveal = true;
        // if it is the last item, we should remove the event handler
        if (el.isLastItem) {
          window.removeEventListener("scroll", this.scrollThrottle);
        }
      }
    }
  }
}

export default RevealOnScroll;
