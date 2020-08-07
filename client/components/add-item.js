import { LitElement, html, css } from 'lit-element'

export class AddItem extends LitElement {
  static get styles() {
    return css`
      form label {
        display: block;
      }

      form {
        display: flex;
        flex-direction: column;
        align-items: center;
        border: 1px solid #000000;
        border-radius: 8px;
        padding: 20px;
      }

      .create-button {
        margin-top: 10px;
      }
    `
  }

  static get properties() {
    return {
      fields: Array,
      addEmployee: Function
    }
  }

  render() {
    return html`
      <form id="add-form" @submit=${this.addFunction}>
        ${this.fields.map(
          f =>
            html` ${f.display.editing
              ? html` <label>${f.name} <input type=${f.type} name=${f.name} /> </label>`
              : html``}`
        )}
        <input class="create-button" type="submit" value="create" />
      </form>
    `
  }

  constructor() {
    super()

    this.fields = []
  }

  async addFunction(e) {
    e.preventDefault()
    debugger
    const form = this.renderRoot.querySelector('#add-form')

    const formData = new FormData(form)
    const addObj = await Object.fromEntries(formData.entries())

    await this.addEmployee(addObj)
  }
}

customElements.define('add-item', AddItem)
