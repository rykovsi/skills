import { inject as service } from "@ember/service";
import Component from "@ember/component";
import { computed } from "@ember/object";
import { on } from "@ember/object/evented";
import { EKMixin, keyUp } from "ember-keyboard";
import EducationValidator from "../validators/education";

export default Component.extend(EKMixin, {
  EducationValidator,
  store: service(),
  intl: service(),

  newEducation: computed("personId", function() {
    return this.get("store").createRecord("education");
  }),

  activateKeyboard: on("init", function() {
    this.set("keyboardActivated", true);
  }),

  abortEducationNew: on(keyUp("Escape"), function() {
    if (this.get("newEducation.isNew")) {
      this.get("newEducation").destroyRecord();
    }
    this.done(false);
  }),

  willDestroyElement() {
    if (this.get("newEducation.isNew")) {
      this.get("newEducation").destroyRecord();
    }
  },

  setInitialState(context) {
    context.set("newEducation", context.get("store").createRecord("education"));
    context.sendAction("done", true);
  },

  actions: {
    abortNew(educationChangeset) {
      educationChangeset.rollback();
      this.done();
    },

    submit(educationChangeset, initNew, event) {
      event.preventDefault();
      educationChangeset
        .validate()
        .then(() => {
          if (educationChangeset.get("isValid")) {
            let person = this.get("store").peekRecord(
              "person",
              this.get("personId")
            );
            educationChangeset.set("person", person);
            return educationChangeset
              .save()
              .then(education => {
                this.sendAction("done", false);
                if (initNew) this.sendAction("setInitialState", this);
              })
              .then(() =>
                this.get("notify").success("Ausbildung wurde hinzugefügt!")
              );
          } else {
            educationChangeset.get("errors").forEach(error => {
              this.get("notify").alert(error.key, {
                closeAfter: 8000
              });
            });
          }
        })
        .catch(() => {
          let errors = educationChangeset.get("errors").slice();

          errors.forEach(({ attribute, message }) => {
            let translated_attribute = this.get("intl").t(
              `person.${attribute}`
            );
            this.get("notify").alert(`${translated_attribute} ${message}`, {
              closeAfter: 8000
            });
          });
        });
    }
  }
});
