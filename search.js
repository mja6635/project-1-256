import { LitElement, html, css } from 'lit';
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";
import "./images.js";

class Search extends LitElement {
  static get properties() {
    return {
      url: { type: String },
      isValid: { type: Boolean },
    };
  }
 
  constructor() {
    super();
    this.url = '';
    this.isValid = false;
  }

  _updateUrl(e) {
    this.url = e.target.value.trim();
    this.isValid = this.url.endsWith('site.json');
    this.dispatchEvent(new CustomEvent('url-updated', { detail: { url: this.url } }));
  }

  render() {
    return html`
      <div class="search-container">
        <input
          type="text"
          placeholder="Enter site URL"
          @input="${this._updateUrl}"
        />
        <button 
          @click="${() => this._analyze()}" 
          ?disabled="${!this.isValid}">
          Analyze
        </button>
      </div>
    `;
  }

  _analyze() {
    this.dispatchEvent(new CustomEvent('analyze-requested', { detail: { url: this.url } }));
  }

  static styles = css`
    .search-container {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px;
      border-radius: 4px;
      background-color: #f5f5f5;
    }

    input {
      flex: 1;
      padding: 8px;
      border: 1px solid #ccc;
      border-radius: 4px;
    }

    button {
      padding: 8px 16px;
      background-color: #4CAF50;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }

    button[disabled] {
      background-color: #ccc;
      cursor: not-allowed;
    }
  `;
}

customElements.define('search', Search);
