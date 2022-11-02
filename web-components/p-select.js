import {LitElement, html, css} from 'lit';

customElements.define('p-select', class extends LitElement {
  static properties = {
    selectedOption: String,
    expanded: Boolean,
  }

  constructor() {
    super()
    this.selectedOption = ''
    this.expanded = false
    this.options = []
  }
  
  static styles = css`
    .custom-select {
      --row-height: 3rem;
      position: relative;
    }
    .custom-select * {
      box-sizing: border-box;
    }
    ::slotted(select) {
      position: absolute;
      opacity: 0;
      pointer-events: none;
    }
    .custom-select__list {
      position: absolute;
      top: var(--row-height);
      left: 0;
      opacity: 0;
      width: 100%;
      pointer-events: none;
      border: 1px solid #eee;
      border-radius: .3em;
    }
    .custom-select__list--opened {
      opacity: 1;
      pointer-events: all;
    }
    .custom-select__trigger,
    .custom-select__option {
      --padding: 1rem;
      position: relative;
      display: block;
      border: 1px solid #eee;
      width: 100%;
      padding: var(--padding);
      border-radius: .3em;
      font-size: 1rem;
      line-height: 1;
    }
    .custom-select__option {
      border: none;
      transition: background-color .1s ease-in-out;
    }
    .custom-select__option:hover {
      background-color: #eee;
      transition: background-color .1s ease-in-out;
    }
    .custom-select__trigger {
      --gap: 1rem;
      --arrow-size: 2rem;
      padding-right: calc(var(--padding) + var(--arrow-size) + var(--gap));
    }
    .custom-select__trigger svg {
      --size: 2rem;
      position: absolute;
      top: 50%;
      right: 1rem;
      transform: translateY(-50%);
      width: var(--size);
      height: var(--size);
      transition: transform .1s ease-in-out;
    }
    .custom-select__trigger--opened svg {
      transform: translateY(-50%) rotate(180deg);
      transition: transform .1s ease-in-out;
    }
    button {
      appearance: none;
      -moz-appearance: none;
      -webkit-appearance: none;
      box-shadow: none;
      border: none;
      background-color: rgba(0, 0, 0, 0);
      text-align: left;
      cursor: pointer;
    }
  `

  getSlottedByName(name = '') {
    const search = name.trim() === '' ? 'slot' : `slot[name='${name}']`
    const slot = this.shadowRoot.querySelector(search)

    return slot.assignedElements({flatten: true})
  }

  firstUpdated() {
    const slottedSelect = this.getSlottedByName()[0]
    slottedSelect.tabIndex = '-1'

    this.options = [...slottedSelect.querySelectorAll('option')]
    this.selectedOption = this.options[0].textContent
    this.requestUpdate()
  }

  handleOptionClick(event) {
    this.options[event.target.dataset.option].selected = true
    this.selectedOption = event.target.textContent
    this.expanded = false
    
    this.dispatchEvent(new CustomEvent('change', {
      detail: this.selectedOption.trim()
    }))
  }

  handleTrigger() {
    this.expanded = !this.expanded
  }

  render() {
    return html`
      <div class="custom-select">
        <slot class='select-slot' @slotchange=${this.handleSlotchange}></slot>

        <button part='custom-select__trigger' @click=${this.handleTrigger} class='custom-select__trigger ${this.expanded ? 'custom-select__trigger--opened' : ''}'>
          ${this.selectedOption}
          <svg part='custom-select__arrow' width="100%" height="100%" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5 8.33337L10 13.3334L15 8.33337" stroke="#924702" stroke-linecap="round"/>
          </svg>
        </button>
        
        <div part='custom-select__list' class='custom-select__list ${this.expanded ? 'custom-select__list--opened' : ''}'>
          ${this.options.map((option, index) => {
            return html`
              <button part='custom-select__option' class='custom-select__option' @click=${this.handleOptionClick} data-option=${index}>${option.textContent}</button>
            `
          })}
        </div>
      </div>
    `
  }
})
