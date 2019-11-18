import Component from "@ember/component";
import { inject as service } from "@ember/service";
import sortByYear from "../utils/sort-by-year";
import { on } from "@ember/object/evented";
import { EKMixin, keyUp } from "ember-keyboard";
import { observer } from "@ember/object";
import EducationValidator from "../validators/education";

export default Component.extend(EKMixin, {
  EducationValidator,
  intl: service(),

  init() {
    this._super(...arguments);
  },

  activateKeyboard: on("init", function() {
    this.set("keyboardActivated", true);
  }),

  abortEducations: on(keyUp("Escape"), function() {
    let education = this.get("education");
    if (education.get("hasDirtyAttributes")) {
      education.rollbackAttributes();
    }
    this.done();
  }),

  actions: {
    notify() {
      let length = this.get("sortedEducations").length;
      setTimeout(() => {
        if (length > this.get("sortedEducations").length) {
          return this.notifyPropertyChange("sortedEducations");
        }
      }, 500);
    },
    submit(educationChangeset, event) {
      event.preventDefault();
      educationChangeset
        .validate()
        .then(() => {
          if (educationChangeset.get("isValid")) {
            return educationChangeset
              .save()
              .then(education => {
                this.sendAction("done", false);
              })
              .then(() =>
                this.get("notify").success("Ausbildung wurde aktualisiert!")
              );
          } else {
            educationChangeset.get("errors").forEach(error => {
              // if (error.key == location) locationInvalid = true;
              this.get("notify").alert(error.key, {
                closeAfter: 8000
              });
            });
          }
        })
        .catch(() => {
          let project = this.get("education");
          let errors = project.get("errors").slice(); // clone array as rollbackAttributes mutates

          project.rollbackAttributes();
          errors.forEach(({ attribute, message }) => {
            let translated_attribute = this.get("intl").t(
              `project.${attribute}`
            );
            this.get("notify").alert(`${translated_attribute} ${message}`, {
              closeAfter: 10000
            });
          });
        });
    },
    abortEdit() {
      let education = this.get("education");
      if (education.get("hasDirtyAttributes")) {
        education.rollbackAttributes();
      }
      this.done();
    },
    handleFocus(select, e) {
      if (this.focusComesFromOutside(e)) {
        select.actions.open();
      }
    },

    handleBlur() {}
  }
});
