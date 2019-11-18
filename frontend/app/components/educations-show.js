import Component from "@ember/component";
import sortByYear from "../utils/sort-by-year";
import { computed, observer } from "@ember/object";

export default Component.extend({
  amountOfEducations: computed("sortedEducations", function() {
    return this.get("sortedEducations.length");
  }),

  sortedEducations: sortByYear("educations"),

  educationsChanged: observer("educations.@each", function() {
    if (this.get("educationEditing.isDeleted"))
      this.set("educationEditing", null);
    this.send("toggleEducationNew", false);
    this.send("toggleEducationEditing");
    this.notifyPropertyChange("sortedEducations");
  }),

  actions: {
    toggleEducationNew(triggerNew) {
      this.set("educationNew", triggerNew);
      this.set(
        "sortedEducations",
        triggerNew
          ? sortByYear("educations").volatile()
          : sortByYear("educations")
      );
      this.notifyPropertyChange("amountOfEducations");
    },

    toggleEducationEditing() {
      this.notifyPropertyChange("sortedEducations");
      this.set("educationEditing", null);
    }
  }
});
