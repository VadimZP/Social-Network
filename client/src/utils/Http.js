export default class Http {
  constructor(baseUrl = 'http://socialnetwork') {
    this.baseUrl = baseUrl
  }

  async get(path, options) {
    try {
      return await fetch(`${this.baseUrl}/${path}`, { method: 'GET', ...options })
    } catch (error) {
      throw new Error(error)
    }
  }

  async post(path, options) {
    try {
      return await fetch(`${this.baseUrl}/${path}`, { method: 'POST', ...options })
    } catch (error) {
      throw new Error(error)
    }
  }

  async put(path, options) {
    try {
      return await fetch(`${this.baseUrl}/${path}`, { method: 'PUT', ...options })
    } catch (error) {
      throw new Error(error)
    }
  }

  async delete(path, options) {
    try {
      return await fetch(`${this.baseUrl}/${path}`, { method: 'DELETE', ...options })
    } catch (error) {
      throw new Error(error)
    }
  }
}