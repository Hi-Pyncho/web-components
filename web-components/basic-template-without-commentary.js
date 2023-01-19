import {LitElement, html, css} from 'https://cdn.jsdelivr.net/gh/lit/dist@2/core/lit-core.min.js';

customElements.define('p-modal', class extends LitElement {
  static properties = { 
    property: {
      type: Boolean, 
      reflect: true
    },
  }

  static styles = css`
    :host([property]) {} 
    ::slotted(selector) {}
  `

  constructor() {
    super();
    this.property = false
  }

  connectedCallback() {
    super.connectedCallback()
    // code...
  }

  disconnectedcallback() {
    super.disconnectedcallback()
    // code...
  }

  firstUpdated() {
    // code...
  }

  getSlottedByName(name = '') {
    const search = name.trim() === '' ? 'slot' : `slot[name='${name}']`
    const slot = this.shadowRoot.querySelector(search)

    return slot.assignedElements({flatten: true})
  }

  render() {
    return html`
      <div part='modal'></div> 
      <slot name='i-am-here'></slot>
      <slot @click='${this.handleFunction}'></slot>
    `
  }
})
