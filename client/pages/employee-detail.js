import { PageView, store, navigate, client } from '@things-factory/shell'
import { css, html } from 'lit-element'
import { connect } from 'pwa-helpers/connect-mixin.js'

import '../components/test-app-title'
import '../components/edit-form-item'
import { RENEWAL_LIST } from '../actions/employee-list'
import gql from 'graphql-tag'
import { getUrlInfo } from '../utils/get-url'
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

      test-app-title {
        margin-bottom: 20px;
      }
    `
  }
  static get properties() {
    return {
      employeeItem: Object,
      fields: Array,
      updateFunction: Function,
      deleteFunction: Function,
      itemId: String,
      companyName: String
    }
  }

  render() {
    const employeeEditFields = [
      {
        name: 'id',
        type: 'text',
        display: false
      },
      {
        name: 'name',
        type: 'text',
        display: true
      },
      {
        name: 'email',
        type: 'email',
        display: true
      },
      {
        name: 'age',
        type: 'number',
        display: true
      }
    ]

    return html`
      <section>
        <test-app-title title="${this.employeeItem.name}'s details"></test-app-title>
        <edit-form-item
          .fields=${employeeEditFields}
          .item=${this.employeeItem}
          .updateItem=${async item => {
            await this.updateFunction(item)
            this.afterModifying()
          }}
          .deleteItem=${async () => {
            await this.deleteFunction(this.employeeItem)
            this.afterModifying()
          }}
          .navigateToMain=${() => this.navigateToMain(this.companyName)}
        ></edit-form-item>
      </section>
    `
  }

  constructor() {
    super()

    this.employeeItem = {}
    this.fields = []
    this.companyName = ''
  }

  updated(changed) {
    if (changed.has('active') && this.active) {
      this.itemId = getUrlInfo('id')
      this.viewEmployeeDetail([this.itemId])
    }
  }

  //employee 데이터 조회
  async viewEmployeeDetail(itemIds) {
    const response = await client.query({
      query: gql`
        query($itemIds: [String]) {
          employees(ids: $itemIds) {
            id
            name
            email
            age
            company {
              name
            }
          }
        }
      `,
      variables: {
        itemIds
      }
    })

    this.employeeItem = response.data.employees[0]
    this.companyName = this.employeeItem.company.name
  }

  afterModifying() {
    store.dispatch({
      type: RENEWAL_LIST,
      needRenewal: true
    })
    this.navigateToMain(this.companyName)
  }

  navigateToMain(name) {
    navigate(`employees-main?company=${name}`)
  }

  stateChanged(state) {
    this.updateFunction = state.employeeList.functionObj.update
    this.deleteFunction = state.employeeList.functionObj.delete
  }
}

window.customElements.define('employee-detail', EmployeeDetail)
