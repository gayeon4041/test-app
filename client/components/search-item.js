import { LitElement, html, css } from 'lit-element'

export class SearchItem extends LitElement {
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
            <input type="text" name="search" />
            <input type="submit" value="search" />
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
