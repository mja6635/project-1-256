import { LitElement, html, css, AttributePart } from 'lit';
import { DDDSuper } from "@haxthewen/d-d-d/d-d-d.js";
import "./search.js";

class analyze extends DDDSuper(LitElement){
    contructor() {
        super ();
        this.value = '';
        this.title = '';
        this.loading = '';
        this.items = [];
        this.jsonUrl = 'https://haxtheweb.org/site.json';
    }
    static get properties() {
        return {
            title:{ type: String },
            loading: { type: Boolean, reflect: true },
            items: { type: Array },
            value: { type: String },
            jsonUrl: { type: String, attribute: 'json-url'}
        }
    }
    static get styles() {
        return css`
        :host {
            display: block;
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
        
        
        
        
        `
    }
}