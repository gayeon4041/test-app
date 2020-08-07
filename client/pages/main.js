import { html, css } from 'lit-element'
import { connect } from 'pwa-helpers/connect-mixin.js'
import { store, PageView, client } from '@things-factory/shell'
import gql from 'graphql-tag'

import '../components/test-app-title'
import '../components/add-item'
import '../components/editable-list-item'

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

      add-item {
        flex: 1;
      }
    `
  }

  static get properties() {
    return {
      employees: Array
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
                    console.log(deletedEmployeeName + '이 지워졌습니다.')
                  }}
                >
                </editable-list-item>
              </li>
            `
          )}
        </ul>
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
        newEmployee
      }
    })

    return response.data.createOrUpdateEmployee
  }

  async deleteEmployee(id) {
    const response = await client.mutate({
      mutation: gql`
        mutation deleteEmployee($id: String) {
          deleteEmployee(id: $id) {
            name
          }
        }
      `,
      variables: {
        id
      }
    })

    return response.data.deleteEmployee.name
  }

  stateChanged(state) {
    // this.testApp = state.testApp.state_main
  }
}

window.customElements.define('test-app-main', TestAppMain)
