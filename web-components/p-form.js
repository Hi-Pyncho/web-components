import {LitElement, html} from 'lit';

class Validator {
  constructor(prefix = '') {
    this.prefix = `${prefix}-`
  }

  validateText(input) {
    const value = input.value
  
    if(value === '') {
      this.setInvalid(input)
      return false
    }
  
    this.unsetInvalid(input)
    return true
  }

  validatePhone(input) {
    const value = input.value
  
    if(!this.validateText(input)) return
  
    const isPhoneValid = value.match(/\d/g).length === 11
  
    if(!isPhoneValid) {
      this.setInvalid(input)
      return false
    }
  
    this.unsetInvalid(input)
    return true
  }

  validateEmail(input) {
    const value = input.value
    
    if(!this.validateText(input)) return
  
    const isEmailValid = /.+@.+\..+/g.test(value)
  
    if(!isEmailValid) {
      this.setInvalid(input)
      return false
    }
  
    this.unsetInvalid(input)
    return true
  }
  
  validateCheckbox(input) {
    if(!input.checked) {
      this.setInvalid(input)
      return false
    }

    this.unsetInvalid(input)
    return true
  }

  setInvalid(input) {
    input.classList.add(`${this.prefix}invalid`)
  }

  unsetInvalid(input) {
    input.classList.remove(`${this.prefix}invalid`)
  }
}

class Form {
  constructor({form, fields, errorContainerClass, formWrapper, successText, failText, backendHandler, beforeSendCallback = function() {return true}}) {
    this.form = form
    this.fields = fields,
    this.errorContainerClass = errorContainerClass
    this.formWrapper = formWrapper
    this.successText = successText
    this.failText = failText
    this.backendHandler = backendHandler
    this.validator = new Validator('p')
    this.beforeSendCallback = beforeSendCallback
  }

  addFormListener() {
    this.form.addEventListener('submit', (event) => this.onSubmitHanlder(event))
  }

  markError(input) {
    const name = input.name
    const inputWrapper = input.closest(this.errorContainerClass)
    inputWrapper.setAttribute('data-error', this.fields[name].errorMessage)
  }

  unmarkError(input) {
    const errorContainer = input.closest(this.errorContainerClass)
    this.validator.unsetInvalid(input)
    errorContainer.removeAttribute('data-error')
  }

  addInputListeners() {
    Object.entries(this.fields).forEach(([name, {type}]) => {
      switch (type) {
        case 'text':
        case 'tel':
        case 'email':
          this.form[name].addEventListener('input', () => this.unmarkError(this.form[name]))
          break;
        case 'checkbox':
          this.form[name].addEventListener('change', () => this.unmarkError(this.form[name]))
          break;
      }
    })
  }

  validateInput(input, type) {
    switch (type) {
      case 'text':
        return this.validator.validateText(input)
      case 'email':
        return this.validator.validateEmail(input)
      case 'tel':
        return this.validator.validatePhone(input)
      case 'checkbox':
        return this.validator.validateCheckbox(input)
    } 
  }

  validateAllInputs() {
    const validatedInputs = Object.entries(this.fields).reduce((acc, [field, {type}]) => {
      const input = this.form[field]
      if(this.validateInput(input, type)) {
        acc.push(true)
      } else {
        this.markError(input)
        acc.push(false)
      }

      return acc
    }, [])

    return validatedInputs.every(Boolean)
  }

  createResultMessage(text) {
    const textBlock = document.createElement('p')
    textBlock.classList.add('p-result-message')
    textBlock.textContent = text

    return textBlock
  }

  async onSubmitHanlder(event) {
    event.preventDefault()

    const isFormValid = this.validateAllInputs()
    const cbResult = window[this.beforeSendCallback] ? window[this.beforeSendCallback](this.form) : true
    
    if(!isFormValid || !cbResult) return

    let result

    try {
      result = await this.sendData()
    } catch (error) {
      this.form.replaceWith(this.createResultMessage(this.failText))
    }

    if(result && result.answer === 'success') {
      this.form.replaceWith(this.createResultMessage(this.successText))
      return
    }

    this.form.replaceWith(this.createResultMessage(this.failText))
  }

  async sendData() {
    const formData = new FormData(this.form)
    const response = await fetch(this.backendHandler, {
      method: 'POST',
      body: formData,
    });
  
    const request = await response.json();

    return request
  }

  init() {
    this.addFormListener()
    this.addInputListeners()
  }
}

customElements.define('p-form', class extends LitElement {
  static properties = { 
    successText: String,
    failText: String,
    backendHandler: String,
    beforeSendCallback: String,
  }

  constructor() {
    super();
    this.successText = ''
    this.failText = ''
    this.backendHandler = ''
    this.beforeSendCallback = ''
  }

  firstUpdated() {
    const formWrapper = this.shadowRoot.querySelector('[part="form-wrapper"]')
    const form = this.getSlottedByName()[0]
    form.setAttribute('novalidate', true)
    const rawFields = form.querySelectorAll('[data-validate]')

    const preparedFields = Array.from(rawFields).reduce((acc, field) => {
      acc[field.name] = {
        'type': field.dataset.type,
        'errorMessage': field.dataset.errormessage,
      }

      return acc
    }, {})

    const formInstance = new Form({
      'form': form,
      'fields': preparedFields,
      'formWrapper': formWrapper,
      'errorContainerClass': 'label',
      'successText': this.successText,
      'failText': this.failText,
      'backendHandler': this.backendHandler,
      'beforeSendCallback': this.beforeSendCallback,
    })

    formInstance.init()
  }

  getSlottedByName(name = '') {
    const search = name.trim() === '' ? 'slot' : `slot[name='${name}']`
    const slot = this.shadowRoot.querySelector(search)

    return slot.assignedElements({flatten: true})
  }

  render() {
    return html`
      <div part='form-wrapper'>
        <slot></slot>
      </div>
    `
  }
})
