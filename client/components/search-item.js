import { LitElement, html, css } from 'lit-element'

export class SearchItem extends LitElement {
  static get styles() {
    return css`
      label {
        color: #353b48;
        font-weight: 700;
      }

      input {
        padding: 7px 5px;
        margin-bottom: 5px;
        border-radius: 5px;
      }

      .text-btn {
        border: 1px solid #353b48;
      }

      .submit-btn {
        background-color: #273c75;
        color: #ffffff;
        outline: 0;
        border: 1px solid #273c75;
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
        <form @submit=${this.searchClickEvent}>
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

  async searchClickEvent(e) {
    e.preventDefault()

    const form = this.renderRoot.querySelector('form')
    const formData = new FormData(form)

    const searchObj = await Object.fromEntries(formData.entries())

    this.searchFunction(searchObj)
  }
}

customElements.define('search-item', SearchItem)
