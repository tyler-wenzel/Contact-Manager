export default class View {
  constructor() {
    this.addContactDiv = document.querySelector('#add-contact-div');
    this.mainElement = $('main')[0];
  }

  renderContacts(data) {
    const renderContact = $('#contact');
    const handlebarsContacts = $('#contacts');
    Handlebars.registerPartial('contactPartial', renderContact.html());
    const handlebarsTemplate = Handlebars.compile(handlebarsContacts.html());
    $('main').html(handlebarsTemplate({ users: data }));
  }

  renderAddContact(event) {
    if (event.target.id === 'add-contact-button') {
      document.querySelector('#add-contact-form').reset();
      this.mainElement.style.display = 'none';
      this.addContactDiv.style.display = 'block';
    }
  }

  getId(element) {
    const idElement = $(element).siblings('#hidden-id');
    return Number(idElement[0].textContent);
  }

  cancelAddContact(event) {
    if (event.target.id === 'cancel-button') {
      this.toggleAddContact();
      this.toggleMain();
      this.addContactDiv.querySelector('#add-contact-form').reset();
    }
  }

  renderEditContact(data) {
    this.addContactDiv.querySelector('#add-contact-form').reset();
    this.addContactDiv.querySelector('input#full_name').value = data.full_name;
    this.addContactDiv.querySelector('input#email').value = data.email;
    this.addContactDiv.querySelector('input#phone_number').value = data.phone_number;
    this.turnTagsOn(this.addContactDiv, data.tags);
    this.toggleAddContact();
    this.toggleMain();
  }

  turnTagsOn(formDiv, tags) {
    if (tags !== null) {
      tags.forEach((tag) => {
        formDiv.querySelector(`input#${tag}`).checked = true;
      });
    }
  }

  toggleMain() {
    if (this.mainElement.style.display === 'none') {
      this.mainElement.style.display = 'grid';
    } else {
      this.mainElement.style.display = 'none';
    }
  }

  toggleAddContact() {
    if (this.addContactDiv.style.display === 'none') {
      this.addContactDiv.style.display = 'block';
    } else {
      this.addContactDiv.style.display = 'none';
    }
  }
}
