export default class Controller {
  constructor(View, Model) {
    this.contactModel = new Model();
    this.contactView = new View();
    this.existingContact = false;
    this.contacts = [];
    this.modifyId;
  }

  async init() {
    await this.getContacts();
    document.addEventListener('click', this.contactFormEvents.bind(this));
    document.addEventListener('submit', this.submitFormEvent.bind(this));
    document.addEventListener('click', this.deleteContactEvent.bind(this));
    document.addEventListener('click', this.findContactsForTags.bind(this));
    document.addEventListener('keyup', this.findContactsForSearchBar.bind(this));
  }

  contactFormEvents(event) {
    this.addContactRenderEvent(event);
    this.contactView.cancelAddContact(event);
    this.editContactRenderEvent(event);
  }

  async submitFormEvent(event) {
    this.sendDataEvent(event);
    await this.getContacts();
  }

  async findContactsForSearchBar(event) {
    if (event.target.id === 'search-bar') {
      const string = event.target.value;
      this.searchContacts(event, string);
    }
  }

  async deleteContactEvent(event) {
    if (event.target.className === 'delete-button') {
      this.contactModel.deleteContact(event);
      await this.getContacts();
    }
  }

  async findContactsForTags(event) {
    const tagId = ['marketing-search', 'finance-search', 'accounting-search', 'sales-search'];
    if (tagId.includes(event.target.id)) {
      if (this.isChecked()) {
        const searchData = this.searchTags(event);
        this.getTagContacts.call(this, this.contacts, searchData);
      } else {
        await this.getContacts();
      }
    }
  }

  async getContacts() {
    const contacts = await this.contactModel.getContacts();
    this.contacts = contacts.slice();
    this.contactView.renderContacts(contacts);
  }

  isChecked() {
    const checkboxes = Array.from($('#tag-search').children());
    return checkboxes.some((elements) => elements.checked === true);
  }

  async sendDataEvent(event) {
    event.preventDefault();
    const id = this.existingContact ? this.modifyId : null;
    await this.contactModel.sendContact(event, this.existingContact, id);
    this.contactView.toggleMain();
    this.contactView.toggleAddContact();
  }

  async addContactRenderEvent(event) {
    if (event.target.id === 'add-contact-button') {
      this.existingContact = false;
      this.contactView.renderAddContact(event);
    }
  }

  async editContactRenderEvent(event) {
    if (event.target.className === 'edit-button') {
      this.existingContact = true;
      const id = this.contactView.getId(event.target);
      console.log(id);
      const data = await this.contactModel.getContact(id);
      this.modifyId = data.id;
      this.contactView.renderEditContact(data);
    }
  }

  searchTags() {
    const tags = $('#tag-search').children();
    const arrayOfTags = Array.from(tags);
    const searchArr = [];
    arrayOfTags.forEach((tagsElement) => {
      if (tagsElement.checked === true) {
        searchArr.push(tagsElement.name);
      }
    });
    return searchArr;
  }

  getTagContacts(data, arrayOfSearchTags) {
    const newData = data.filter((contact) => arrayOfSearchTags.some((tag) => contact.tags.includes(tag)));
    this.contactView.renderContacts(newData);
  }

  searchContacts(_event, string) {
    const lowerString = string.toLowerCase();
    const data = [];
    this.contacts.forEach((contact) => {
      const { length } = lowerString;
      const lowerContactName = contact.full_name.toLowerCase();
      if (lowerContactName.slice(0, length) === lowerString) {
        data.push(contact);
      }
    });
    this.contactView.renderContacts(data);
  }
}
