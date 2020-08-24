import { LitElement, html, css } from 'lit-element'

export class SearchItem extends LitElement {
  static get styles() {
    return css`
      label {
        color: #fab4b4;
      }
      input {
        padding: 7px 5px;
        margin-bottom: 5px;
        border-radius: 2px;
      }
      .text-btn {
        border: 1px solid #fab4b4;
      }
      .submit-btn {
        background-color: #fab4b4;
        color: #ffffff;
        outline: 0;
        border: 0;
      }
      form {
        display: flex;
        justify-content: center;
      }
    `
  }
  static get properties() {
    return {
      fields: Array,
      searchFunction: Function
    }
  }

  render() {
    return html`
      <div>
        <form @submit=${this.searchClick}>
          <label
            >name:
            <input class="text-btn" type="text" name="search" />
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
