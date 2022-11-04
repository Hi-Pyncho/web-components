import {LitElement, html, css} from 'lit';

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

  // Invoked when a component is added to the document's DOM
  connectedCallback() {
    super.connectedCallback()
    // code...
  }

  // Invoked when a component is removed from the document's DOM
  disconnectedcallback() {
    super.disconnectedcallback()
    // code...
  }

  // Called after the component's DOM has been updated the first time
  firstupdated() {
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
