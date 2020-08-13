import { PageView, store, navigate } from '@things-factory/shell'
import { css, html } from 'lit-element'
import { connect } from 'pwa-helpers/connect-mixin.js'

import '../components/test-app-title'
import { UPDATE_DETAIL_INFO, RENEWAL_LIST } from '../actions/employee-list'

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
      fields: Array,
      updateFunction: Function,
      deleteFunction: Function
    }
  }

  render() {
    const editingTemplate = html` <form id="editForm" @submit=${this.updateItem}>
        ${this.fields.map(
          f => html` <input type=${f.type} name=${f.name} .value=${this.item[f.name]} .hidden=${!f.display.editing} /> `
        )}
        <input class="submitBtn" type="submit" value="save" />
      </form>
      <button @click=${this.navigateToMain}>cancel</button>
      <button @click=${this.deleteItem}>delete</button>`

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
    //this.updatedEmp = {}
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
    this.updateFunction = state.employeeList.detailInfo.update
    this.deleteFunction = state.employeeList.detailInfo.delete
  }

  //update
  async updateItem(e) {
    e.preventDefault()
    const item = this.serialize()
    await this.updateFunction(item)
    this.afterModifying()
  }

  async deleteItem() {
    await this.deleteFunction(this.item)
    this.afterModifying()
  }

  afterModifying() {
    store.dispatch({
      type: RENEWAL_LIST,
      needRenewal: true
    })
    this.navigateToMain()
  }

  navigateToMain() {
    store.dispatch({
      type: UPDATE_DETAIL_INFO,
      detailInfo: {}
    })

    navigate('employee-list')
  }
}

window.customElements.define('employee-detail', EmployeeDetail)
