import {LitElement, html, css} from 'https://cdn.jsdelivr.net/gh/lit/dist@2/core/lit-core.min.js';
// DOCS: https://github.com/Hi-Pyncho/web-components#modal

customElements.define('p-modal', class extends LitElement {
  static styles = css`
    .modal-wrapper {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      display: none;
      place-items: center;
    }
    .modal-wrapper--opened {
      display: grid;
      z-index: 10000;
    }
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: #00000032;
      z-index: 1000;
    }
    .modal-container {
      position: relative;
      background-color: #fff;
      padding: 3rem 2rem 2rem;
      z-index: 1001;
      max-height: 90vh;
    }
    .modal-container.noButton {
      padding: 2rem;
    }
    .modal-close {
      --size: 1.5rem;
      position: absolute;
      top: .5rem;
      right: .5rem;
      display: block;
      appearance: none;
      -moz-appearance: none;
      -webkit-appearance: none;
      box-shadow: none;
      border: none;
      background-color: rgba(0, 0, 0, 0);
      width: var(--size);
      height: var(--size);
      cursor: pointer;
    }
    .modal-close::after,
    .modal-close::before {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      width: 100%;
      height: .1rem;
      background-color: #000;
      border-radius: .1rem;
    }
    .modal-close::after {
      transform: translate(-50%, -50%) rotate(45deg)
    }
    .modal-close::before {
      transform: translate(-50%, -50%) rotate(-45deg)
    }
  `

  constructor() {
    super();
    this.focusableElements = []
    this.focusIndex = 0
    this.slotModalName = 'modalContent'
    this.openedClassName = 'modal-wrapper--opened'
    this.blockBodyClassName = 'p-block'
  }

  getSlottedByName(name = '') {
    const search = name.trim() === '' ? 'slot' : `slot[name='${name}']`
    const slot = this.shadowRoot.querySelector(search)

    return slot.assignedElements({flatten: true})
  }

  blockHtml() {
    document.documentElement.classList.add(this.blockBodyClassName)
  }

  unblockHtml() {
    document.documentElement.classList.remove(this.blockBodyClassName)
  }

  closeModal() {
    this.unblockHtml()

    this.dispatchEvent(new CustomEvent('closed', { detail: this.getSlottedByName(this.slotModalName) }))
    this.teleportModalBack()
    this.modalContainer.classList.remove(this.openedClassName)
    this.clearState()

    this.openModalButton.focus()
  }

  clearState() {
    this.focusableElements.forEach(element => {
      element.removeEventListener('focus', this.handleFocus)
    })

    this.focusableElements = []
    this.lastFocusableElement = null
    this.firstFocusableElement = null
    this.focusIndex = 0

    this.removeEventListener('keydown', this.isolateFocus)
  }

  isolateFocus = (event) => {
    if(event.key === 'Tab') {
      event.preventDefault()
    }

    if(event.key === 'Escape') {
      this.closeModal()
      return
    }

    switch (true) {
      case event.shiftKey && event.key === 'Tab':
        const prev = this.focusIndex - 1

        if(prev < 0) {
          this.lastFocusableElement?.focus()
        } else {
          this.focusableElements[prev]?.focus()
        }
        break;
    
      case event.key === 'Tab':
        const next = this.focusIndex + 1

        if(next > this.focusableElements.length - 1) {
          this.firstFocusableElement?.focus()
        } else {
          this.focusableElements[next]?.focus()
        }
        break;
    }
  }

  handleFocus = (event) => {
    const target = event.target
    this.lastFocused = target
    this.focusIndex = Number(target.dataset.focus)
  }

  initFocusTrap() {
    const closeButton = this.modalContainer.querySelector('.modal-close')
    const modalContent = this.getSlottedByName(this.slotModalName)[0]

    this.firstFocusableElement = closeButton
    this.focusableElements = [...modalContent.querySelectorAll('*')].filter(element => element.tabIndex >= 0)
    this.lastFocusableElement = this.focusableElements[this.focusableElements.length - 1]
    this.focusableElements = [this.firstFocusableElement, ...this.focusableElements]
    
    this.focusableElements.forEach((element, index) => {
      element.setAttribute('data-focus', index)
      element.addEventListener('focus', this.handleFocus)
    })

    this.addEventListener('keydown', this.isolateFocus)
    this.focusableElements[0] && this.focusableElements[0].focus()
  }

  openModal() {
    this.blockHtml()
    this.createOpenModalClone()

    this.modalContainer = this.shadowRoot.querySelector('.modal-wrapper')

    this.dispatchEvent(new CustomEvent('opened', { detail: this.modalContainer }))

    this.teleportModalToBodyEnd()
    
    this.modalContainer.classList.add(this.openedClassName)
    this.initFocusTrap()
  }

  createOpenModalClone() {
    this.openModalButton = this.getSlottedByName('openModal')[0]
    this.cloneOpenModalButton = this.openModalButton.cloneNode(true)
  }

  teleportModalToBodyEnd() {
    this.openModalButton.hidden = true
    this.after(this.cloneOpenModalButton)

    document.body.append(this)
  }

  teleportModalBack() {
    this.cloneOpenModalButton.replaceWith(this)
    this.openModalButton.hidden = false
  }

  render() {
    return html`
      <slot @click='${this.openModal}' name='openModal'></slot>
      <div class="modal-wrapper">
        <div @click=${this.closeModal} class="modal-overlay"></div>
        <div class="modal-container ${this.hideCloseButton ? 'noButton' : ''}"  part='container'>
          <button part='modal-close' class='modal-close' @click=${this.closeModal}></button>
          <slot name='closeModal' @click='${this.closeModal}'></slot>
          <slot name='${this.slotModalName}'></slot>
        </div>
      </div>
    `
  }
})
