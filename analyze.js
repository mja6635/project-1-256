import { LitElement, html, css } from 'lit';
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";
import "./search.js";

class analyze extends DDDSuper(LitElement){
  static get styles() {
    return css`
    :host {
      display: block
    }
    .search-continer{
      display: flex;
      background-color: #808080;
      border-radius: 12px;
      border: var(--ddd-border-lg) solid #808080;
      padding: var(--ddd-spacing-2) var(--ddd-spacing-3);
      width: 100%;
      max-width: 600px;
      margin: 15px auto;
    }
    .results {
      visibility: visible;
      height: 100%;
    }
    summary {
      font-size: (---ddd-);
      padding:(---ddd-);
      color: gold;
    }

    input {
      font-size: (---ddd-);
      line-height: (---ddd-);
      width: 100%;
    }

    .serch-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      margin:var(---ddd-spacing-4);
      color: #808080;
      font-size: 15px;
    }
    `;
  }

  static get properties() {
    return {
      url: {type: String},
      isValid: {type: Boolean, reflect: true},
    };
  }

  constructor() {
    super();
    this.url = null;
    this.isValid = false;
  }

  updated(changeProperties) {
    if(changeProperties.has('url')) {
      if (this.url && this.url.endsWith('site.json')) {
        this.isValid = true;

      }
    }
  }

  render() {
    if (this.url == ''){this.url ='https://haxtheweb.org/site.json';}
    else if (!this.url || !this.url.endsWith('site.json')) {this.url +='/site.json'}

    return html`
      <div class="search-container">
        <div class="search-icon"><button @click="${this._analyze}">analyze</button></div>
        <input
        class="search-input-"
        type="text"
        @input="${this._updateUrl}"
        />
          </div>

        `;
  }

  async analyzeSite() {
    if (!this.url || !this.url.endsWith('site.json')) {
      this.errorMessage = 'Please enter a valid URL ending in site.json.';
      return;
    }

    try {
      const response = await fetch(this.url);
      if (!response.ok) throw new Error('Failed to fetch site.json');

      const data = await response.json();
      if (!data.items || !data.metadata) throw new Error('Invalid site.json format');

      this.siteDetails = {
        name: data.metadata.name,
        description: data.metadata.description,
        logo: data.metadata.logo,
        theme: data.metadata.theme,
        created: data.metadata.created,
        lastUpdated: data.metadata.lastUpdated,
        hexCode: data.metadata.hexCode
      };

      this.items = data.items.map(item => ({
        title: item.title,
        description: item.description || 'No description available',
        lastUpdated: item.lastUpdated,
        image: item.image || 'placeholder.png',
        link: item.link,
        sourceLink: item.slug ? `${this.url.replace('/site.json', '')}/index.html` : ''
      }));

      this.errorMessage = '';
    } catch (error) {
      this.errorMessage = `Error: ${error.message}`;
      this.siteDetails = null;
      this.items = [];
    }
  }
}

customElements.define(analyze.tag, analyze);
