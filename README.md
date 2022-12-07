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
  - [Loader](#loader)
  - [Accordion](#accordion)
  - [Tabs](#tabs)
  - [Form](#form)

___


## General information
___

### About components and the dependency
I could not use frameworks (like React or Vue) on every project, so I started creating these components. This way it is more flexible and convenient for me, because I don't have an opportunity to always use Node.js and to build projects in module bundlers (like __Webpack__). There are a lot of small buisinesses that use `php` or other server programming languages. And there is less entry threshold in using native web components, than in frontend frameworks.

To make web-components more comfortable, I used the [lit library](https://lit.dev/). It adds some syntactic sugar to skip the boilerplate and other useful features on top of standard web-components. You don't need to build or compile code. It is progressive enhancement and already ready to use.

There is no minify version. I use these components for my work and I want keep it in a readable state. You can minify files in your project if you want.

### How to install dependency

There are two ways to install and use these components:

#### First way
In html document declare script tag with the `importmap` type. And after that paste the script with components.
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
Generally web component consists of three elements:
1) component tag (`<my-modal></my-modal>`)
2) attributes (to control modal: `<my-modal opened></my-modal>`)
3) entries (pasted into `<slot>...elements</slot>` element);

There is an example:
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
In this example I use the `slot` attribute to place an element to a certain place in the web component
In the web component it looks like this:
```html
<slot name='modal-header'></slot> <!-- there will be "<div slot='modal-header'>" -->
<slot></slot> <!-- there will be other no named elements -->
```
For more examples you can explore the code of web components.

Also some web components can trigger custom events. For example, a modal component triggers `opened` and `closed` events. You can set a listener to the web component and get data from `event.detail`.

```js
document.querySelector('p-modal').addEventListener('opened', (event) => {
  console.log(event.detail)
})
```
___
### How to style components
In the web components you can give an access to contol styles. And there are two main ways to do it.
1) use global css custom properties inside the web component
2) declare in a web component `part` attribute and style it from css using `::part()` function

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

__Important!__
When page is loading and js file with web component code have not executed yet, you will face to FOAC (flash of unstyled content). And for a moment you will see usual html inside web-component. Here is an example:
```html
<p-select>
  <select>
    <option value="first">
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
In this example a browser starts rendering usual select. And when js code executes, select will be replaced by stylized web-component. Try it and you will see.
To avoid it, you should add these lines to css:
```css
:not(:defined) {
  opacity: 0;
}
```
Instead the `opacity` property you can use another way to hide an element. It will select all undefined web components on the page and hide them until web components initialize.

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

__Attributes__
| attribute | description | default value |
|--|--|--|
| needsearch | add search field for filtering options | false |

__Events__
| event | description | return |
|--|--|--|
| change | triggering when a custom option is clicked and chosen | clicked element with data- attributes |


### Modal
[Interactive example](https://codepen.io/Pyncho/pen/jOKbmvx)  


[Path to component code](./web-components/p-modal.js)

There is a focus trap in this component for more a11y.

__Attributes__
| attribute | description | default value |
|--|--|--|
| opened | you can use this attribute to control state of the modal component | false |
| hideopenbutton | if you don't want display trigger button (for example, you add modal dynamically to the page from your code) | false |

__Events__
| event | description | return |
|--|--|--|
| opened | triggering when a modal is opened | slotted element named 'modalContent' |
| closed | triggering when a modal is closed | slotted element named 'modalContent' |

__Parts__
| part | description |
|--|--|
| ::part(modal-close) | to style a modal close button |

```html
<p-modal>
  <button slot="openModal">open</button> <!-- your own button to open a modal -->

  <!-- place for the modal content -->
  <!-- set attribute 'hidden' to prevent rendering elements before init web-component -->
  <div hidden slot="modalContent" class="slotted"> 
    <form>
      <input type="text" name="name">
      <input type="text" name="lastname">
      <input type="submit" value="submit">
    </form>
  </div>
</p-modal>
```


### Loader
[Interactive example](https://codepen.io/Pyncho/pen/wvXGJgQ)  


[Path to component code](./web-components/p-loader.js)

__Attributes__
| attribute | description | default value |
|--|--|--|
| opened | you can use this attribute to control state of the loader component | false |
| custom | you can paste your loader html with styles (see the below example) | false |

__Styles__
| css-property | description | default value |
|--|--|--|
| --loader-overlay-color | background color of the overlay | #0000006b |
| --spiner-color | color of spiner elements | #fff |

```html
<p-loader custom opened>
  <div name='custom'>
    <!-- your loader -->
  </div>
