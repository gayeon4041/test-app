import { PageView, store, navigate, client } from '@things-factory/shell'
import { css, html } from 'lit-element'
import { connect } from 'pwa-helpers/connect-mixin.js'
import { GET_COMPANY_ID } from '../actions/employee-list'
import '../components/test-app-title'

import gql from 'graphql-tag'

class CompanyMain extends connect(store)(PageView) {
  static get styles() {
    return css`
      :host {
        display: flex;
        flex-direction: column;
        align-items: center;
      }
      ul {
        list-style: none;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 0;
      }
      li {
        margin-bottom: 10px;
      }
      button {
        border: 0;
        outline: 0;
        border-radius: 5px;
        padding: 10px;
        margin-bottom: 10px;
        background-color: #ef5956;
        color: #ffffff;
        font-weight: 700;
      }
    `
  }
  static get properties() {
    return {
      companies: Array
    }
  }
  render() {
    return html`
      <section>
        <test-app-title title="Companies"></test-app-title>
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
      </section>
    `
  }

  constructor() {
    super()
    this.companies = []
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
