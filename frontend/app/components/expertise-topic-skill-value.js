import Ember from 'ember';

const { Component, inject, computed } = Ember;

export default Component.extend({
  store: inject.service(),
  i18n: inject.service(),

  tagName: 'tr',
  classNames: [ 'content-row' ],
  classNameBindings: [ 'editing:content-row-edit' ],
  editing: false,
  expertiseTopic: null,

  click() { this.set('editing', true) },

  expertiseTopicSkillValue: computed('person.expertiseTopicSkillValues.[]', 'expertiseTopic.id', function() {
    return this.get('person.expertiseTopicSkillValues')
      .findBy('expertiseTopic.id', this.get('expertiseTopic.id'));
  }),

  actions: {
    submit(changeset, event) {
      event.preventDefault();

      changeset.set('expertiseTopic', this.get('expertiseTopic'));
      changeset.set('person', this.get('person'));

      return changeset.save()
        .then(record => {
          this.get('notify').success('Fachwissen wurde aktualisiert');
          this.set('editing', false);
          this.set('expertiseTopicSkillValue', record);

          return record;
        })
        .catch(err => {
          changeset.get('_content.errors').forEach(({ attribute, message }) => {
            let translated_attribute = this.get('i18n').t(`expertise-topic-skill-value.${attribute}`)['string']
            changeset.pushErrors(attribute, message);
            this.get('notify').alert(`${translated_attribute} ${message}`, { closeAfter: 10000 });
          });
        })
    }
  }
});
