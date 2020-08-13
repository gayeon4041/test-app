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
      //updatedEmp: Object
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
      <button id="detail-btn" @click=${this.navigateToDetail} .hidden=${this.selectMode}>
        detail
      </button>
    </div>`

    return baseTemplate
  }

  constructor() {
    super()

    this.fields = []
    this.item = {}
    this.updatedEmp = {}
    this.isSelected = false
  }

  updated(changed) {
    if (changed.has('selectMode') && !this.selectMode) {
      this.clearAll()
    }

    if (changed.has('selectAllMode')) {
      if (!this.selectAllMode) {
        this.isSelected = true
      } else {
        this.clearAll()
      }
    }
  }

  async updateItemFunction(item) {
    await this.updateFunction(item)
  }

  clearAll() {
    this.isSelected = false
  }

  selectedEvent(e) {
    this.isSelected = e.currentTarget.checked
  }

  navigateToDetail() {
    store.dispatch({
      type: UPDATE_DETAIL_INFO,
      detailInfo: {
        item: this.item,
        fields: this.fields,
        update: this.updateFunction,
        delete: this.deleteFunction
      }
    })
    console.log(this.updateFunction, this.deleteFunction)
    navigate('employee-detail')
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

  // //update
  // async updateItem(e) {
  //   e.preventDefault()

  //   const updateObj = this.serialize()
  //   await this.updateFunction(updateObj)

  //   this.quitEditMode()
  // }

  async stateChanged(state) {
    this.selectMode = state.employeeList.selectMode
  }
}

customElements.define('editable-list-item', EditableListItem)
