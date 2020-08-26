import { LitElement, html, css } from 'lit-element'

export class AddItem extends LitElement {
  static get styles() {
    return css`
      [hidden] {
        display: none;
      }

      form label {
        display: block;
      }

      form {
        display: flex;
        flex-direction: column;
        align-items: center;
        border: 3px solid #ed6856;
        border-radius: 8px;
        padding: 20px;
      }

      form label {
        grid-template-columns: 1fr 2fr;
        color: #ef5956;
        font-weight: 700;
      }

      form input {
        border: 1px solid #ef5956;
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

      h3 {
        margin: 5px;
        color: #ef5956;
      }
    `
  }

  static get properties() {
    return {
      fields: Array,
      defaultValues: Object,
      addItemList: Function,
      addFormName: String
    }
  }

  render() {
    return html`
      <form id="add-form" @submit=${this.addFunction}>
        <h3>Add ${this.addFormName}</h3>
        <div>
          ${this.fields.map(
            f =>
              html`
                <label ?hidden=${!f.display}
                  >${f.name}:
                  <input type=${f.type} name=${f.name} .value=${this.defaultValues[f.name] ?? ''} />
                </label>
              `
          )}
        </div>
        <input class="create-button" type="submit" value="create" />
      </form>
    `
  }

  constructor() {
    super()

    this.fields = []
    this.defaultValues = {}
  }

  async addFunction(e) {
    e.preventDefault()

    const form = this.renderRoot.querySelector('#add-form')
    const formData = new FormData(form)

    let addObj = await Object.fromEntries(formData.entries())
    addObj = { ...addObj, toLowerName: addObj.name.toLowerCase() }

    console.log(addObj)
    let successForm = true
    for (let key in addObj) {
      if (addObj[key] === '') {
        console.log('모두 입력해주세요')
        successForm = false
      }
    }
    if (successForm) {
      await this.addItemList(addObj)
      form.reset()
    }
  }
}

customElements.define('add-item', AddItem)
