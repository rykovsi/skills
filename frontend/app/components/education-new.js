import { inject as service } from "@ember/service";
import Component from "@ember/component";
import { on } from "@ember/object/evented";
import { EKMixin, keyUp } from "ember-keyboard";
import EducationValidator from "../validators/education";
import lookupValidator from "ember-changeset-validations";
import Changeset from "ember-changeset";

export default Component.extend(EKMixin, {
  store: service(),
  intl: service(),

  init() {
    this._super(...arguments);
    this.set("newEducation", this.get("store").createRecord("education"));
    this.set(
      "educationChangeset",
      new Changeset(
        this.get("newEducation"),
        lookupValidator(EducationValidator),
        EducationValidator
      )
    );
    this.set(
      "person",
      this.get("store").peekRecord("person", this.get("personId"))
    );
    this.set("keyboardActivated", true);
  },

  abortEducationNew: on(keyUp("Escape"), function() {
    this.get("educationChangeset").rollback();
    this.done();
  }),

  actions: {
    abortNew() {
      this.get("educationChangeset").rollback();
      this.done();
    },

    submit(initNew, event) {
      event.preventDefault();
      this.get("educationChangeset")
        .validate()
        .then(() => {
          if (this.get("educationChangeset.isValid")) {
            this.set("educationChangeset.person", this.get("person"));
            return this.get("educationChangeset")
              .save()
              .then(() => {
                this.done(initNew);
                this.get("notify").success("Ausbildung wurde hinzugefügt!");
              })
              .catch(() => {
                this.done(true);
                this.get("newEducation.errors").forEach(
                  ({ attribute, message }) => {
                    let translated_attribute = this.get("intl").t(
                      `education.${attribute}`
                    );
                    this.get("notify").alert(
                      `${translated_attribute} ${message}`,
                      { closeAfter: 10000 }
                    );
                  }
                );
              });
          } else {
            this.get("educationChangeset.errors").forEach(error => {
              this.get("notify").alert(error.key, {
                closeAfter: 8000
              });
            });
          }
        });
    }
  }
});
