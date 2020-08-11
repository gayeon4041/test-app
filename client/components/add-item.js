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
        border: 1px solid #ed6856;
        border-radius: 8px;
        padding: 20px;
      }

      form label {
        grid-template-columns: 1fr 2fr;
        color: #ef5956;
        font-weight: 700;
      }

      form input {
        border: 1px solid #dbc5b0;
        border-radius: 5px;
      }

      .create-button {
        margin-top: 10px;
        border: 0;
        outline: 0;
        color: #ffffff;
        background-color: #ef5956;
        padding: 10px;
        border-radius: 8px;
        font-weight: 700;
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
              ? html` <label>${f.name}: <input type=${f.type} name=${f.name} /> </label>`
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

    const form = this.renderRoot.querySelector('#add-form')
    const formData = new FormData(form)

    const addObj = await Object.fromEntries(formData.entries())
    let successForm = true
    for (let key in addObj) {
      if (addObj[key] === '') {
        console.log('모두 입력해주세요')
        successForm = false
      }
    }
    if (successForm) {
      await this.addEmployee(addObj)
      form.reset()
    }
  }
}

customElements.define('add-item', AddItem)
