import { PageView, store, navigate, client } from '@things-factory/shell'
import { css, html } from 'lit-element'
import { connect } from 'pwa-helpers/connect-mixin.js'

import '../components/test-app-title'
import '../components/search-item'
import '../components/add-item'

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
        padding: 5px;

        background-color: #ef5956;
        color: #ffffff;
        font-weight: 700;
      }
    `
  }
  static get properties() {
    return {
      companies: Array,
      sortFunction: Function,
      sortOption: Boolean,
      searchName: String
    }
  }
  render() {
    const companyFields = [
      {
        name: 'name',
        type: 'text',
        display: true
      },
      {
        name: 'description',
        type: 'text',
        display: true
      }
    ]
    return html`
      <section>
        <test-app-title title="Companies"></test-app-title>
        <search-item
          .searchFunction=${async searchObj => {
            this.searchName = searchObj.search
            console.log(this.searchName)
            await this.getCompany({ name: this.searchName })
          }}
        ></search-item>
        <button @click=${this.sortFunction}>이름순으로 정렬하기</button>
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
        <add-item
          .fields=${companyFields}
          .addItemList=${async addObj => {
            const { name, description } = addObj
            const parsedNewEmployeeObj = {
              name,
              description
            }
            await this.createCompany(parsedNewEmployeeObj)
            await this.getCompany({})
          }}
        ></add-item>
      </section>
    `
  }

  constructor() {
    super()
    this.companies = []
    this.searchName = ''
  }

  firstUpdated() {
    this.getCompany({})
  }

  companyToEmployees(e) {
    const companyName = e.target.name

    navigate(`employees-main?company=${companyName}`)
  }

  sortFunction() {
    let sort
    // sortOption이 true이면 오름차순
    if (this.sortOption) {
      sort = 'ASC'
    }
    // sortOption이 false이면 내림차순
    else {
      sort = 'DESC'
    }

    this.getCompany({ name: this.searchName, sort })
    this.sortOption = !this.sortOption
  }

  async getCompany({ name, sort }) {
    const response = await client.query({
      query: gql`
        query($name: String, $sort: String) {
          companies(name: $name, sortOption: $sort) {
            id
            name
          }
        }
      `,
      variables: {
        name,
        sort
      }
    })

    this.companies = response.data.companies
  }

  async createCompany(newCompany) {
    const response = await client.mutate({
      mutation: gql`
        mutation createCompany($newCompany: CompanyInput) {
          createCompany(company: $newCompany) {
            name
            description
          }
        }
      `,
      variables: {
        newCompany
      }
    })

    return response.data.createOrUpdateEmployee
  }
}

window.customElements.define('company-main', CompanyMain)
