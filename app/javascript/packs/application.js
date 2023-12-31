// This file is automatically compiled by Webpack, along with any other files
// present in this directory. You're encouraged to place your actual application logic in
// a relevant structure within app/javascript and only use these pack files to reference
// that code so it'll be compiled.

import Rails from "@rails/ujs"
import Turbolinks from "turbolinks"
import * as ActiveStorage from "@rails/activestorage"
import "channels"

import $ from "jquery";
window.jQuery = $;
window.$ = $;

import moment from "moment";
import "daterangepicker";

import "popper.js";
import "bootstrap";
import "../stylesheets/application";
import "./tasks";
import "./contribution";
import "./project";
import "./sortable_init";
import "./notifications";

import { createApp } from 'vue';
import ContributionGrid from '../components/ContributionGrid.vue';

document.addEventListener('DOMContentLoaded', () => {
  const app = createApp({
    components: { ContributionGrid }
  });
  app.mount('#vue-app');
});


Rails.start()
Turbolinks.start()
ActiveStorage.start()

