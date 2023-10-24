export default class Model {
  constructor() {
    this.url = 'http://localhost:3000/api';
  }

  async getContacts() {
    try {
      const result = await fetch('http://localhost:3000/api/contacts/', { method: 'GET' });
      return result.json();
    } catch (error) {
      console.log(`${error}`);
    }
  }

  async getContact(id) {
    try {
      const result = await fetch(`http://localhost:3000/api/contacts/${id}`, { method: 'GET' });
      return result.json();
    } catch (error) {
      console.log(`${error}`);
    }
  }

  async deleteContact(event) {
    if (event.target.className === 'delete-button') {
      const id = Number($(event.target).siblings('p#hidden-id')[0].textContent);
      try {
        await fetch(`http://localhost:3000/api/contacts/${id}`, { method: 'DELETE' });
        await this.getContacts();
      } catch (err) {
        console.log(`${err}`);
      }
    }
  }

  async editContact(id) {
    let result;
    try {
      await fetch(`http://localhost:3000/api/contacts/${id}`, { method: 'GET' });
    } catch (err) {
      console.log(err);
    }
    return result;
  }

  async sendContact(event, modify, id) {
    const method = modify ? 'PUT' : 'POST';
    const url = modify ? `http://localhost:3000/api/contacts/${id}` : 'http://localhost:3000/api/contacts/';
    if (event.target.id === 'add-contact-form') {
      try {
        const formData = new FormData(event.target);
        const objectData = Object.fromEntries(formData.entries());
        const tags = this.getTags(objectData);
        objectData.tags = tags;
        const data = JSON.stringify(objectData);

        await fetch(url, {
          method,
          body: data,
          headers: {
            'Content-Type': 'application/json',
          },
        });
        event.target.reset();
      } catch (err) {
        console.log(`${err}`);
      }
    }
  }

  getTags(data) {
    const tags = [];
    for (const keys in data) {
      if (data[keys] === 'on') {
        tags.push(keys);
      }
    }
    return tags;
  }
}
