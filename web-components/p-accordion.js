import {LitElement, html, css} from 'https://cdn.jsdelivr.net/gh/lit/dist@2/core/lit-core.min.js';
// DOCS: https://github.com/Hi-Pyncho/web-components#accordion

customElements.define('p-accordion', class extends LitElement {
  static properties = { 
    noCollapse: {
      type: Boolean, 
      reflect: true
    },
    noStyle: {
      type: Boolean, 
      reflect: true
    },
  }

  static styles = css`
    :host {
      width: 100%;
      --padding: 1rem;
    }
    [p-content] {
      display: none;
      padding: var(--padding);
      border-bottom-left-radius: .3rem;
      border-bottom-right-radius: .3rem;
    }
    [p-trigger].p-show + [p-content] {
      display: block;
      background-color: #eee;
    }
    [p-trigger] {
      --arrow-size: 1.5rem;
      width: 100%;
      text-align: left;
      border: 1px solid #eee;
      border-radius: .3rem;
      display: block;
      appearance: none;
      -moz-appearance: none;
      -webkit-appearance: none;
      box-shadow: none;
      background-color: rgba(0, 0, 0, 0);
      position: relative;
      cursor: pointer;
      padding: var(--padding);
      padding-right: calc(var(--arrow-size) + var(--padding));
    }
    [p-trigger]::after {
      content: '';
      position: absolute;
      top: 50%;
      right: .5rem;
      transform: translateY(-50%);
      background-image: url("data:image/svg+xml,%3Csvg width='100%25' height='100%25' viewBox='0 0 20 20' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M5 8.33337L10 13.3334L15 8.33337' stroke='%23000' stroke-linecap='round'/%3E%3C/svg%3E");
      width: var(--arrow-size);
      height: var(--arrow-size);
    }
    [p-trigger].p-show::before {
      content: '';
      position: absolute;
      bottom: 0;
      left: 50%;
      width: calc(100% - 2rem);
      transform: translateX(-50%);
      height: 1px;
      background-color: #000;
    }
    [p-trigger].p-show::after {
      transform: translateY(-50%) rotate(180deg);
    }
    [p-trigger].p-show {
      background-color: #eee;
      border-bottom-left-radius: 0;
      border-bottom-right-radius: 0;
    }
  `

  constructor() {
    super()
    this.noCollapse = false
    this.noStyle = false
  }

  firstUpdated() {
    this.accordionList = this.getSlottedByName('list')[0]
    if(!this.noStyle) {
      this.shadowRoot.append(this.accordionList)
    }
    this.accordionList.addEventListener('click', this.accordionClickHandler)
    this.accordionList.setAttribute('aria-label', 'Accordion Control Group Buttons')
    this.triggers = this.accordionList.querySelectorAll('[p-trigger]')
    this.contents = this.accordionList.querySelectorAll('[p-content]')
    this.contents.forEach(content => {
      content.setAttribute('part', 'p-content')
    })
    this.triggers.forEach(trigger => {
      trigger.setAttribute('aria-expanded', false)
      trigger.setAttribute('part', 'p-trigger')
    }) 
  }

  accordionClickHandler = (event) => {
    const target = event.target

    if(!target.matches('[p-trigger]')) return

    this.lastClicked = target
    
    if(!this.noCollapse) {
      this.triggers.forEach(trigger => {
        if(trigger === this.lastClicked) return
        trigger.classList.remove('p-show')
        trigger.setAttribute('aria-expanded', false)
      })
    }

    target.classList.toggle('p-show')
    target.setAttribute('aria-expanded', target.getAttribute('aria-expanded') === 'false' ? true : false)
  }

  getSlottedByName(name = '') {
    const search = name.trim() === '' ? 'slot' : `slot[name='${name}']`
    const slot = this.shadowRoot.querySelector(search)

    return slot.assignedElements({flatten: true})
  }

  render() {
    return html`
      <slot class='styled' name='list'></slot>
    `
  }
})
