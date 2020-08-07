import { LitElement, html, css } from 'lit-element'

export class TestAppTitle extends LitElement {
  static get styles() {
    return css`
      h2 {
        color: gray;
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
        <h2>${this.title}</h2>
      </div>
    `
  }

  constructor() {
    super()
  }
}

customElements.define('test-app-title', TestAppTitle)
