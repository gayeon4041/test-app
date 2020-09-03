import '../components/test-app-title'
import '../components/add-item'
import '../components/editable-list-item'
import '../components/search-item'

import { PageView, client, store, navigate } from '@things-factory/shell'
import { css, html } from 'lit-element'

import { connect } from 'pwa-helpers/connect-mixin.js'
import gql from 'graphql-tag'

import { showSnackbar } from '@things-factory/layout-base'

import { UPDATE_SELECT_MODE, UPDATE_SELECT_ALL_MODE, RENEWAL_LIST } from '../actions/employee-list'
import { getUrlInfo } from '../utils/get-url'

class EmployeesMain extends connect(store)(PageView) {
  static get styles() {
    return css`
      section {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
      }

      ul {
        list-style: none;
        overflow: auto;
        margin: auto;
        border: 3px solid #7f8fa6;
        border-radius: 8px;
        margin-bottom: 20px;
        padding: 20px;
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 300px;
        height: 300px;
      }

      li {
        margin-bottom: 10px;
      }

      button {
        border: 0;
        outline: 0;
        border-radius: 5px;
        padding: 5px 15px;
        margin-bottom: 10px;
        background-color: #273c75;
        color: #ffffff;
        font-weight: 700;
      }

      .select-btns {
        display: flex;
      }

      .select-cancel-btn {
        margin-right: 10px;
        margin-left: 10px;
      }

      .sort-btn button {
        background-color: #7f8fa6;
        margin-bottom: 0;
      }
    `
  }

  static get properties() {
    return {
      employees: Array,
      selectMode: Boolean,
      selectAll: Boolean,
      needRenewal: Boolean,
      companyId: String,
      companyName: String,
      defaultValues: Object,
      sortOption: Boolean,
      numberOfEmployees: Number
    }
  }

  render() {
    // display option => editing: 수정가능, plain: 보여지는 item
    const fieldOptions = [
      {
        name: 'id',
        type: 'text',
        display: {
          editing: false,
          plain: false
        }
      },
      {
        name: 'name',
        type: 'text',
        display: {
          editing: true,
          plain: true
        }
      },
      {
        name: 'email',
        type: 'email',
        display: {
          editing: true,
          plain: false
        }
      },
      {
        name: 'age',
        type: 'number',
        display: {
          editing: true,
          plain: true
        }
      },
      {
        name: 'companyId',
        type: 'hidden',
        display: {
          editing: false,
          plain: false
        }
      }
    ]

    const addFieldOptions = [
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
      },
      {
        name: 'companyId',
        type: 'hidden',
        display: false
      }
    ]

