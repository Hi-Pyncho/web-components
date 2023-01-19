import {LitElement, html, css} from 'https://cdn.jsdelivr.net/gh/lit/dist@2/core/lit-core.min.js';

customElements.define('p-modal', class extends LitElement {
  // these props needs to control component from outside
  // example <my-component property='false'></my-component>
  static properties = { 
    property: {
      type: Boolean, // type of a property
      reflect: true // if you need to control component from outside
    },
  }

  static styles = css`
    :host([property]) {} // to select element on top level of a web-component
    ::slotted(selector) {} // to select element in <slot></slot>
  `

  constructor() {
    super();
    // initial value for static property
    this.property = false
  }

  // custom function to get entries of <slot></slot> element
  getSlottedByName(name = '') {
    const search = name.trim() === '' ? 'slot' : `slot[name='${name}']`
    const slot = this.shadowRoot.querySelector(search)

    return slot.assignedElements({flatten: true})
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
  firstUpdated() {
    // code...
  }

  render() {
    return html`
      <!-- 
        now you have an access to control the element from outer css 
        example: ::part(modal) {}
      -->
      <div part='modal'></div> 

      <!-- 
        now if you will put your element inside this web-component 
        this element will appear right here
        example: <p slot='i-am-here'></p>
      -->
      <slot name='i-am-here'></slot>

      <!-- this way you can handle events -->
      <slot @click='${this.handleFunction}'></slot>
    `
  }
})
