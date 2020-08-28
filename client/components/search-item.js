import { LitElement, html, css } from 'lit-element'

export class SearchItem extends LitElement {
  static get styles() {
    return css`
      label {
        color: #ef5956;
        font-weight: 700;
      }
      input {
        padding: 7px 5px;
        margin-bottom: 5px;
        border-radius: 5px;
      }
      .text-btn {
        border: 1px solid #ef5956;
      }
      .submit-btn {
        background-color: #ef5956;
        color: #ffffff;
        outline: 0;
        border: 1px solid #ef5956;
        font-weight: 700;
      }
      form {
        display: flex;
        justify-content: center;
      }
      div {
        margin-bottom: 10px;
      }
    `
  }
  static get properties() {
    return {
      fields: Array,
      searchFunction: Function,
      searchName: String
    }
  }

  render() {
    return html`
      <div>
        <form @submit=${this.searchClick}>
          <label
            >name:
            <input class="text-btn" type="text" name="search" .value=${this.searchName ? `${this.searchName}` : ''} />
            <input class="submit-btn" type="submit" value="search" />
          </label>
        </form>
      </div>
    `
  }

  constructor() {
    super()

    this.fields = []
  }

  async searchClick(e) {
    e.preventDefault()

    const form = this.renderRoot.querySelector('form')
    const formData = new FormData(form)

    const searchObj = await Object.fromEntries(formData.entries())

    this.searchFunction(searchObj)

    //form.reset()
  }
}

customElements.define('search-item', SearchItem)
