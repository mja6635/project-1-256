import { LitElement, html, css } from 'lit';
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";
import "./images.js";

/**
 * Search Component
 * @demo index.html
 * @element site-search
 */
export class Search extends DDDSuper(LitElement) {
  static get tag() {
    return "site-search";
  }

  constructor() {
    super();
    this.value = '';
    this.title = 'Site Analyzer';
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
      max-width: 600px;
      margin: 24px auto;
      padding: 8px 16px;
      border: 2px solid var(--ddd-theme-default-alertUrgent);
      border-radius: var(--ddd-radius-sm);
      background-color: var(--ddd-theme-default-original87Pink);
    }

    input {
      font-size: 24px;
      line-height: var(--ddd-lh-auto);
    }

    button {
      padding: 8px 16px;
      background-color: var(--ddd-theme-default-nittanyNavy);
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
      border: 1px solid var(--ddd-theme-default-slateGrey);
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
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 16px;
      padding: var(--ddd-spacing-2);
    }

    .result > * {
      margin: 0 auto;
    }
  `;

  render() {
    console.log("Rendering site-search component...");
    return html`
      <h2>${this.title}</h2>
      <div class="search-container">
        <input 
          id="input" 
          class="check-input" 
          placeholder="Enter site URL here" 
          @input="${this.inputChanged}" 
        />
        <div class="button">
          <button @click="${this.analyze}" ?disabled="${!this.jsonurl}">Analyze</button>
        </div>
      </div>
      ${this.metadata
        ? html`
            <div class="overview">
              <h3>Overview</h3>
              <p><strong>Name:</strong> ${this.metadata.name}</p>
              <p><strong>Description:</strong> ${this.metadata.description}</p>
              ${this.metadata.logo
                ? html`<img src="${this.baseURL}/${this.metadata.logo}" alt="${this.metadata.name}" />`
                : ''}
              <p><strong>Theme:</strong> ${this.metadata.theme}</p>
              <p><strong>Created:</strong> ${this.metadata.created}</p>
              <p><strong>Last Updated:</strong> ${this.metadata.updated}</p>
            </div>
          `
        : ''}
      <div class="result">
        ${this.items.map((item) => {
          const img = item.metadata?.files?.[0]
            ? `${this.baseURL}/${item.metadata.files[0]}`
            : "https://via.placeholder.com/150";
          console.log("Constructed Image URL for item:", img); // Debug log
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
    console.log("Updated JSON URL:", this.jsonurl); // Debug log
    if (!this.jsonurl) {
      console.error("Invalid input: No URL provided.");
      this.items = [];
      this.metadata = null;
    }
  }

  async analyze() {
    if (!this.jsonurl) {
      console.error("Analyze called with empty URL.");
      return;
    }
    console.log("Analyzing site with URL:", this.jsonurl);
    await this.updateResults(this.jsonurl);
  }

  async updateResults(url) {
    console.log("Fetching data from URL:", url);
    this.loading = true;
    this.baseURL = this.noJsonEnding(url);
    try {
      const response = await fetch(url);
      console.log("Response Status:", response.status);
      if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
      const data = await response.json();
      console.log("Fetched JSON Data:", data);
      if (!this.validateJson(data)) throw new Error("Invalid JSON schema");
      this.items = data.items || [];
      this.metadata = {
        name: data.name || "Unknown",
        description: data.description || "No description provided",
        logo: data.metadata?.logo || "",
        theme: typeof data.metadata?.theme === "string" ? data.metadata.theme : "Unknown",
        created: data.metadata?.created || "N/A",
        updated: data.metadata?.updated || "N/A",
      };
    } catch (error) {
      console.error("Error fetching or processing JSON:", error);
      this.items = [];
      this.metadata = null;
    } finally {
      this.loading = false;
    }
  }

  noJsonEnding(url) {
    return url.replace(/\/?[^\/]*\.json$/, '');
  }

  validateJson(data) {
    return data && Array.isArray(data.items) && data.items.length > 0;
  }
}

customElements.define(Search.tag, Search);
