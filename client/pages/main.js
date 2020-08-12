import '../components/test-app-title'
import '../components/add-item'
import '../components/editable-list-item'

import { PageView, client, store } from '@things-factory/shell'
import { css, html } from 'lit-element'

import { connect } from 'pwa-helpers/connect-mixin.js'
import gql from 'graphql-tag'

import { showSnackbar } from '@things-factory/layout-base'

import { UPDATE_SELECT_MODE } from '../actions/employee-list'

class TestAppMain extends connect(store)(PageView) {
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
        overflow: auto;
        flex: 0.5;
        margin: auto;
        border: 1px solid #ed6856;
        border-radius: 8px;
        margin: 20px;
        padding: 20px;
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
      selectAllMode: Boolean
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
      }
    ]

    return html`
      <section>
        <test-app-title title="HatioLab Employees"></test-app-title>
        <div class="select-btns">
          ${this.selectMode
            ? html`${this.selectAllMode
                  ? html`<button @click=${this.selectAllList}>select all</button>`
                  : html`<button @click=${this.cancelSelectAllList}>select cancel</button>`}<button
                  @click=${this.exitSelectMode}
                >
                  cancel
                </button>`
            : html`<button @click=${this.enterSelectMode}>select</button>`}
        </div>
        <ul>
          ${this.employees.map(
            (e, i) => html`
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
                    this.refresh()
                  }}
                  .deleteFunction=${async deleteObj => {
                    const id = deleteObj.id
                    const deletedEmployeeName = await this.deleteEmployee(id)
                    await this.refresh()
                    await this.updateComplete

                    console.log(deletedEmployeeName[0].name + '님이 삭제되었습니다.')
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
          .fields=${fieldOptions}
          .addEmployee=${async addObj => {
            const { name, email, age } = addObj
            const parsedNewEmployeeObj = {
              name,
              email,
              age: Number(age)
            }
            await this.createOrUpdateEmployee(parsedNewEmployeeObj)

            this.addEmployeeSnackbar(name)
            await this.refresh()
          }}
        ></add-item>
      </section>
    `
  }

  constructor() {
    super()

    this.employees = []
    this.selectMode = false
    this.selectAllMode = true
  }

  addEmployeeSnackbar(name) {
    store.dispatch(
      showSnackbar('info', {
        message: name + '님이 추가되었습니다.',
        timer: 5000
      })
    )
  }

  deleteSnackbar(name) {
    store.dispatch(
      showSnackbar('info', {
        message: `${name}님이 삭제되었습니다.`,
        timer: 5000
      })
    )
  }

  updateSnackbar(name) {
    store.dispatch(
      showSnackbar('info', {
        message: `${name}님이 수정되었습니다.`,
        timer: 5000
      })
    )
  }

  //전체선택 취소
  cancelSelectAllList() {
    this.selectAllMode = true
  }

  //전체선택
  selectAllList() {
    const items = this.getListItems()
    items.forEach(item => (item.isSelected = true))
    //this.selectAllMode = false
  }

  //선택모드 취소
  exitSelectMode() {
    store.dispatch({
      type: UPDATE_SELECT_MODE,
      selectMode: false
    })
  }

  //선택모드
  enterSelectMode() {
    store.dispatch({
      type: UPDATE_SELECT_MODE,
      selectMode: true
    })
  }

  getListItems() {
    const listItems = Array.from(this.renderRoot.querySelectorAll('editable-list-item'))
    return listItems
  }

  editFunction() {
    const editBtn = this.renderRoot.querySelector('#edit-btn')
  }

  //selectBtn
  selectToggle() {
    this.selectMode = !this.selectMode
  }

  //체크된 직원 지우기
  async deleteList() {
    const checkedList = this.getCheckedList()
    let idList = []
    checkedList.forEach((checkedItem, i) => idList.push(checkedItem.item.id))
    if (idList.length > 0) {
      let deletedEmployees = await this.deleteEmployee(idList)

      store.dispatch(
        showSnackbar('info', {
          message: `${deletedEmployees[0].name} ${
            deletedEmployees.length > 1 ? `외 ${deletedEmployees.length - 1} 명이` : '님이'
          } 삭제되었습니다.`,
          timer: 5000
        })
      )

      this.selectToggle()
      await this.refresh()
    }
  }

  //체크된 리스트 뽑아서 배열로 return
  getCheckedList() {
    const listItems = this.getListItems()
    const checked = listItems.filter((item, index) => item.isSelected)

    return checked
  }

  //초기설정 (litElement lifecycle)
  firstUpdated() {
    this.refresh()
  }

  //graphql 데이터 불러오기
  async refresh() {
    const response = await client.query({
      query: gql`
        query {
          employees {
            id
            name
            email
            age
          }
        }
      `
    })

    this.employees = response.data.employees
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

  stateChanged(state) {
    this.selectMode = state.employeeList.selectMode
  }
}

window.customElements.define('test-app-main', TestAppMain)