</p-loader>
```

### Accordion
[Interactive example](https://codepen.io/Pyncho/pen/poKEzyJ)  


[Path to component code](./web-components/p-accordion.js)

__Attributes__
| attribute | description | default value |
|--|--|--|
| nocollapse | prevent closing all accordion elements, when one element is chosen | false |

__Parts__
| part | description |
|--|--|
| ::part(p-trigger) | to style trigger buttons |
| ::part(p-content) | to style content parts |

```html
<p-accordion nocollapse>
  <div slot="list">
    <button p-trigger>
      Lorem, ipsum dolor.
    </button>
      <div p-content>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Non delectus, quidem dolores veniam eveniet rerum a dolorum vero explicabo? Rerum eligendi asperiores ducimus iure velit! Ratione quas dolor amet facilis?
      </div>
    <button p-trigger>
      Lorem, ipsum dolor.
    </button>
      <div p-content>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Non delectus, quidem dolores veniam eveniet rerum a dolorum vero explicabo? Rerum eligendi asperiores ducimus iure velit! Ratione quas dolor amet facilis?
      </div>
    <button p-trigger>
      Lorem, ipsum dolor.
    </button>
      <div p-content>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Non delectus, quidem dolores veniam eveniet rerum a dolorum vero explicabo? Rerum eligendi asperiores ducimus iure velit! Ratione quas dolor amet facilis?
      </div>
  </div>
</p-accordion>
```

### Tabs
[Interactive example](https://codepen.io/Pyncho/pen/wvXzWRe)  


[Path to component code](./web-components/p-tabs.js)

__Attributes (main tag)__
| attribute | description | default value |
|--|--|--|
| nostyle | remove default styles and add an opportunity to style tabs by own | false |

__Parts__
| part | description |
|--|--|
| ::part(p-trigger) | to style trigger buttons |
| ::part(p-content) | to style content parts |

__Styles__
| css-property | description | default value |
|--|--|--|
| --custom-main-color | background color of triggers and content | #eee |
| --custom-padding | padding of triggers and content | 1rem |

```html
<p-tabs>
  <div slot="list">
    <button p-trigger>
      <!-- tab title -->
    </button>
    <div p-content>
      <!-- tab content -->
    </div>
    <button p-trigger>
      <!-- tab title -->
    </button>
    <div p-content>
      <!-- tab content -->
    </div>
    <button p-trigger>
      <!-- tab title -->
    </button>
    <div p-content>
      <!-- tab content -->
    </div>
  </div>
</p-tabs>
```

### Form
[Interactive example](https://codepen.io/Pyncho/pen/zYapzRm)  


[Path to component code](./web-components/p-form.js)

This component without any styling. It just a wrapper for a form. Needs to create a simple validation.

__Attributes (main tag)__
| attribute | description | default value |
|--|--|--|
| successtext (__required__) | text that will appear when the form will be successfully validated and send data to the server | '' |
| failtext (__required__) | text that will appear when the form will not send data to the server | '' |
| backendhandler (__required__) | path to form handler on the server | '' |
| beforesendcallback (__optional__) | custom callback to additionally validate form before data will be sended to the server (callback must return `false` or `true` and `IMPORTANT` - this function must be available globally from `window` object) | '' |

__Attributes (field tag) - all required__
| attribute | description |
|--|--|
| data-validate | it needs if you want to validate a field |
| [data-type](#validation-types) | types to validate a field value in different way |
| data-errormessage | the message that set to a parent `label` tag property `data-error` (see examples link above how to stylize it)  |

#### Validation types:
- `text` (check if a field value is empty)
- `tel` (check if a phone value is numbers and consists of 11 numbers)
- `email` (check if a email value fits the pattern)
- `checkbox` (check if a checkbox is checked)

`IMPORTANT!` - any input field must be wrapped by `label` tag to validate fields properly.

```html
 <p-form 
    successtext="Everything is fine" 
    failtext="We have a dangerous situation here" 
    beforesendcallback="validationCallback" 
    backendhandler="/path/to/handler.php"
  >
    <form>
      <label>
        <span>Name</span>
        <input 
          name="firstname" 
          data-validate 
          data-type="text" 
          data-errormessage="field should not be emtpy" 
          type="text"
        >
      </label>
      <label>
        <span>Phone</span>
        <input 
          name="phone" 
          data-validate 
          data-type="tel" 
          data-errormessage="phone is incorrect" 
          type="text"
        >
      </label>
      <label>
        <span>Email</span>
        <input 
          name="email" 
          data-validate 
          data-type="email" 
          data-errormessage="email is incorrect" 
          type="email"
        >
      </label>
      <label>
        <input 
          name="agree" 
          data-validate 
          data-type="checkbox" 
          data-errormessage="email is incorrect" 
          type="checkbox"
        >
        <span>Please, agree with our policy</span>
      </label>
     
      <input type="submit" value="confirm">
    </form>
  </p-form>
```
