import {Slider} from './slider/slider'
import './slider/style_slider.scss'

const connectSlider = new Slider('.slider', {
    qtySlide: 3,
    // infinity: false,
    // buttons: false || true
    // btnRight: '.class or #id'
    // btnLeft: '.class or #id'
    // autoMove: true,
    // autoMoveTime: 7
    connectSlider: {
        element: '.slider2',
        qtySlide: 1,
        buttons: false
    },
    centerMode: true
})

const simpleSliderInf = new Slider('.slider3', {
    qtySlide: 3
})

const simpleSliderNonInf = new Slider('.slider4', {
    qtySlide: 3,
    infinity: false
})

const customButtons = new Slider('.slider7', {
    qtySlide: 2,
    infinity: false,
    btnRight: '.my_right',
    btnLeft: '.my_left'
})

const sliderFade = new Slider('.slider6', {
    fadeEffect: true
})

const centerMode = new Slider('.slider5', {
    centerMode: true,
    qtySlide: 3
})



