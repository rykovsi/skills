import {
  validatePresence,
  validateNumber
} from "ember-changeset-validations/validators";

export default {
  name: validatePresence(true),
  company: validatePresence(true),
  maritalStatus: validatePresence(true),
  birthdate: validatePresence(true),
  title: validatePresence(true),
  location: validatePresence(true)
};
