export default class Slide {
  constructor(slide, wrapper) {
    this.slide = document.querySelector(slide);
    this.wrapper = document.querySelector(wrapper);
    this.dist = {
      startX: 0,
      movement: 0,
      movePosition: 0,
      finalPositon: 0,
    };
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
  }

  addSlideEvents() {
    this.wrapper.addEventListener('mousedown', this.onStart);
    this.wrapper.addEventListener('mouseup', this.onEnd);
    this.wrapper.addEventListener('touchstart', this.onStart);
    this.wrapper.addEventListener('touchend', this.onEnd);
  }

  bindEvents() {
    this.onStart = this.onStart.bind(this);
    this.onMove = this.onMove.bind(this);
    this.onEnd = this.onEnd.bind(this);
  }

  init() {
    if (this.slide && this.wrapper) {
      this.bindEvents();
      this.addSlideEvents();
    }
    return this;
  }
}
