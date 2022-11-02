# Web components (+[lit](https://lit.dev/) dependency)

- [General information](#general-information)
  - [About components and the dependency](#about-components-and-the-dependency)
  - [How to install dependency](#how-to-install-dependency)
  - [How to use components](#how-to-use-components)
  - [How to style components](#how-to-style-components)
  - [Other information](#other-information)
- [Components](#components)
  - [Select](#select)
  - [Modal](#modal)

___
## General information
___

### About components and the dependency
i can't use frameworks (like React or Vue) on every project, so i started creating these components. This way is more flexible and convenient for me, because i have not always opportunity to use Node.js and building projects in module bundlers (like __Webpack__). There are a lot of small buisinesses that use `php` or other server programming languages. And there is less entry threshold in using native web components, then in frontend frameworks.

Also i tried to create accessible components. And if a browser don't support web-component, a browser will display the element you insert.

To make and use web-components more comfortable, i used the [lit library](https://lit.dev/). It adds some  syntactic sugar to skip the boilerplate and other useful features on top of standard web-components. You no need to build or compile code. It is progressive enhancement and already ready to use.

There is no minify version. I use these components for my work and i want keep it in a readable state. You can minify files in your project if you want.

### How to install dependency

There are  two ways to install and use these components:

#### First way
In html document declare script tag with `importmap` type. And after that paste script with components.
_In html file_
```html
<script type="importmap">
  {
    "imports": {
      "mylib": "https://cdn.jsdelivr.net/gh/lit/dist@2/core/lit-core.min.js"
    }
  }
</script>
<script defer type='modal' src='web-component-path'></script>
```
_In js file_
```javascript
import {LitElement, html, css} from 'lit';
```

#### Second way
Just declare the dependency right in the js file.
__In html file__
```html
<script defer type='modal' src='web-component-path'></script>
```
__In js file__
```javascript
import {LitElement, html, css} from 'https://cdn.jsdelivr.net/gh/lit/dist@2/core/lit-core.min.js';

// here component code...
```

___
### How to use components
Generally web component consist of three elements:
1) component tag (`<my-modal></my-modal>`)
2) attributes (to control modal: `<my-modal opened></my-modal>`)
3) entries (pasted into `<slot>...elements</slot>` element);

Here are an example:
```html
<my-modal opened>
  <div slot='modal-header'>
    <!-- elements -->
  </div>
  <div>
    <!-- elements -->
  </div>
</my-modal>
```
In this example i use `slot` attribute to place element to certain place in the web component
In the web component it looks like this:
```html
<slot name='modal-header'></slot> <!-- there will be "<div slot='modal-header'>" -->
<slot></slot> <!-- there will be other no named elements -->
```
For more examples you can explore the code of web components
___
### How to style components
In the web components you can give an access to contol styles. And there are two main ways to do it.
1) use global css custom properties inside the web component
2) declare in web component `part` attribute and style it from css using `::part()` function

Examples:

#### First way
_Global styles_
```css
:root {
  --button-bg-color: #fff;
}
```
_Web component style_
```css
.button {
  background-color: var(--button-bg-color, #000);
}
```

#### Second way
_Web component html_
```html
<button part='button'>Click me!</button>
```
_Global styles_
```css
::part(button) {
  background-color: #fff;
}
```


___
### Other information
For more comfortable using web components, vs code has two plugins: [lit-plugin](https://marketplace.visualstudio.com/items?itemName=runem.lit-plugin) and
[lit-html](https://marketplace.visualstudio.com/items?itemName=bierner.lit-html)

Also you can download basic-template files and make from them snippets for your IDE.
- [with commentaries](./web-components/basic-template-with-commentary.js)
- [without commentaries](./web-components/basic-template-without-commentary.js)

___
## Components
___

### Select
[Interactive example](https://codepen.io/Pyncho/pen/xxzwdVm)
[Path to component code](./web-components/p-select.js)

```html
<p-select>
  <select> <!-- ::part(custom-select__list) -->
    <option value="first"> <!-- ::part(custom-select__trigger) -->
      first option
    </option>
    <option value="second">
      second option
    </option>
    <option value="third">
      third option
    </option>
  </select>
</p-select>
```


### Modal
[Interactive example](https://codepen.io/Pyncho/pen/jOKbmvx)
[Path to component code](./web-components/p-modal.js)

There is a focus trap in this component for more a11y.

| attribute | description | default value |
|--|--|--|
| opened | you can use this attribute to control state of the modal component | false |
| hideopenbutton | if you don't want display trigger button for opening modal (for example, you add modal dynamically to the page from your code) | false |

To style modal close button use `::part(modal-close)`.

```html
<p-modal>
  <button slot="openModal">open</button> <!-- your own button to open a modal -->
  <div slot="modalContent" class="slotted"> <!-- place for the modal content -->
    <form>
      <input type="text" name="name">
      <input type="text" name="lastname">
      <input type="submit" value="submit">
    </form>
  </div>
</p-modal>
```

