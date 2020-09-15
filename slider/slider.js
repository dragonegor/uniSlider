import Hummer from './hammer'

const btnsTemlate = `
    <div class="buttons">
    <div class="left">
        <span></span>
        <span></span>
    </div>
    <div class="right">
        <span></span>
        <span></span>
    </div>
    </div>
`


export class Slider {
    constructor (selector, options) {
        this.selector = selector
        this.$el = document.querySelector(selector)
        if(this.$el) {
            this.lengthSlider = this.$el.children.length
            this.$childrens = document.querySelectorAll(selector + '>.slide')
            this.options = options
            this.infinity = options.infinity ?? true
            this.mainSlide = options.mainSlide ?? 1

            this.render(
                this.$el, 
                this.selector,
                this.options.qtySlide ?? 1, 
                this.mainSlide, 
                this.options.buttons ?? true, 
                this.options.fadeEffect ?? false
                )
            this.setup()
            this.setupTouch()
            if(options.connectSlider) {
                this.connect = document.querySelector(options.connectSlider.element)
                this.render(
                    this.connect,
                    options.connectSlider.element,
                    options.connectSlider.qtySlide ?? 1,
                    options.connectSlider.mainSlide ?? 1,
                    options.connectSlider.buttons ?? false,
                    options.connectSlider.fadeEffect ?? false
                    )
                this.setup(this.connect)
            }
        }

    }

    // рендер позиции слайдов и расстановка их в зависимости (бесконечная прокрутка, позиция первого элемента, наличие кнопок)

    render(el, selector, qty, mainSlide, btns, fade) {
        el.style.position = 'relative'
        el.style.overflow = 'hidden'

        

        let length = this.length(selector)
        let children = this.children(selector)
        if((length/qty <= 1.5 && length/qty >= 1 && this.infinity) || (this.options.centerMode && length/qty >= 1)) {
            for (let node of children) {
                let newNode = node.cloneNode(true)
                el.append(newNode)
            }
            length = length*2
        }
        children = this.children(selector)
        

        let j = 0

        // проход по массиву слайдов, расстановка позиций, добавление id
        if(!fade){
            let rightItems = Math.ceil((length-qty)/2),
            pos = 100,
            i = 0
            for(let node of children) {
                if(length/qty <= 1) {
                    node.style.width = 100/length + '%'
                } else {
                    node.style.width = 100/qty + '%'
                }
                if (j === rightItems+qty && this.infinity) {
                    i = - length + rightItems + qty
                }
                node.style.transform = 'translateX(' + pos * i + '%)'
                node.dataset.id = i
                i++
                j++
            }
        } else {
            let i = length
            for(let node of children) {
                node.style.transition = 'opacity 1s'
                node.style.width = 100 + '%'
                if(j === 0){
                    node.style.opacity = 1
                } else {
                    node.style.opacity = 0
                }
                node.style.zIndex = i
                node.dataset.id = i
                i--
                j++
            }
        }

        if (this.options.centerMode && length/qty >= 1) {
            for(let node of children) {
                let width = node.offsetWidth
                node.style.left = width * 0.5 * (qty - 1) + 'px'
            }
        }

        // прорисовка кнопок
        el.insertAdjacentHTML("beforeend", btnsTemlate)
        if(!btns || this.options.btnLeft || this.options.btnRight || (this.options.centerMode && length/qty <= 1)) {
            el.lastElementChild.style.display = 'none'
        }
    }


    // установка слушателей на дефолтные или кастомные кнопки, байндим контекст, авто движение
    setup(el = this.$el) {
        let move = this.options.autoMove || false
        let timer = this.options.autoMoveTime || 3
        if(move){
            this.timerMove(timer)
        }

        if(this.options.centerMode){
            let children = this.children(this.selector)
            for(let node of children) {
                node.addEventListener('click', this.clickCenter)
            }
        }
        const btns = this.options.buttons ?? true
        this.goRight = this.goRight.bind(this)
        this.goLeft = this.goLeft.bind(this)
        let btnLeft = document.querySelector(this.options.btnLeft) ?? ((btns)?el.lastElementChild.children[0]: null)
        let btnRight = document.querySelector(this.options.btnRight) ??  ((btns)?el.lastElementChild.children[1] : null)
        if(btnLeft && btnRight) {
            btnLeft.addEventListener('click', this.goLeft)
            btnRight.addEventListener('click', this.goRight)
        }
    }

