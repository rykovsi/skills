import Ember from 'ember';
import PersonModel from '../models/person';

const { Component, inject, computed } = Ember;

export default Component.extend({
  store: inject.service(),

  personPictureUploadPath:computed('person.id', function(){
    return `/people/${this.get('person.id')}/picture`;
  }),

  statusData:computed(function(){
    return Object.keys(PersonModel.STATUSES).map(id => {
      return { id, label: PersonModel.STATUSES[id] };
    });
  }),

  actions: {
    submit(changeset) {
      return changeset.save()
        .then(() => this.sendAction('submit'));
    }
  }

});