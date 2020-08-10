import '../components/test-app-title'
import '../components/add-item'
import '../components/editable-list-item'

import { PageView, client, store } from '@things-factory/shell'
import { css, html } from 'lit-element'

import { connect } from 'pwa-helpers/connect-mixin.js'
import gql from 'graphql-tag'

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
        justify-content: center;
        align-items: center;
      }

      ul {
        list-style: none;
        overflow: auto;
        flex: 0.5;
        margin: auto;
        border: 1px solid;
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
      }
    `
  }

  static get properties() {
    return {
      employees: Array,
      selectMode: Boolean
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
          plain: true
        }
      },
      {
        name: 'age',
        type: 'number',
        display: {
          editing: true,
          plain: true
        }
      }
    ]

    return html`
      <section>
        <test-app-title title="HatioLab Employees"></test-app-title>
        <button @click=${this.selectToggle}>Select</button>
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

                    this.refresh()
                  }}
                  .deleteFunction=${async deleteObj => {
                    const id = deleteObj.id
                    const deletedEmployeeName = await this.deleteEmployee(id)
                    await this.refresh()
                    await this.updateComplete
                    console.log(deletedEmployeeName[0].name + '님이 삭제되었습니다.')
                  }}
                  .selectMode=${this.selectMode}
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
            console.log('추가되었습니다')

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
  }

  //selectBtn
  selectToggle() {
    this.selectMode = !this.selectMode
    console.log(this.selectMode)
  }

  //체크된 직원 지우기
  async deleteList() {
    const checkedList = this.getCheckedList()
    let idList = []
    checkedList.forEach((checkedItem, i) => idList.push(checkedItem.item.id))
    let deletedIdArray = await this.deleteEmployee(idList)

    // 완료후 작업
    deletedIdArray.forEach((id, i) => console.log(id.name + '님이 삭제되었습니다.'))

    await this.refresh()
  }

  //체크된 리스트 뽑아서 배열로 return
  getCheckedList() {
    const listItems = Array.from(this.renderRoot.querySelectorAll('editable-list-item'))
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
    // this.testApp = state.testApp.state_main
  }
}

window.customElements.define('test-app-main', TestAppMain)
