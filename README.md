# uniSlider
alternative slick-slider on clear JS

## Dependencies
Touch events work only with [hammer.js](https://github.com/hammerjs/hammer.js) plugin 

## Instalation 
Download the files from this repository and connect to your project as js files

## Usage

Create a basic HTML structure in your project

```html
<div class="slider">
    <div class="slide">
        <p>1</p>
    </div>
    <div class="slide">
        <p>2</p>
    </div>
    <div class="slide">
        <p>3</p>
    </div>
</div>
```


Create a new instance of Slider class and set options

```javascript
const connectSlider = new Slider('.slider', {
    qtySlide: 2
})
```

## License
[MIT](https://choosealicense.com/licenses/mit/)
