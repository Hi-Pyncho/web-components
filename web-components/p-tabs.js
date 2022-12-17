import {LitElement, html, css} from 'https://cdn.jsdelivr.net/gh/lit/dist@2/core/lit-core.min.js';
// DOCS: https://github.com/Hi-Pyncho/web-components#tabs

customElements.define('p-tabs', class extends LitElement {
  static properties = {
    noStyle: {
      type: Boolean,
      reflect: true
    },
    accordionOnMobile: {
      type: Boolean,
      reflect: true
    },
    mobileMedia: {
      type: Number,
      reflect: true
    }
  }
  static styles = css`
    :host {
      width: 100%;
      --padding: 1rem;
      --main-color: #eee;
    }
    [p-content] {
      display: none;
      padding: var(--custom-padding, var(--padding));
      border-bottom-left-radius: .3rem;
      border-bottom-right-radius: .3rem;
    }
    [p-content].show {
      display: block;
      background-color: var(--custom-main-color, var(--main-color));
    }
    [p-trigger] {
      display: block;
      text-align: left;
      border: none;
      border-radius: .3rem;
      border-bottom: none;
      border-bottom-left-radius: 0;
      border-bottom-right-radius: 0;
      appearance: none;
      -moz-appearance: none;
      -webkit-appearance: none;
      box-shadow: none;
      background-color: rgba(0, 0, 0, 0);
      cursor: pointer;
      padding: var(--padding);
      white-space: nowrap;
    }
    [p-trigger].show {
      background-color: var(--custom-main-color, var(--main-color));
    }
    .p-tabs__trigger-list {
      display: flex;
      flex-wrap: wrap;
    }
  `

  constructor() {
    super()
    this.tabMap = new Map()
    this.noStyle = false
    this.accordionOnMobile = false
    this.mobileMedia = 480
  }

  setupTriggersAttributes() {
    this.triggers.forEach((trigger, index) => {
      trigger.setAttribute('part', 'p-trigger')
      trigger.setAttribute('role', 'tab')
      trigger.setAttribute('aria-selected', false)
      trigger.setAttribute('aria-controls', `p-tab-control-${index}`)
      trigger.setAttribute('id', `p-tab-${index}`)
    }) 
  }

  setupContentsAttributes() {
    this.contents.forEach((content, index) => {
      content.setAttribute('part', 'p-content')
      content.setAttribute('role', 'tabpanel')
      content.setAttribute('aria-labelledby', `p-tab-${index}`)
      content.setAttribute('id', `p-tab-control-${index}`)
    }) 
  }

  mapTriggersWithContents() {
    this.triggers.forEach((trigger, index) => {
      this.tabMap.set(trigger, this.contents[index])
    }) 
  }

  wrapTriggers() {
    this.triggersContainer = document.createElement('div')
    this.triggersContainer.setAttribute('part', 'p-trigger-container')
    this.triggersContainer.classList.add('p-tabs__trigger-list')
    this.triggersContainer.append(...this.triggers)
    this.tabsList.append(this.triggersContainer)
  }

  wrapContents() {
    this.contentsContainer = document.createElement('div')
    this.contentsContainer.setAttribute('part', 'p-contents-container')
    this.contentsContainer.append(...this.contents)
    this.tabsList.append(this.contentsContainer)
  }

  transformToTabs() {
    this.wrapTriggers()
    this.wrapContents()
    this.elementState = 'tabs'
  }

  setupFirstState() {
    this.setShow(this.triggers[0])
    this.setShow(this.contents[0])
    this.triggers[0].setAttribute('aria-selected', true)
  }

  detectElementState() {
    if(window.matchMedia(`(max-width: ${this.mobileMedia}px)`).matches) {
      this.elementState = 'accordion'
    } else {
      this.elementState = 'tabs'
    }
  }

  setTransformLogic() {
    switch (this.elementState) {
      case 'tabs':
        this.transformToTabs()
        break;
      case 'accordion':
        this.transformToAccordion()
        break;
    }

    this.listenResize()
  }

  firstUpdated() {
    this.detectElementState()
    this.tabsList = this.getSlottedByName('list')[0]
    this.tabsList.setAttribute('aria-label', 'Accordion Control Group Buttons')
    this.tabsList.addEventListener('click', this.handleClickTab)

    this.triggers = this.tabsList.querySelectorAll('[p-trigger]')
    this.contents = this.tabsList.querySelectorAll('[p-content]')

    this.mapTriggersWithContents()
    this.setupTriggersAttributes()
    this.setupContentsAttributes()

    this.setupFirstState()

    if(this.accordionOnMobile) {
      this.setTransformLogic()
    } else {
      this.transformToTabs()
    }
   
    if(this.noStyle) {
      this.append(this.tabsList)
    } else {
      this.shadowRoot.append(this.tabsList)
    }
  }

  listenResize() {
    window.addEventListener('resize', () => {
      if(window.outerWidth > this.mobileMedia && this.elementState === 'accordion') {
        this.transformToTabs()
        return
      }

      if(window.outerWidth <= this.mobileMedia && this.elementState === 'tabs') {
        this.transformToAccordion()
        return
      }
    })
  }

  transformToAccordion() {
    this.triggers.forEach((trigger, index) => {
      this.tabsList.append(trigger)
      this.tabsList.append(this.contents[index])
    })

    this.triggersContainer?.remove()
    this.contentsContainer?.remove()
    this.elementState = 'accordion'
  }

  setShow(element) {
    element.classList.add('show')
  }

  unsetShow(element) {
    element.classList.remove('show')
  }

  handleClickTab = (event) => {
    const target = event.target

    if(!target.matches('[p-trigger]')) return

    this.triggers.forEach((trigger, index) => {
      this.unsetShow(trigger)
      this.unsetShow(this.contents[index])
      trigger.setAttribute('aria-selected', false)
    })

    this.setShow(this.tabMap.get(target))
    this.setShow(target)
    target.setAttribute('aria-selected', target.getAttribute('aria-selected') === 'false' ? true : false)
  }

  getSlottedByName(name = '') {
    const search = name.trim() === '' ? 'slot' : `slot[name='${name}']`
    const slot = this.shadowRoot.querySelector(search)

    return slot.assignedElements({flatten: true})
  }

  render() {
    return html`
      <slot name='list'></slot>
    `
  }
})
