import Component from '@ember/component';
import { A } from '@ember/array';
import { inject as service } from '@ember/service';
import $ from 'jquery';
import Controller from '@ember/controller';
import { isBlank } from '@ember/utils';

export default Component.extend({
  store: service(),
  i18n: service(),
  options: A(['Scrum', 'CI/CD', 'Hermes', 'BA', 'Java EE', 'Java SE', 'PHP',
    'Docker', 'OpenShift', 'Ember', 'Angular', 'Git']),
  selected: A(['test']),

  init() {
    this._super(...arguments);
  },

  suggestion(term) {
    return `"${term}" hinzufügen!`;
  },

  focusComesFromOutside(e) {
    let blurredEl = e.relatedTarget;
    if (isBlank(blurredEl)) {
      return false;
    }
    return !blurredEl.classList.contains('ember-power-select-search-input');
  },

  actions: {

    submit(company) {
      company.save()
        .then (() => this.sendAction('submit'))
        .then (() => this.get('notify').success('Successfully saved!'))
        .then (() =>
          Promise.all([
            ...company
              .get('offers')
              .map(offer => offer.save())
          ])
        )
        .catch(() => {
          let offer = this.get('offer');
          this.get('notify').alert(offer);

          let errors = offer.get('errors').slice(); // clone array as rollbackAttributes mutates

          offer.rollbackAttributes();
          errors.forEach(({ attribute, message }) => {
            let translated_attribute = this.get('i18n').t(`offer.${attribute}`)['string']
            changeset.pushErrors(attribute, message);
            this.get('notify').alert(`${translated_attribute} ${message}`, { closeAfter: 10000 });
          });
        });
    },

    handleFocus(select, e) {
      console.debug('EPS focused!');
      if (this.focusComesFromOutside(e)) {
        select.actions.open();
      }
    },

    handleBlur() {
      console.debug('EPS blurred!');
    },

    createNewOffer(company) {
      this.get('store').createRecord('offer', { company });
    },

    deleteOffer(offerToDelete) {
      //remove overlay from delete confirmation
      $('.modal-backdrop').remove();
      offerToDelete.destroyRecord();
    },

    createOffer(selected, searchText)
    {
      let options = this.get('options');
      if (!options.includes(searchText)) {
        this.get('options').pushObject(searchText);
      }

      if (selected.includes(searchText)) {
        this.get('notify').alert("Already added!", { closeAfter: 4000 });
      }
      else {
        selected.pushObject(searchText);
      }
    }
  }
});
