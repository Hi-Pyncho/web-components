import {LitElement, html, css} from 'https://cdn.jsdelivr.net/gh/lit/dist@2/core/lit-core.min.js';

// DOCS: https://github.com/Hi-Pyncho/web-components#multiple-select

customElements.define('p-multiple-select', class extends LitElement {
  static properties = { 
    noStyle: {
      type: Boolean,
      reflect: true
    },
    delimiter: String,
  }

  static styles = css`
    button {
      appearance: none;
      -moz-appearance: none;
      -webkit-appearance: none;
      box-shadow: none;
      border: none;
      background-color: rgba(0, 0, 0, 0);
      cursor: pointer;
      display: block;
      width: 100%;
    }
    .p-multiple-select {
      padding: .5rem;
      border: 1px solid #eee;
      border-radius: .5rem;
      width: max-content;
      max-width: 100%;
      min-width: 10rem;
    }
    .p-multiple-select__wrapper {
      display: flex;
      flex-direction: column;
      text-align: left;
      align-items: flex-start;
      max-height: 7rem;
      overflow-y: auto;
      padding-right: .5rem;
    }
    .p-multiple-select__option {
      padding: .5em 1em;
      text-align: left;
    }
    .p-multiple-select__option:first-child {
      border-top-left-radius: .5rem;
      border-top-right-radius: .5rem;
    }
    .p-multiple-select__option:last-child {
      border-bottom-left-radius: .5rem;
      border-bottom-right-radius: .5rem;
    }
    .p-multiple-select__option[data-selected='true'] {
      background-color: #eee;
    }
    .p-multiple-select__wrapper::-webkit-scrollbar {
      width: 10px;
    }
    .p-multiple-select__wrapper::-webkit-scrollbar-track {
      background-color: #eee;
      border-radius: 1rem;
    }
    .p-multiple-select__wrapper::-webkit-scrollbar-thumb {
      background-color: #ababab;
      border-radius: 1em;
    }
    .p-multiple-select__wrapper {
      scrollbar-color: #ababab #eee;
      scrollbar-width: thin;
    }
  `
  constructor() {
    super();
    this.noStyle = false
    this.delimiter = ','
    this.selectedValues = []
  }

  firstUpdated() {
    this.detectNativeSelect()
    this.createOptionsArray()
    this.fillPredefinedOptions()
    this.createHiddenField()
    this.createCustomSelect()
    this.placeNewSelect()
  }
 
  detectNativeSelect() {
    this.nativeSelect = this.getSlottedByName('select')[0]
  }

  placeNewSelect() {
    if(this.noStyle) {
      this.append(this.customSelect)
    } else {
      this.shadowRoot.append(this.customSelect)
    }
    
    this.nativeSelect.replaceWith(this.hiddenField)
  }

  createOption(value, text, selected = false, disabled = false) {
    const option = document.createElement('button')

    option.setAttribute('type', 'button')
    option.setAttribute('data-selected', selected)

    if(disabled) {
      option.setAttribute('disabled', true)
    }

    option.setAttribute('data-value', value)
    option.classList.add('p-multiple-select__option')
    option.textContent = text

    option.addEventListener('click', () => {
      const selected = option.dataset.selected === 'true'
      const selectedValue = option.dataset.value

      if(selected) {
        this.selectedValues = this.selectedValues.filter((value) => value !== selectedValue)
        option.setAttribute('data-selected', false)
      } else {
        this.selectedValues.push(selectedValue)
        option.setAttribute('data-selected', true)
      }

      this.updateHiddenField()
    })

    return option
  }

  createCustomSelect() {
    const innerWrapper = document.createElement('div')
    innerWrapper.classList.add('p-multiple-select__wrapper')

    this.customSelect = document.createElement('div')
    this.customSelect.classList.add('p-multiple-select')
    this.customSelect.setAttribute('slot', 'select')

    this.customOptions = this.optionsArray.map(({ value, text, selected, disabled }) => {
      return this.createOption(value, text, selected, disabled)
    })
    
    innerWrapper.append(...this.customOptions)
    this.customSelect.append(innerWrapper)
  }

  createOptionsArray() {
    this.optionsArray = [...this.nativeSelect.children].map((option) => {
      return {
        'value': option.value,
        'text': option.textContent.trim(),
        'disabled': option.disabled,
        'selected': option.selected
      }
    })
  }

  fillPredefinedOptions() {
    this.selectedValues = this.optionsArray
      .filter(({ selected }) => selected)
      .map(({ value }) => value)
  }

  createHiddenField() {
    this.hiddenField = document.createElement('input')
    this.hiddenField.setAttribute('type', 'hidden')
    this.hiddenField.setAttribute('name', this.nativeSelect.name)
    this.updateHiddenField()
  }

  updateHiddenField() {
    this.hiddenField.value = this.selectedValues.join(this.delimiter)
  }

  getSlottedByName(name = '') {
    const search = name.trim() === '' ? 'slot' : `slot[name='${name}']`
    const slot = this.shadowRoot.querySelector(search)

    return slot.assignedElements({flatten: true})
  }

  render() {
    return html`
      <slot name='select'></slot>
    `
  }
})
