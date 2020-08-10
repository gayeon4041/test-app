import { LitElement, css, html } from 'lit-element'

export class EditableListItem extends LitElement {
  static get styles() {
    return css`
      :host {
        width: 100%;
        height: 100%;
      }

      :host > div {
        display: grid;
        grid-template-columns: auto 1fr 1fr 1fr auto;
      }

      button {
        border: 0;
        outline: 0;
        border-radius: 8px;
      }

      .listName {
        color: gray;
      }

      #editForm {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
      }

      .listValue {
        margin-right: 10px;
      }
    `
  }

  static get properties() {
    return {
      item: Object,
      fields: Array,
      isEditing: Boolean,
      updateFunction: Function,
      deleteFunction: Function,
      isSelected: Boolean,
      selectMode: Boolean
    }
  }

  render() {
    //편집모드
    const editingTemplate = html`
      <form id="editForm" @submit=${this.updateItem}>
        ${this.fields.map(
          f => html` <input type=${f.type} name=${f.name} .value=${this.item[f.name]} .hidden=${!f.display.editing} /> `
        )}
        <input type="submit" value="save" />
        <button @click=${this.toggleEditMode}>cancel</button>
        <button @click=${this.deleteItem}>delete</button>
      </form>
    `

    //기본모드
    const baseTemplate = html` <div>
      <input type="checkbox" @change=${this.selectedEvent} .checked=${this.isSelected} .hidden=${!this.selectMode} />
      ${this.fields.map(
        f =>
          html`
            ${f.display.editing
              ? html`<span class="listValue"><span class="listName">${f.name}:</span> ${this.item[f.name]}</span>`
              : html``}
          `
      )}
      <button @click=${this.toggleEditMode}>edit</button>
    </div>`

    const template = this.isEditing ? editingTemplate : baseTemplate
    return template
  }

  constructor() {
    super()

    this.fields = []
    this.isSelected = false
  }

  selectedEvent(e) {
    this.isSelected = e.currentTarget.checked
  }

  toggleEditMode() {
    this.isEditing = !this.isEditing
  }

  //삭제
  async deleteItem(e) {
    e.preventDefault()

    const deleteObj = this.serialize()
    await this.deleteFunction(deleteObj)

    this.quitEditMode()
  }

  //edit모드 종료
  quitEditMode() {
    const form = this.renderRoot.querySelector('#editForm')
    form.reset()

    this.isEditing = false
  }

  //update
  async updateItem(e) {
    e.preventDefault()

    const updateObj = this.serialize()
    await this.updateFunction(updateObj)

    this.quitEditMode()
  }

  //form 정보를 객체(updateObj)로 받아오기

  serialize() {
    const form = this.renderRoot.querySelector('#editForm')
    const formData = new FormData(form)
    const updateObj = Object.fromEntries(formData.entries())

    return updateObj
  }
}

customElements.define('editable-list-item', EditableListItem)
