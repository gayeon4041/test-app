import { PageView, store, navigate, client } from '@things-factory/shell'
import { css, html } from 'lit-element'
import { connect } from 'pwa-helpers/connect-mixin.js'

import gql from 'graphql-tag'

class CompanyMain extends connect(store)(PageView) {
  static get properties() {
    return {
      companies: Array
    }
  }
  render() {
    return html`
      <h2>hello company</h2>
      <ul>
        ${this.companies.map(
          company => html`
            <li>
              ${company.name}
            </li>
          `
        )}
      </ul>
    `
  }

  constructor() {
    super()
    this.companies = []
  }

  firstUpdated() {
    this.getCompany()
  }

  async getCompany() {
    const response = await client.query({
      query: gql`
        query {
          companies {
            name
          }
        }
      `
    })

    this.companies = response.data.companies
  }
}

window.customElements.define('company-main', CompanyMain)
