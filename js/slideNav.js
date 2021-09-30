import Slide from './slide.js';

export default class SlideNav extends Slide {
  constructor(...args) {
    super(...args); // passagem de argumentos usando rest
    this.bindControlEvents();
  }

  addNavButtons(prev, next) {
    this.prevElement = document.querySelector(prev);
    this.nextElement = document.querySelector(next);

    if (this.prevElement && this.nextElement) {
      this.addNavButtonsEvent();
    }
  }

  addNavButtonsEvent() {
    this.prevElement.addEventListener('click', this.activePrevSlide);
    this.nextElement.addEventListener('click', this.activeNextSlide);
  }

  createControl() {
    const control = document.createElement('ul');
    control.dataset.control = 'slide';

    this.slidesArray.forEach((item, index) => {
      control.innerHTML += `<li><a href="slide${index + 1}">${index + 1}</a></li>`;
    });

    this.wrapper.appendChild(control);

    return control;
  }

  activeControlItem() {
    this.controlArray.forEach((item) => {
      item.classList.remove(this.activeClass);
    });

    this.controlArray[this.index.active].classList.add(this.activeClass);
  }

  eventControl(item, index) {
    item.addEventListener('click', (event) => {
      event.preventDefault();
      this.changeSlide(index);
      this.activeControlItem();
    });

    // observa evento de mudança de slide
    this.wrapper.addEventListener('changeEvent', this.activeControlItem);
  }

  addControl(customControl) {
    this.control = document.querySelector(customControl) || this.createControl();
    this.controlArray = [...this.control.children];
    this.activeControlItem();
    this.controlArray.forEach(this.eventControl);
  }

  bindControlEvents() {
    this.eventControl = this.eventControl.bind(this);
    this.activeControlItem = this.activeControlItem.bind(this);
  }
}
