import { LitElement, css, html } from 'lit-element'
import { connect } from 'pwa-helpers/connect-mixin.js'
import { store, navigate } from '@things-factory/shell'
import { UPDATE_DETAIL_INFO } from '../actions/employee-list'

export class EditableListItem extends connect(store)(LitElement) {
  static get styles() {
    return css`
      :host {
        width: 100%;
        height: 100%;
      }

      button {
        border: 0;
        outline: 0;
        border-radius: 8px;
        margin-right: 5px;
      }

      .listName {
        color: #ef5956;
        font-weight: 700;
      }

      .listValue {
        margin-right: 10px;
      }

      .detail-btn {
        padding: 5px 10px;
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
      selectObject: Object,
      selectMode: Boolean,
      selectAll: Boolean
    }
  }

  render() {
    //기본모드
    const baseTemplate = html` <div>
      ${this.selectMode
        ? html`<input type="checkbox" @change=${this.selectedEvent} .checked=${this.isSelected} />`
        : html``}
      ${this.fields.map(
        f =>
          html`
            ${f.display.plain
              ? html`<span class="listValue"><span class="listName">${f.name}:</span> ${this.item[f.name]}</span>`
              : html``}
          `
      )}
      <button class="detail-btn" @click=${this.navigateToDetail} .hidden=${this.selectMode}>
        detail
      </button>
    </div>`

    return baseTemplate
  }

  constructor() {
    super()

    this.fields = []
    this.item = {}
    this.isSelected = false
  }

  updated(changed) {
    if (changed.has('selectMode') && !this.selectMode) {
      this.clearAll()
    }

    if (changed.has('selectAll') && this.selectAll) {
      this.isSelected = true
    }
  }

  async updateItemFunction(item) {
    await this.updateFunction(item)
  }

  clearAll() {
    this.isSelected = false
    this.selectAll = false
  }

  selectedEvent(e) {
    this.isSelected = e.currentTarget.checked
  }

  navigateToDetail() {
    navigate(`employee-detail?id=${this.item.id}`)
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

  async stateChanged(state) {
    this.selectMode = state.employeeList.selectMode
    this.selectAll = state.employeeList.selectAll
  }
}

customElements.define('editable-list-item', EditableListItem)
