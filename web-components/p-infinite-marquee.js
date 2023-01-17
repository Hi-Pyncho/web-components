import {LitElement, html, css} from 'https://cdn.jsdelivr.net/gh/lit/dist@2/core/lit-core.min.js';

customElements.define('p-infinite-marquee', class extends LitElement {
  static properties = {
    acceleration: Number,
    gap: Number,
    direction: String,
    fps: Number
  }

  static styles = css`
    .p-marquee {
      --gap: 20px;
      overflow-x: hidden;
      display: flex;
      justify-content: center;
    } 
    .p-marquee__wrapper {
      display: flex;
    }
    .p-marquee__element {
      display: block;
      white-space: nowrap;
    }
  `

  constructor() {
    super();
    this.counter = 0
    this.fps = 60
    this.acceleration = 1
    this.gap = 20
    this.direction = 'toLeft'
  }

  firstUpdated() {
    this.setBodyOverflow()
    this.initVariables()
    this.fillWrapperWithElements()

    requestAnimationFrame(() => {
      this.runMarquee()
    })
  }

  fillWrapperWithElements() {
    const elementsToAdd = Array.from({ length: this.elementsToAdd }, (_v, _i) => this.marqueeElement.cloneNode(true))
    this.marqueeWrapper.append(...elementsToAdd)
  }

  setMarqueeElementStyles() {
    this.marqueeElement.style.paddingLeft = `${this.gap / 2}px`
    this.marqueeElement.style.paddingRight = `${this.gap / 2}px`
    this.marqueeElement.style.whiteSpace = 'nowrap'
  }

  initVariables() {
    this.marqueeWrapper = this.shadowRoot.querySelector('.p-marquee__wrapper')
    this.marqueeElement = this.getSlottedByName('content')[0]
    this.setMarqueeElementStyles()
    this.elementWidth = this.marqueeElement.clientWidth
    this.elementsToAdd = Math.ceil(window.innerWidth / this.elementWidth) + 1
  }

  setBodyOverflow() {
    document.documentElement.style.overflowX = 'hidden'
  }

  runMarquee() {
    this.counter += 1
    const speed = this.counter * this.acceleration

    const directions = {
      toRight: speed,
      toLeft: -speed,
    }
  
    if(speed > this.elementWidth) {
      this.marqueeWrapper.append(this.marqueeWrapper.firstElementChild)
      this.counter = 0
    }

    this.marqueeWrapper.style.transform = `translateX(${directions[this.direction]}px)`
  
    setTimeout(() => {
      requestAnimationFrame(() => {
        this.runMarquee()
      })
    }, 1000 / this.fps);
  }


  getSlottedByName(name = '') {
    const search = name.trim() === '' ? 'slot' : `slot[name='${name}']`
    const slot = this.shadowRoot.querySelector(search)

    return slot.assignedElements({flatten: true})
  }

  render() {
    return html`
      <div style='--gap:${this.gap}px' class='p-marquee'>
        <div part='wrapper' class="p-marquee__wrapper">
          <slot name='content'></slot>
        </div>
      </div> 
    `
  }
})
