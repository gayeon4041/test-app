
    this.fields = []
  }

  async searchClick(e) {
    e.preventDefault()

    const form = this.renderRoot.querySelector('form')
    const formData = new FormData(form)

    const searchObj = await Object.fromEntries(formData.entries())

    this.searchFunction(searchObj)
  }
}

customElements.define('search-item', SearchItem)
