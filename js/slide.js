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
        event.preventDefault();
        this.dist.startX = event.clientX;
        this.wrapper.addEventListener('mousemove', this.onMove);
    }

    onMove(event) {
        const endPosition = this.updatePosition(event.clientX);
        this.moveSlide(endPosition);
    }

    onEnd(event) {
        this.dist.finalPositon = this.dist.movePosition;
        this.wrapper.removeEventListener('mousemove', this.onMove);
    }

    addSlideEvents() {
        this.wrapper.addEventListener('mousedown', this.onStart);
        this.wrapper.addEventListener('mouseup', this.onEnd);
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
