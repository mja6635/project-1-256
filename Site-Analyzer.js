import { LitElement, html, css } from 'lit';

export class SiteAnalyzer extends LitElement {
  static get properties() {
    return {
      url: { type: String },
      siteDetails: { type: Object },
      items: { type: Array },
      errorMessage: { type: String }
    };
  }

  static get styles() {
    return css`
      /* Your existing CSS for component styles */
    `;
  }

  constructor() {
    super();
    this.url = '';
    this.siteDetails = null;
    this.items = [];
    this.errorMessage = '';
  }

  render() {
    return html`
      <div id="overview">
        ${this.siteDetails ? html`
          <h2>${this.siteDetails.name}</h2>
          <p>${this.siteDetails.description}</p>
          <img src="${this.siteDetails.logo}" alt="Site Logo">
          <p>Theme: ${this.siteDetails.theme}</p>
          <p>Created: ${this.siteDetails.created}</p>
          <p>Last Updated: ${this.siteDetails.lastUpdated}</p>
        ` : html`<p>${this.errorMessage || 'Enter a URL and click Analyze'}</p>`}
      </div>

      <div class="results">
        ${this.items.map(item => html`
          <div class="card">
            <img src="${item.image || 'placeholder.png'}" alt="${item.title}">
            <h3>${item.title}</h3>
            <p>Last Updated: ${item.lastUpdated}</p>
            <p>${item.description}</p>
            <button @click="${() => window.open(item.link, '_blank')}">Open Content</button>
            <button @click="${() => window.open(item.sourceLink, '_blank')}">View Source</button>
          </div>
        `)}
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

customElements.define('site-analyzer', SiteAnalyzer);
