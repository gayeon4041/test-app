import { LitElement, html, css } from 'lit-element'

export class AddItem extends LitElement {
  static get styles() {
    return css`
      [hidden] {
        display: none;
      }

      form {
        display: flex;
        flex-direction: column;
        align-items: center;
        border: 3px solid #7f8fa6;
        border-radius: 3px;
        padding: 20px;
      }

      form label {
        color: #353b48;
        font-weight: 700;
      }

      form input {
        border: 1px solid #7f8fa6;
        border-radius: 3px;
        width: 200px;
      }

      .create-button {
        margin-top: 20px;
        border: 0;
        outline: 0;
        color: #ffffff;
        background-color: #273c75;
        padding: 5px 15px;
        border-radius: 5px;
        font-weight: 700;
      }

      h3 {
        background-color: #273c75;
        color: #ffffff;
        margin-bottom: 0;
        padding: 1px 5px;
      }
    `
  }

  static get properties() {
    return {
      fields: Array,
      defaultValues: Object,
      addItemList: Function,
      addFormTitleName: String
    }
  }

  render() {
    return html`
      <h3>Add ${this.addFormTitleName}</h3>
      <form id="add-form" @submit=${this.addFunction}>
        ${this.fields.map(
          f =>
            html`
              <label ?hidden=${!f.display}
                >${f.name}:
                <input type=${f.type} name=${f.name} .value=${this.defaultValues[f.name] ?? ''} />
              </label>
            `
        )}
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
