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
      background-color: var(--ddd-theme-default-forestGreen);
      text-decoration: none;
      box-shadow: var(--ddd-box-shadow-sm);
    }

    .card-hover {
      box-shadow: var(--ddd-box-shadow-md);
      background-color: var(--ddd-theme-default-keystoneYellow);
    }

    img {
      width: 240px;
      height: auto;
      margin-bottom: 8px;
      border-radius: var(--ddd-radius-lg);
    }

    .title {
      font-size: var(--ddd-font-size-m);
      text-align: center;
      margin: var(--ddd-spacing-4);
    }

    .description {
      text-align: center;
      font-size: var(--ddd-font-size-m);
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
        <img src="${this.logo ? this.baseURL + '/' + this.logo : 'https://via.placeholder.com/100'}" alt="${this.title}" />
        <div class="title">${this.title}</div>
        <div class="description">${this.description}</div>
        ${this.created || this.updated ? html`
          <div class="dates">
            <p><strong>Created:</strong> ${this.created}</p>
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