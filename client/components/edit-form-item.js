import { LitElement, html, css } from 'lit-element'

export class EditFormItem extends LitElement {
  static get styles() {
    return css`
      #edit-form label {
        font-size: 20px;
        font-weight: 700;
        color: #353b48;
      }

      #edit-form {
        display: flex;
        flex-direction: column;
        align-items: center;
      }

      .btn-container {
        display: flex;
        justify-content: center;
        align-items: center;
        grid-template-columns: 1fr 1fr;
        width: 100%;
      }

      .btn-container button {
        width: 100%;
        margin: 1px;
      }

      .form-container {
        border: 3px solid #7f8fa6;
        border-radius: 5px;
        padding: 20px;
        width: 300px;
      }

      label input {
        border-radius: 5px;
        border: none;
        background-color: #f5f6fa;
        padding: 5px;
        width: 200px;
      }

      #edit-form {
        width: 100%;
      }

      #edit-form input {
        margin: 20px 0;
      }

      button {
        border: 0;
        outline: 0;
        border-radius: 8px;
        margin-right: 5px;
        padding: 5px;
        color: #ffffff;
        background-color: #273c75;
        font-weight: 700;
      }

      .submit-btn {
        border: 0;
        outline: 0;
        border-radius: 8px;
        padding: 5px;
        color: #ffffff;
        background-color: #273c75;
        font-weight: 700;
        width: 100%;
      }
    `
  }
  static get properties() {
    return {
      fields: Array,
      item: Object,
      updateItem: Function,
      deleteItem: Function,
      navigateToMain: Function
    }
  }

  render() {
    const editingTemplate = html`
      <div class="form-container">
        <form id="edit-form" @submit=${this.updateBtnClickEvent}>
          ${this.fields.map(
            f =>
              html`
                <div>
                  <label .hidden=${!f.display}
                    >${f.name}: <input type=${f.type} name=${f.name} .value=${this.item[f.name]}
                  /></label>
                </div>
              `
          )}

          <input class="submit-btn" type="submit" value="save" />
        </form>
        <div class="btn-container">
          <button @click=${this.cancelBtnClickEvent}>cancel</button>
          <button @click=${this.deleteBtnClickEvent}>delete</button>
        </div>
      </div>
    `

    return editingTemplate
  }

  constructor() {
    super()

    this.fields = []
    this.item = {}
  }

  serialize() {
    const form = this.renderRoot.querySelector('#edit-form')
    const formData = new FormData(form)
    const updateObj = Object.fromEntries(formData.entries())

    return updateObj
  }

  async updateBtnClickEvent(e) {
    e.preventDefault()

    const item = this.serialize()
    await this.updateItem(item)
  }

  async deleteBtnClickEvent() {
    await this.deleteItem()
  }

  cancelBtnClickEvent() {
    this.navigateToMain()
  }
}

window.customElements.define('edit-form-item', EditFormItem)
