import { LitElement, html, css } from 'lit-element'

export class TestAppTitle extends LitElement {
  static get styles() {
    return css`
      h1 {
        color: #353b48;
      }
    `
  }

  static get properties() {
    return {
      title: String
    }
  }

  render() {
    return html`
      <div>
        <h1>${this.title}</h1>
      </div>
    `
  }

  constructor() {
    super()
  }
}

customElements.define('test-app-title', TestAppTitle)
