import Controller from './controller.js';
import View from './view.js';
import Model from './model.js';

document.addEventListener('DOMContentLoaded', async () => {
  const controller = new Controller(View, Model);
  controller.init();
});
