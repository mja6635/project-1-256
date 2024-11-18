import { LitElement, html, css } from 'lit';
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";

export class Images extends DDDSuper(LitElement) {
  static get properties() {
    return {
      title: { type: String },
      description: { type: String },
      created: { type: String },
      updated: { type: String },
      slug: { type: String },
      baseURL: { type: String },
      logo: { type: String },
    };
  }

  constructor() {
    super();
    this.title = '';
    this.description = '';
    this.created = '';
    this.updated = '';
    this.slug = '';
    this.baseURL = '';
    this.logo = ''; 
  }

  static get styles() {
    return [super.styles, css`
    .card {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      border: 2px solid;
      margin: var(--ddd-spacing-2);
      padding: var(--ddd-spacing-4);
      box-shadow: var(--ddd-box-shadow-md);
    }

    .card-hover {
      box-shadow: var(--ddd-box-shadow-md);
    }

    img {
      width: 240px;
      height: auto;
      margin-bottom: 8px;
      border-radius: var(--ddd-radius-md);
    }

    .title {
      font-size: var(--ddd-font-size-s);
      text-align: center;
      margin: var(--ddd-spacing-2);
      color: var(--ddd-theme-default-forestGreen);
    }

    .description {
      text-align: center;
      font-size: var(--ddd-font-size-s);
      color: var(--ddd-theme-default-nittanyNavy);
    }
    `];
  }

  render() {
    return html`
      <a 
        class="card"
        tabindex="0"
        href="${this.baseURL}/${this.slug}"        
        target="_blank"
      >
      <img src="${this.logo.startsWith('http') ? this.logo : this.baseURL + '/' + this.logo}" alt="${this.title}" />

        <div class="description">${this.description}</div>
        ${this.created || this.updated ? html`
          <div class="dates">
            <p><strong>Updated:</strong> ${this.updated}</p>
          </div>
        ` : ''}
      </a>
    `;
  }

  static get tag() {
    return 'these-images';
  }
}

customElements.define(Images.tag, Images);