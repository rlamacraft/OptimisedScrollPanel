import {fetchHTML} from '../../utils/fetch.js';

const fetchingTemplate = fetchHTML('customElement/osp-container/template.html'); //TODO: relative URL

export async function setup() {
  const template = await fetchingTemplate;
  const containerTemplate = template.getElementById("template_container");

  class Container extends HTMLElement {

    constructor() {
      super();
      const shadow = this.attachShadow({mode: 'open'});
      const clonedTemplate = document.importNode(containerTemplate.content, true);
      shadow.appendChild(clonedTemplate);

      this.box = this.shadowRoot.getElementById('box');
      this.counter = 0;
      this.userScroll = false;

      this.shadowRoot.getElementById('stop').addEventListener('click', evt => {
        if(typeof(this.timer) !== "undefined") {
          clearInterval(this.timer);
        }
      });

      this.shadowRoot.getElementById('hold').addEventListener('click', evt => {
        this.userScroll = true;
      });

      this.shadowRoot.getElementById('bottom').addEventListener('click', evt => {
        this.scroll(this.box.scrollHeight);
        this.userScroll = false;
      });

      this.populate();
    }

    scroll(x) {
      this.box.scrollTo({top:x, left:0, behavior: !this.userScroll ? 'auto' : 'smooth'});
    }

    static get observedAttributes() {
      return ['height'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
      if(name === 'height') {
        this.box.style.height = `${newValue}em`;
      }
    }

    populate() {
      this.timer = window.setInterval(() => {
        for(let i = 0; i < 100; i++) {
          const newRowNode = document.createElement('span');
          newRowNode.innerText = `${this.counter * 10 + i}\n`;
          this.box.appendChild(newRowNode);
        }
        this.counter += 1;
        if(!this.userScroll) {
          this.scroll(this.box.scrollHeight);
        }
      }, 100);
    }

  }

  customElements.define('osp-container', Container);
}