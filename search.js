import { LitElement, html, css } from 'lit';
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";
import "./images.js"; 

/**
 * Search Component
 * @demo index.html
 * @element search
 */
export class Search extends DDDSuper(LitElement) {
  static get tag() {
    return "search";
  }

  constructor() {
    super();
    this.value = '';
    this.title = '';
    this.loading = false;
    this.items = [];
    this.jsonurl = 'https://haxtheweb.org/site.json';
    this.baseURL = this.noJsonEnding(this.jsonurl);
    this.metadata = null; 
  }
  
  static get properties() {
    return {
      value: { type: String },
      title: { type: String },
      loading: { type: Boolean, reflect: true },
      items: { type: Array },
      jsonurl: { type: String, attribute: 'json-url' },
      baseURL: { type: String },
      metadata: { type: Object },
    };
  }

  static styles = css`
    :host {
      display: block;
    }

    .search-container {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      max-width: 240px;
      margin: 24px auto;
      padding: 8px 16px;
      border: 2px solid var(--ddd-theme-default-alertUrgent);
      border-radius: var(--ddd-radius-sm);
      background-color: var(--ddd-theme-default-link80);
    }

    input {
      font-size: 24px;
      line-height: var(--ddd-lh-auto);
    }

    button {
      padding: 8px 16px;
      background-color: #4CAF50;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }

    button:disabled {
      background-color: var(--ddd-theme-default-warning);
      cursor: not-allowed;
    }

    .overview {
      margin: 16px;
      padding: 16px;
      border: 1px solid #ccc;
      border-radius: 8px;
      background-color: #f9f9f9;
    }

    .overview img {
      max-width: 100px;
      height: auto;
      margin-bottom: 8px;
    }

    .result {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
      gap: 16px;
    }
  `;

  render() {
    return html`
      <h2>${this.title}</h2>
      <div class="search-container">
        <input 
          id="input" 
          class="check-input" 
          placeholder="Enter site here" 
          @input="${this.inputChanged}" 
        />
        <div class="button">
          <button @click="${this.analyze}" ?disabled="${!this.jsonurl}">Analyze</button>
        </div>

      </div>
      ${this.metadata ? html`
        <div class="overview">
          <h3>Overview</h3>
          <p><strong>Name:</strong> ${this.metadata.name}</p>
          <p><strong>Description:</strong> ${this.metadata.description}</p>
          ${this.metadata.logo ? html`<img src="${this.baseURL}/${this.metadata.logo}" alt="${this.metadata.name}" />` : ''}
          <p><strong>Theme:</strong> ${this.metadata.theme}</p>
          <p><strong>Created:</strong> ${this.metadata.created}</p>
          <p><strong>Last Updated:</strong> ${this.metadata.updated}</p>
        </div>
      ` : ''}
      <div class="result">
        ${this.items.map((item) => {
            const img = item.metadata?.files?.[0] || null;
          return html`
            <these-images
              title="${item.title}"
              description="${item.description}"
              logo="${img}"
              slug="${item.slug}"
              baseURL="${this.baseURL}">
        </these-images>
          `;
        })}
      </div>
    `;
  }
  
  inputChanged() {
    const input = this.shadowRoot.querySelector('#input').value;
    this.jsonurl = input.endsWith('site.json') ? input : input ? `${input}/site.json` : '';
    if (!this.jsonurl) {
      this.items = [];
      this.metadata = null;
    }
  }
  

  updated(changedProperties) {
    if (changedProperties.has('jsonurl') && this.jsonurl) {
      this.updateResults(this.jsonurl);
    }
  }

  noJsonEnding(url) { 
    return url.replace(/\/?[^\/]*\.json$/, '');
  }

  async updateResults(url) {
    this.loading = true;
    this.baseURL = this.noJsonEnding(url);
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error('Invalid URL or JSON');
      const data = await response.json();
      if (!this.validateJson(data)) throw new Error('Invalid JSON schema');
      this.items = data.items;
      this.metadata = {
        name: data.name || 'Unknown',
        description: data.description || 'No description provided',
        logo: data.metadata?.logo || '',
        theme: data.metadata?.theme || 'Unknown',
        created: data.metadata?.created || 'N/A',
        updated: data.metadata?.updated || 'N/A',
      };
    } catch (error) {
      console.error(error);
      this.items = [];
      this.metadata = null;
    } finally {
      this.loading = false;
    }
  }

  validateJson(data) {
    return data && Array.isArray(data.items) && data.items.length > 0;
  }
}

customElements.define(Search.tag, Search);