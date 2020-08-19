import { PageView, store, navigate, client } from '@things-factory/shell'
import { css, html } from 'lit-element'
import { connect } from 'pwa-helpers/connect-mixin.js'
import { GET_COMPANY_ID } from '../actions/employee-list'

import gql from 'graphql-tag'

class CompanyMain extends connect(store)(PageView) {
  static get properties() {
    return {
      companies: Array,
      employees: Array
    }
  }
  render() {
    return html`
      <h2>hello company</h2>
      <ul>
        ${this.companies.map(
          company => html`
            <li>
              <button name=${company.name} value=${company.id} @click=${this.companyToEmployees}>
                ${company.name}
              </button>
            </li>
          `
        )}
      </ul>
    `
  }

  constructor() {
    super()
    this.companies = []
    this.employees = []
  }

  firstUpdated() {
    this.getCompany()
  }

  companyToEmployees(e) {
    const getCompanyId = e.target.value
    store.dispatch({
      type: GET_COMPANY_ID,
      companyId: getCompanyId
    })
    console.log(getCompanyId)
    navigate('employees-main')
  }

  async getCompany() {
    const response = await client.query({
      query: gql`
        query {
          companies {
            id
            name
          }
        }
      `
    })

    this.companies = response.data.companies
  }
}

window.customElements.define('company-main', CompanyMain)
