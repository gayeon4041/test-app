import '../components/test-app-title'
import '../components/add-item'
import '../components/editable-list-item'

import { PageView, client, store, navigate } from '@things-factory/shell'
import { css, html } from 'lit-element'

import { connect } from 'pwa-helpers/connect-mixin.js'
import gql from 'graphql-tag'

import { showSnackbar } from '@things-factory/layout-base'

import { UPDATE_SELECT_MODE, UPDATE_SELECT_ALL_MODE, RENEWAL_LIST, GET_COMPANY_ID } from '../actions/employee-list'

class EmployeesMain extends connect(store)(PageView) {
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

      ul {
        list-style: none;
        flex: 0.5;
        overflow: auto;
        margin: auto;
        border: 3px solid #ed6856;
        border-radius: 8px;
        margin: 20px;
        padding: 20px;
        display: flex;
        flex-direction: column;
        align-items: center;
      }

      li {
        margin-bottom: 10px;
      }

      add-item {
        flex: 1;
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

      .select-btns {
        display: flex;
      }

      .select-btns button:first-child {
        margin-right: 20px;
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
      defaultValues: Object
    }
  }

  render() {
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
          plain: false
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
        <div class="select-btns">
          ${this.selectMode
            ? html` <button @click=${this.selectAllList}>select all</button>
                <button @click=${this.exitSelectMode}>cancel</button>`
            : html`<button @click=${this.enterSelectMode}>select</button>`}
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
        <button @click=${this.deleteList}>delete</button>
        <add-item
          .fields=${addFieldOptions}
          .defaultValues=${this.defaultValues}
          .addEmployee=${async addObj => {
            const { name, email, age, companyId } = addObj
            const parsedNewEmployeeObj = {
              name,
              email,
              age: Number(age),
              companyId
            }
            await this.createOrUpdateEmployee(parsedNewEmployeeObj)

            this.addEmployeeSnackbar(name)
            await this.refresh(this.companyId)
          }}
        ></add-item>
      </section>
    `
  }

  constructor() {
    super()

    this.employees = []
    this.selectMode = false
    this.selectAll = false
    this.companyId = ''
    this.companyName = ''
    this.defaultValues = {}
  }

  updated(changed) {
    if (changed.has('needRenewal') && this.needRenewal) {
      this.refresh(this.companyId)
    }

    if (changed.has('companyId') && this.companyId) {
      this.defaultValues = {
        ...this.defaultValues,
        companyId: this.companyId
      }

      store.dispatch({
        type: RENEWAL_LIST,
        needRenewal: true
      })
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

      await this.refresh(this.companyId)
    }
  }

  //체크된 리스트 뽑아서 배열로 return
  getCheckedList() {
    const listItems = this.getListItems()
    const checked = listItems.filter((item, index) => item.isSelected)

    return checked
  }

  //graphql 데이터 불러오기
  async refresh(id) {
    const response = await client.query({
      query: gql`
        query($id: String) {
          companies(id: $id) {
            name
            employees {
              id
              name
              email
              age
            }
          }
        }
      `,
      variables: {
        id
      }
    })

    let company = response.data.companies[0]

    this.employees = company.employees
    this.companyName = company.name

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
    this.companyId = state.employeeList.companyId
  }
}

window.customElements.define('employees-main', EmployeesMain)
