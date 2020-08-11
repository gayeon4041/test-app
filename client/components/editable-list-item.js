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
        grid-template-columns: auto 1fr 2fr 1fr;
      }

      button {
        border: 0;
        outline: 0;
        border-radius: 8px;
        margin-right: 5px;
      }

      .submitBtn {
        border: 0;
        outline: 0;
        border-radius: 8px;
      }

      .listName {
        color: #ef5956;
        font-weight: 700;
      }

      #editForm {
        display: grid;
        grid-template-columns: 1fr 2fr 1fr 1fr 1fr 1fr;
      }

      #editForm input {
        margin-right: 5px;
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
      selectMode: Boolean,
      selectAllMode: Boolean
    }
  }

  render() {
    //편집모드
    const editingTemplate = html`
      <form id="editForm" @submit=${this.updateItem}>
        ${this.fields.map(
          f => html` <input type=${f.type} name=${f.name} .value=${this.item[f.name]} .hidden=${!f.display.editing} /> `
        )}
        <input class="submitBtn" type="submit" value="save" />
        <button @click=${this.toggleEditMode}>cancel</button>
        <button @click=${this.deleteItem}>delete</button>
      </form>
    `

    //기본모드
    const baseTemplate = html` <div>
      ${this.selectMode
        ? html`<input type="checkbox" @change=${this.selectedEvent} .checked=${this.isSelected} />`
        : html``}
      ${this.fields.map(
        f =>
          html`
            ${f.display.editing
              ? html`<span class="listValue"><span class="listName">${f.name}:</span> ${this.item[f.name]}</span>`
              : html``}
          `
      )}
      <button id="edit-btn" @click=${this.toggleEditMode} .hidden=${this.selectMode}>
        edit
      </button>
    </div>`

    const template = this.isEditing ? editingTemplate : baseTemplate
    return template
  }

  constructor() {
    super()

    this.fields = []
    this.isSelected = false
  }

  updated(changed) {
    if (changed.has('selectMode') && !this.selectMode) {
      this.clearAll()
    }
    if (changed.has('selectAllMode') && !this.selectAllMode) {
      this.isSelected = true
    } else if (changed.has('selectAllMode') && this.selectAllMode) {
      this.clearAll()
    }
  }

  clearAll() {
    this.isSelected = false
  }

  selectedEvent(e) {
    this.isSelected = e.currentTarget.checked
  }

  toggleEditMode(e) {
    this.isEditing = !this.isEditing
    console.log(this.isEditing)
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
