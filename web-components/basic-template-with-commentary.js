import {LitElement, html, css} from 'lit';

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

    return slot.assignedElements({flatten: true})[0]
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
