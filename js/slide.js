import debounce from './debounce.js';

export class Slide {
  constructor(slide, wrapper) {
    this.slide = document.querySelector(slide);
    this.wrapper = document.querySelector(wrapper);
    this.dist = {
      startX: 0,
      movement: 0,
      movePosition: 0,
      finalPositon: 0,
    };
    this.activeClass = 'active';
    this.changeEvent = new Event('changeEvent');
  }

  transition(active) {
    this.slide.style.transition = active ? 'transform .3s' : '';
  }

  updatePosition(clienteX) {
    this.dist.movement = this.dist.startX - clienteX;
    return this.dist.finalPositon - this.dist.movement;
  }

  moveSlide(distX) {
    this.dist.movePosition = distX;
    this.slide.style.transform = `translate3d(${distX}px, 0, 0)`;
  }

  onStart(event) {
    let moveType;
    if (event.type === 'mousedown') {
      event.preventDefault();
      this.dist.startX = event.clientX;
      moveType = 'mousemove';
    } else {
      this.dist.startX = event.changedTouches[0].clientX;
      moveType = 'touchmove';
    }
    this.transition(false);
    this.wrapper.addEventListener(moveType, this.onMove);
  }

  onMove(event) {
    const pointerPosition = event.type === 'mousemove' ? event.clientX : event.changedTouches[0].clientX;
    const endPosition = this.updatePosition(pointerPosition);
    this.moveSlide(endPosition);
  }

  onEnd(event) {
    const moveType = event.type === 'mouseup' ? 'mousemove' : 'touchmove';
    this.dist.finalPositon = this.dist.movePosition;
    this.wrapper.removeEventListener(moveType, this.onMove);
    this.transition(true);
    this.changeSlideOnEnd();
  }

  changeSlideOnEnd() {
    if (this.dist.movement > 100 && this.index.next !== undefined) {
      this.activeNextSlide();
    } else if (this.dist.movement < -100 && this.index.prev !== undefined) {
      this.activePrevSlide();
    } else {
      this.changeSlide(this.index.active);
    }
  }

  addSlideEvents() {
    this.wrapper.addEventListener('mousedown', this.onStart);
    this.wrapper.addEventListener('mouseup', this.onEnd);
    this.wrapper.addEventListener('touchstart', this.onStart);
    this.wrapper.addEventListener('touchend', this.onEnd);
  }

  slidePosition(slideItem) {
    const margin = (this.wrapper.offsetWidth - slideItem.offsetWidth) / 2;
    return -(slideItem.offsetLeft - margin);
  }

  slideConfig() {
    this.slidesArray = [...this.slide.children].map((element) => {
      const position = this.slidePosition(element);
      return {
        element,
        position,
      };
    });
  }

  sliderIndexNav(index) {
    const lastIndex = this.slidesArray.length - 1;
    this.index = {
      prev: index ? index - 1 : undefined,
      active: index,
      next: index === lastIndex ? undefined : index + 1,
    };
  }

  changeSlide(index) {
    const activeSlide = this.slidesArray[index];

    this.moveSlide(activeSlide.position);
    this.sliderIndexNav(index);
    this.dist.finalPositon = activeSlide.position;
    this.changeActiveClass(index);

    // dispara evento quando a função for executada
    this.wrapper.dispatchEvent(this.changeEvent);
  }

  changeActiveClass(index) {
    this.slidesArray.forEach((item) => item.element.classList.remove(this.activeClass));
    this.slidesArray[index].element.classList.add(this.activeClass);
  }

  activePrevSlide() {
    if (this.index.prev !== undefined) {
      this.changeSlide(this.index.prev);
    }
  }

  activeNextSlide() {
    if (this.index.next !== undefined) {
      this.changeSlide(this.index.next);
    }
  }

  onResize() {
    setTimeout(() => {
      this.slideConfig();
      this.changeSlide(this.index.active);
    }, 1000);
  }

  addResizeEvent() {
    window.addEventListener('resize', this.onResize);
  }

  bindEvents() {
    this.onStart = this.onStart.bind(this);
    this.onMove = this.onMove.bind(this);
    this.onEnd = this.onEnd.bind(this);

    this.onResize = debounce(this.onResize.bind(this), 200);

    this.activePrevSlide = this.activePrevSlide.bind(this);
    this.activeNextSlide = this.activeNextSlide.bind(this);
  }

  init() {
    if (this.slide && this.wrapper) {
      this.bindEvents();
      this.transition(true);
      this.addSlideEvents();
      this.slideConfig();
      this.addResizeEvent();
      this.changeSlide(0);
    }
    return this;
  }
}

export class SlideNav extends Slide {
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
