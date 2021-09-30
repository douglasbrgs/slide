import { SlideNav } from './slide.js';

const slide = new SlideNav('.slide', '.slide-wrapper');
slide.init();
slide.addNavButtons('.prev', '.next');
slide.addControl('.custom-controls');