    setupTouch() {
        if(this.options.centerMode && this.length(this.selector)/this.options.qtySlide >= 1) {
            this.goRight = this.goRight.bind(this)
            this.goLeft = this.goLeft.bind(this)
            let sld = document.querySelector(this.selector)
            let hummertime = new Hammer(sld)
            hummertime.on('swipeleft', this.goRight)
            hummertime.on('swiperight', this.goLeft)
        }
    }

    // получение длины массива
    length (selector = this.selector) {
        return document.querySelectorAll(selector + '>.slide').length
    }

    // получение коллекции слайдов
    children (selector = this.selector) {
        return document.querySelectorAll(selector + '>.slide')
    }

    // клик влево
    goLeft() {
        this.goMove('left', this.selector, this.options.qtySlide, this.options.fadeEffect)
        if(this.options.connectSlider) {
            this.goMove('left', this.options.connectSlider.element, this.options.connectSlider.qtySlide, this.options.connectSlider.fadeEffect)   
        }
    }

    // клик вправо
    goRight() {
        this.goMove('right', this.selector, this.options.qtySlide, this.options.fadeEffect)
        if(this.options.connectSlider) {
            this.goMove('right', this.options.connectSlider.element, this.options.connectSlider.qtySlide, this.options.connectSlider.fadeEffect)
        }
        
    }

    timerMove (timer) {
        setInterval(() => {
            this.goRight()
        }, timer*1000)
    }

    clickCenter (event) {
        let id = event.currentTarget.dataset.id
        let children = event.currentTarget.parentElement.querySelectorAll('.slide')
        console.log(children)
        if (id !== 0){

        }

    }

    // функция клика принимает параметры - направление, бесконечность,
    goMove(route, selector, qty, fade) {
        
        let length = this.length(selector)
        let width;
        let children = this.children(selector)
        let rightItems = Math.ceil((length-qty)/2)+qty - 1
        let leftItems = -(length - rightItems) + 1
        if(!fade) {
            const firstElPos = +children[0].style.transform.match(/-?\d+/)[0]
            const lastElPos = +children[length - 1].style.transform.match(/-?\d+/)[0]
        }
        if (this.infinity && !fade) { // поведение при зацикленной прокрутке
            const step = (route === 'left')?  100 : -100
            for(let node of children) {
                width = +node.style.transform.match(/-?\d+/)[0] + step
                node.style.transform = 'translateX('+width+'%)'
                if(route === 'left') {
                    ++node.dataset.id
                } else {
                    --node.dataset.id
                }
                if(node.dataset.id > rightItems) {
                    node.dataset.id = leftItems
                    node.style.opacity = '0'
                    node.style.transition = 'none'
                    node.style.transform = 'translateX(' + 100*leftItems + '%)'
                    setTimeout(function(){
                        node.style.opacity = '1'
                        node.style.transition = 'transform 0.3s'
                    }, 50)
                } else if (node.dataset.id < leftItems) {
                    node.dataset.id = rightItems
                    node.style.opacity = '0'
                    node.style.transition = 'none'
                    node.style.transform = 'translateX(' + 100*(rightItems) + '%)'
                    setTimeout(function(){
                        node.style.opacity = '1'
                        node.style.transition = 'transform 0.3s'
                    }, 50)
                }
            }

        } else if(fade){
            const step = (route === 'left')? -1 : 1
            for (let node of children) {
                let index = +node.style.zIndex
                let newIndex = index + step
                if (newIndex === 0 || newIndex === length) {
                    node.style.zIndex = length
                    node.style.opacity = 1
                } else if (newIndex === length + 1) {
                    node.style.zIndex = 1
                    node.style.opacity = 0
                } else {
                    node.style.zIndex = newIndex
                    node.style.opacity = 0
                }
            }
        } else { // повидение при стандартной прокрутке
            const step = (route === 'left')? ((firstElPos === 0)? 0 : 100) : ((lastElPos === (this.options.qtySlide-1)*100)? 0 : -100)
            for(let node of children) {
                width = +node.style.transform.match(/-?\d+/)[0] + step
                node.style.transform = 'translateX('+width+'%)'
            }
        }
    }
}
