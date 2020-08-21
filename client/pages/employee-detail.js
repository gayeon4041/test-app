import { PageView, store, navigate, client } from '@things-factory/shell'
import { css, html } from 'lit-element'
import { connect } from 'pwa-helpers/connect-mixin.js'

import '../components/test-app-title'
import { UPDATE_DETAIL_INFO, RENEWAL_LIST } from '../actions/employee-list'
import gql from 'graphql-tag'
import { getURLinfo } from '../utils/get-url'
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

      #editForm label {
        font-size: 20px;
        font-weight: 700;
        color: #ef5956;
      }

      #editForm {
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
      }

      .form-container {
        border: 3px solid #ed6856;
        border-radius: 8px;
        padding: 20px;
      }

      label input {
        border-radius: 5px;
        border: none;
        background-color: #fdf5e6;
        padding: 5px;
      }

      #editForm input {
        margin-bottom: 20px;
        margin-top: 10px;
      }

      test-app-title {
        margin-bottom: 20px;
      }

      button {
        border: 0;
        outline: 0;
        border-radius: 8px;
        margin-right: 5px;
        padding: 5px;
        color: #ffffff;
        background-color: #ef5956;
        font-weight: 700;
      }

      .submitBtn {
        border: 0;
        outline: 0;
        border-radius: 8px;
        padding: 5px;
        color: #ffffff;
        background-color: #ef5956;
        font-weight: 700;
        width: 100%;
      }
    `
  }
  static get properties() {
    return {
      item: Object,
      fields: Array,
      updateFunction: Function,
      deleteFunction: Function,
      itemId: String
    }
  }

  render() {
    const editingTemplate = html`
      <div class="form-container">
        <form id="editForm" @submit=${this.updateItem}>
          ${this.fields.map(
            f =>
              html`
                <label .hidden=${!f.display.editing}
                  >${f.name}: <input type=${f.type} name=${f.name} .value=${this.item[f.name]}
                /></label>
              `
          )}
          <input class="submitBtn" type="submit" value="save" />
        </form>
        <div class="btn-container">
          <button @click=${this.navigateToMain}>cancel</button>
          <button @click=${this.deleteItem}>delete</button>
        </div>
      </div>
    `

    return html`
      <section>
        <test-app-title title="${this.item.name} details"></test-app-title>
        ${editingTemplate}
      </section>
    `
  }

  constructor() {
    super()

    this.item = {}
    this.fields = []
  }

  updated(changed) {
    if (changed.has('active') && this.active) {
      this.itemId = getURLinfo('id')
      this.viewEmployeeDetail([this.itemId])
    }
  }

  async viewEmployeeDetail(itemIds) {
    const response = await client.query({
      query: gql`
        query($itemIds: [String]) {
          employees(ids: $itemIds) {
            id
            name
            email
            age
          }
        }
      `,
      variables: {
        itemIds
      }
    })

    this.item = response.data.employees[0]
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

    navigate('employees-main')
  }
}

window.customElements.define('employee-detail', EmployeeDetail)
