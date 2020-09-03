import { PageView, store, navigate, client } from '@things-factory/shell'
import { css, html } from 'lit-element'
import { connect } from 'pwa-helpers/connect-mixin.js'

import '../components/test-app-title'
import '../components/search-item'
import '../components/add-item'

import gql from 'graphql-tag'
import * as moment from 'moment'
import { getUrlInfo } from '../utils/get-url'

class CompanyMain extends connect(store)(PageView) {
  static get styles() {
    return css`
      section {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
        margin: 20px;
      }

      test-app-title {
        margin-bottom: 30px;
      }

      ul {
        list-style: none;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 0;
      }

      li {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        width: 100%;
        margin-bottom: 5px;
      }

      li span {
        text-align: center;
        color: #433c3c;
      }

      .sort-btn {
        display: flex;
      }

      button {
        border: 0;
        outline: 0;
        border-radius: 5px;
        padding: 5px;
        background-color: #273c75;
        color: #ffffff;
        font-weight: 700;
        cursor: pointer;
      }

      .company-list {
        width: 500px;
        height: 300px;
        overflow: auto;
        border: 3px solid #7f8fa6;
        margin-bottom: 10px;
        border-radius: 5px;
      }

      hr {
        width: 99%;
      }

      li button {
        border: 0;
        outline: 0;
        background-color: #ffffff;
        color: #718093;
        margin: 0;
        padding: 0;
        font-size: 16px;
      }

      .table-header span {
        color: #353b48;
        font-weight: 700;
      }
    `
  }

  static get properties() {
    return {
      companies: Array,
      sortFunction: Function,
      sortOption: Object,
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
            navigate(`/company-main?search=${this.searchName}`)

            await this.getCompany({ name: this.searchName })
          }}
          .searchName=${this.searchName}
        ></search-item>
        <div class="company-list">
          <ul>
            <li class="table-header">
              <span @click=${this.sortFunction} id="toLowerName">company</span>
              <span @click=${this.sortFunction} id="createdAt">date</span>
              <span>employeesNumber</span>
            </li>
            <hr />
            ${this.companies.map(
              company => html`
                <li>
                  <span>
                    <button name=${company.name} value=${company.id} @click=${this.companyToEmployees}>
                      ${company.name}
                    </button>
                  </span>
                  <span>${this.changeDate(company.createdAt)}</span>
                  <span>${company.employees.length}</span>
                </li>
              `
            )}
          </ul>
        </div>
        <add-item
          .fields=${companyFields}
          .addItemList=${async addObj => {
            const { name, description, toLowerName } = addObj
            const parsedNewEmployeeObj = {
              name,
              toLowerName,
              description
            }
            await this.createCompany(parsedNewEmployeeObj)
            await this.getCompany({ name: this.searchName })
          }}
          addFormTitleName="Company"
        ></add-item>
      </section>
    `
  }

  constructor() {
    super()
    this.companies = []
    this.searchName = ''
    this.sortOption = {
      toLowerName: true,
      createdAt: true
    }
  }

  updated(changed) {
    if (changed.has('active') && this.active) {
      this.searchName = getUrlInfo('search')
      this.getCompany({ name: this.searchName })
    }
  }

  companyToEmployees(e) {
    const companyName = e.target.name

    navigate(`employees-main?company=${companyName}`)
  }

  sortFunction(e) {
    let sortName = e.target.id
    let currentSortOption = {}

    if (this.sortOption[sortName]) {
      currentSortOption[sortName] = 'ASC'
      this.sortOption[sortName] = false
    } else {
      currentSortOption[sortName] = 'DESC'
      this.sortOption[sortName] = true
    }

    this.getCompany({ name: this.searchName, sort: currentSortOption })
  }

  changeDate(num) {
    let companyDay = new Date(num * 1)

    return moment(companyDay).format('YYYY.MM.DD')
  }

  //companies 데이터 조회 (name: searchName, sort: currentSortOption)
  async getCompany({ name, sort }) {
    const response = await client.query({
      query: gql`
        query($name: String, $sort: CompanySortType) {
          companies(name: $name, sortOption: $sort) {
            id
            name
            createdAt
            employees {
              name
            }
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

  //company 데이터 생성 obj = {name, toLowerName, description}
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
