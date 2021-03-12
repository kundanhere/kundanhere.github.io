const AppController = (function () {
  // do not mess global space
  'use strict';

  // helpers
  const select = (DOMElement) => document.querySelector(DOMElement);
  const selectAll = (DOMElement) => document.querySelectorAll(DOMElement);

  // object to hold references to html selectors
  const DOMElements = {
    grid: '.grid',
    gridItem: '.grid__item',
    filterItem: '.filter__item',
    accordion: '.accordion',
    acActive: '.accordion.active',
    animIcon: '.anim-icon',
    vsSection: '#vs-section',
  };

  // app state
  const state = {
    filterItems: [],
    controls: [],
    iso: {},
  };

  // private methods
  // @desc initialize Isotope
  function initIsotope() {
    const collection = select(DOMElements.grid),
      options = {
        itemSelector: DOMElements.gridItem,
        masonry: {
          columnWidth: 1,
          rowWidth: 1,
          isFitWidth: true,
        },
      };
    state.filterItems = selectAll(DOMElements.filterItem);

    // instantiate Isotope
    state.iso = new Isotope(collection, options);

    // hookup click event for each "filter-item"
    state.filterItems.forEach((item) =>
      item.addEventListener('click', filterIso)
    );
  }

  // @desc filter isotope elements
  function filterIso(evt) {
    changeActiveClass(evt.target);
    // get filter value of clicked item
    let filterValue = evt.target.dataset.filter;

    return state.iso.arrange({ filter: filterValue }), !1;
  }

  function changeActiveClass(element) {
    // remove "active" class from all filter items
    state.filterItems.forEach((item) => item.classList.remove('active'));

    // adds "active" class on clicked item
    element.classList.add('active');
  }

  // @desc initialize accordion
  function initAccordion() {
    const accordions = selectAll(DOMElements.accordion),
      acActive = select(DOMElements.acActive);

    if (acActive) {
      // set default height of active accordion
      let acPanel = acActive.nextElementSibling;
      acPanel.style.maxHeight = acPanel.scrollHeight + 'px';
    }

    // hookup click event for each "accordion"
    accordions.forEach((acc) =>
      acc.addEventListener('click', onAccordionClicked)
    );
  }

  function onAccordionClicked(evt) {
    // toggle "active" class on clicked item
    evt.target.classList.toggle('active');

    // Get and set panel max-height
    let panel = evt.target.nextElementSibling;
    panel.style.maxHeight = !panel.style.maxHeight
      ? panel.scrollHeight + 'px'
      : null;
  }

  // @desc init smooth scroll on Extra large devices (large laptops and desktops, 1200px and up)
  function initSmoothScroll() {
    const vsSection = select(DOMElements.vsSection);
    let winSize = window.innerWidth;

    if (winSize > 768) {
      // apply smooth-scroll css
      vsSection.classList.add('vs-section');

      // instantiate smooth-scroll
      const smoothScroll = new Smooth({
        native: false,
        preload: true,
      });
      smoothScroll.init();
    } else {
      // remove smooth-scroll css
      vsSection.classList.remove('vs-section');
    }
  }

  // @desc init lottie animation for icons
  function initLottieAnimation() {
    const animIcons = selectAll(DOMElements.animIcon);

    animIcons.forEach((icon, index) => {
      // register animation
      state.controls.push(bodymovin.registerAnimation(icon));
      state.controls[index].setSpeed(0.6);

      // hookup mouse events
      icon.addEventListener('mouseover', startAnimation(index));
      icon.addEventListener('mouseleave', stopAnimation(index));
    });
  }
  function startAnimation(index) {
    return function (evt) {
      state.controls[index].play();
    };
  }
  function stopAnimation(index) {
    return function (evt) {
      state.controls[index].stop();
    };
  }

  return {
    init() {
      // invoke methods
      initSmoothScroll();
      initIsotope();
      initAccordion();
      initLottieAnimation();
    },
  };
})();

// will need to call a method to run the app on page load
AppController.init();
