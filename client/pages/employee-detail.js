import { PageView, client, store, navigate } from '@things-factory/shell'
import { css, html } from 'lit-element'
import { connect } from 'pwa-helpers/connect-mixin.js'

import '../components/test-app-title'

class EmployeeDetail extends connect(store)(PageView) {
  static get styles() {
    return css`
      :host {
        display: flex;
        flex-direction: column;
      }

      section {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
      }
    `
  }
  static get properties() {
    return {
      item: Object,
      fields: Array
    }
  }

  render() {
    const editingTemplate = html` <form id="editForm" @submit=${this.updateItem}>
      ${this.fields.map(
        f => html` <input type=${f.type} name=${f.name} .value=${this.item[f.name]} .hidden=${!f.display.editing} /> `
      )}
      <input class="submitBtn" type="submit" value="save" />
      <button @click=${this.navigateToMain}>cancel</button>
      <button @click=${this.deleteItem}>delete</button>
    </form>`

    return html`
      <section>
        <test-app-title title="HatioLab Employee"></test-app-title>
        ${editingTemplate}
      </section>
    `
  }

  constructor() {
    super()

    this.item = {}
    this.fields = []
  }

  //form 정보를 객체(updateObj)로 받아오기
  serialize() {
    const form = this.renderRoot.querySelector('#editForm')
    const formData = new FormData(form)
    const updateObj = Object.fromEntries(formData.entries())

    return updateObj
  }

  stateChanged(state) {
    this.item = state.employeeList.detailInfo.item || {}
    this.fields = state.employeeList.detailInfo.fields || []
  }

  updateItem(e) {
    e.preventDefault()

    const updateItem = this.serialize()
    this.item = updateItem

    this.navigateToMain()
  }

  deleteItem() {
    this.navigateToMain()
  }

  navigateToMain() {
    navigate('employee-list')
  }
}

window.customElements.define('employee-detail', EmployeeDetail)