    return html`
      <section>
        <test-app-title title="${this.companyName} Employees"></test-app-title>
        <search-item
          .fields=${fieldOptions}
          .searchFunction=${async searchObj => {
            await this.refresh({ companyName: this.companyName, employeesName: searchObj.search })
          }}
        ></search-item>
        <div class="sort-btn">
          ${this.sortOption.name
            ? html`<button @click=${this.sortFunction} value="name">이름 오름차순</button>`
            : html`<button @click=${this.sortFunction} value="name">이름 내림차순</button>`}
          ${this.sortOption.age
            ? html`<button @click=${this.sortFunction} value="age">나이 오름차순</button>`
            : html`<button @click=${this.sortFunction} value="age">나이 내림차순</button>`}
        </div>
        <ul>
          ${this.employees.map(
            e => html`
              <li>
                <editable-list-item
                  .item=${e}
                  .fields=${fieldOptions}
                  .updateFunction=${async updateObj => {
                    const { id, name, email, age } = updateObj
                    const parsedNewEmployeeObj = {
                      id,
                      name,
                      email,
                      age: Number(age)
                    }
                    const updatedEmployee = await this.createOrUpdateEmployee(parsedNewEmployeeObj)
                    this.updateSnackbar(name)
                  }}
                  .deleteFunction=${async deleteObj => {
                    const id = deleteObj.id
                    const deletedEmployeeName = await this.deleteEmployee(id)
                    this.deleteSnackbar(deletedEmployeeName[0].name)
                  }}
                  .selectAllMode=${this.selectAllMode}
                >
                </editable-list-item>
              </li>
            `
          )}
        </ul>
        <div class="select-btns">
          ${this.selectMode
            ? html` <button @click=${this.selectAllList}>select all</button>
                <button @click=${this.exitSelectMode} class="select-cancel-btn">cancel</button>
                <button @click=${this.deleteList}>delete</button>`
            : html`<button @click=${this.enterSelectMode}>select</button>`}
        </div>
        <add-item
          .fields=${addFieldOptions}
          .defaultValues=${this.defaultValues}
          .addItemList=${async addObj => {
            const { name, email, age, companyId } = addObj
            const parsedNewEmployeeObj = {
              name,
              email,
              age: Number(age),
              companyId
            }
            await this.createOrUpdateEmployee(parsedNewEmployeeObj)

            this.addEmployeeSnackbar(name)
            await this.refresh({ companyName: this.companyName })
          }}
          addFormTitleName="Employee"
        ></add-item>
      </section>
    `
  }

  constructor() {
    super()

    this.employees = []
    this.selectMode = false
    this.selectAll = false

    this.companyName = ''
    this.defaultValues = {}
    this.sortOption = {
      name: true,
      age: true
    }
  }

  updated(changed) {
    if (changed.has('needRenewal') && this.needRenewal) {
      this.refresh({ companyName: this.companyName })
    }

    if (changed.has('companyId') && this.companyId) {
      this.defaultValues = {
        ...this.defaultValues,
        companyId: this.companyId
      }
    }

    if (changed.has('companyName') && this.companyName) {
      store.dispatch({
        type: RENEWAL_LIST,
        needRenewal: true
      })
    }
    if (changed.has('active') && this.active) {
      this.companyName = getUrlInfo('company')
    }
  }

  //-------------snackbar-----------------
  deleteSnackbar(name) {
    store.dispatch(
      showSnackbar('info', {
        message: `${name}님이 삭제되었습니다.`,
        timer: 3000
      })
    )
  }

  selectedItemsDeleteSnackbar(employees) {
    store.dispatch(
      showSnackbar('info', {
        message: `${employees[0].name} ${
          employees.length > 1 ? `외 ${employees.length - 1} 명이` : '님이'
        } 삭제되었습니다.`,
        timer: 5000
      })
    )
  }

  addEmployeeSnackbar(name) {
    store.dispatch(
      showSnackbar('info', {
        message: `${name}님이 추가되었습니다.`,
        timer: 3000
      })
    )
  }

  updateSnackbar(name) {
    store.dispatch(
      showSnackbar('info', {
        message: `${name}님이 수정되었습니다.`,
        timer: 3000
      })
    )
  }

  //-------------select mode-----------------
  enterSelectMode() {
    store.dispatch({
      type: UPDATE_SELECT_MODE,
      selectMode: true
    })
  }

  exitSelectMode() {
    store.dispatch({
      type: UPDATE_SELECT_MODE,
      selectMode: false
    })
    store.dispatch({
      type: UPDATE_SELECT_ALL_MODE,
      selectAll: false
    })
  }

  selectAllList() {
    store.dispatch({
      type: UPDATE_SELECT_ALL_MODE,
      selectAll: true
    })
  }
  //----------------------------------------

  getListItems() {
    const listItems = Array.from(this.renderRoot.querySelectorAll('editable-list-item'))
    return listItems
  }

  editFunction() {
    const editBtn = this.renderRoot.querySelector('#edit-btn')
  }

  //체크된 직원 지우기
  async deleteList() {
    const checkedList = this.getCheckedList()
    let idList = []
    checkedList.forEach((checkedItem, i) => idList.push(checkedItem.item.id))
    if (idList.length > 0) {
      let deletedEmployees = await this.deleteEmployee(idList)
      this.selectedItemsDeleteSnackbar(deletedEmployees)

      await this.refresh({ companyName: this.companyName })
    }
  }

  //체크된 리스트 뽑아서 배열로 return
  getCheckedList() {
    const listItems = this.getListItems()
    const checked = listItems.filter((item, index) => item.isSelected)

    return checked
  }

  sortFunction(e) {
    let sortName = e.target.value
    let currentSortOption = {}

    if (this.sortOption[sortName]) {
      currentSortOption[sortName] = 'ASC'
      this.sortOption[sortName] = false
    } else {
      currentSortOption[sortName] = 'DESC'
      this.sortOption[sortName] = true
    }

    this.refresh({ companyName: this.companyName, employeesName: this.employeesName, sort: currentSortOption })
  }

  //graphql 데이터 조회
  async refresh({ companyName, employeesName, sort }) {
    const response = await client.query({
      query: gql`
        query($companyName: String, $employeesName: String, $sort: EmployeeSortType) {
          companies(name: $companyName) {
            id
            name
            employees(name: $employeesName, sortOption: $sort) {
              id
              name
              email
              age
            }
          }
        }
      `,
      variables: {
        companyName,
        employeesName,
        sort
      }
    })

    let company = response.data.companies[0]

    this.employees = company.employees
    this.companyId = company.id

    store.dispatch({
      type: RENEWAL_LIST,
      needRenewal: false
    })

    store.dispatch({
      type: UPDATE_SELECT_MODE,
      selectMode: false
    })
  }

  //graphql 데이터 추가,수정
  async createOrUpdateEmployee(newEmployee) {
    const response = await client.mutate({
      mutation: gql`
        mutation createOrUpdateEmployee($newEmployee: EmployeeInput) {
          createOrUpdateEmployee(employee: $newEmployee) {
            id
          }
        }
      `,
      variables: {
        //newEmployee: newEmployee
        newEmployee
      }
    })

    return response.data.createOrUpdateEmployee
  }

  //데이터 삭제
  async deleteEmployee(ids) {
    const response = await client.mutate({
      mutation: gql`
        mutation deleteEmployee($ids: [String]) {
          deleteEmployee(ids: $ids) {
            name
          }
        }
      `,
      variables: {
        ids
      }
    })

    return response.data.deleteEmployee
  }

  async stateChanged(state) {
    await this.updateComplete

    this.selectMode = state.employeeList.selectMode
    this.needRenewal = state.employeeList.needRenewal
  }
}

window.customElements.define('employees-main', EmployeesMain)
