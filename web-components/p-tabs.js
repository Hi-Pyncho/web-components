import {LitElement, html, css} from 'lit';

customElements.define('p-tabs', class extends LitElement {
  static properties = {
    noStyle: {
      type: Boolean,
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
    const triggersContainer = document.createElement('div')
    triggersContainer.setAttribute('part', 'p-trigger-container')
    triggersContainer.classList.add('p-tabs__trigger-list')
    triggersContainer.append(...this.triggers)
    this.tabsList.append(triggersContainer)
  }

  wrapContents() {
    const contentsContainer = document.createElement('div')
    contentsContainer.setAttribute('part', 'p-contents-container')
    contentsContainer.append(...this.contents)
    this.tabsList.append(contentsContainer)
  }

  setupFirstState() {
    this.setShow(this.triggers[0])
    this.setShow(this.contents[0])
    this.triggers[0].setAttribute('aria-selected', true)
  }

  firstUpdated() {
    this.tabsList = this.getSlottedByName('list')[0]
    this.tabsList.setAttribute('aria-label', 'Accordion Control Group Buttons')
    this.tabsList.addEventListener('click', this.handleClickTab)

    this.triggers = this.tabsList.querySelectorAll('[p-trigger]')
    this.contents = this.tabsList.querySelectorAll('[p-content]')

    this.mapTriggersWithContents()
    this.setupTriggersAttributes()
    this.setupContentsAttributes()

    this.setupFirstState()

    this.wrapTriggers()
    this.wrapContents()
    
    if(this.noStyle) {
      this.append(this.tabsList)
    } else {
      this.shadowRoot.append(this.tabsList)
    }
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
