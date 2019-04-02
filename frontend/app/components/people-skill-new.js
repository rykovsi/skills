import Component from '@ember/component';
import { inject } from '@ember/service';
import { computed } from '@ember/object';

export default Component.extend({
  store: inject(),
  i18n: inject(),

  init() {
    this._super(...arguments);
    this.set('newSkill', this.get('store').createRecord('skill'));
    this.set('newPeopleSkill', this.get('store').createRecord('peopleSkill'));
    this.set('interestLevelOptions', [1,2,3,4,5]);
  },

  didInsertElement() {
    //We need global jquery here because Bootstrap renders the modal outside of the component
    /* eslint-disable ember/no-global-jquery, no-undef, ember/jquery-ember-run  */
    $('#people-skill-new-modal').on('hide.bs.modal', () => {
      this.abort()
    })
    /* eslint-enable no-global-jquery, no-undef, jquery-ember-run  */
  },

  dropdownSkills: computed('peopleSkills', function() {
    const peopleSkillsIds = this.peopleSkills.map(peopleSkill => peopleSkill.get('skill.id'))
    let skills = this.get('store').findAll('skill', { reload: true })
    return skills.then(() => {
      skills = skills.filter(skill => !peopleSkillsIds.includes(skill.get('id')))
      return skills;
    })
  }),

  newSkillSelected: computed('newPeopleSkill.skill', function() {
    if (this.get('newPeopleSkill.skill.content') == null) return false;
    return this.get('newSkill.title') == this.get('newPeopleSkill.skill.title');
  }),

  selectedCategory: computed('newPeopleSkill.skill', 'newSkill.category', function() {
    if (this.get('newPeopleSkill.skill.content') == null) return null;
    return this.get((this.get('newSkillSelected') ? 'newSkill' : 'newPeopleSkill.skill') + '.category');
  }),

  abort() {
    this.set('newSkill', this.get('store').createRecord('skill'));
    this.set('newPeopleSkill', this.get('store').createRecord('peopleSkill'));
  },

  actions: {
    customSuggestion(term) {
      return `${term} neu hinzufügen!`;

    },
    setCategory(category) {
      this.set((this.get('newSkillSelected') ? 'newSkill' : 'newPeopleSkill.skill') + '.category', category);
    },

    setupNewSkill(skillTitle) {
      this.set('newSkill.title', skillTitle);
      this.set('newPeopleSkill.skill', this.get('newSkill'));
    },

    abortNew() {
      /*this try catch is necessary because bootstrap modal does not work in acceptance tests,
      meaning, this would throw an error no matter if the actual feature works and the test
      would fail.*/
      /* eslint-disable no-undef  */
      try {
        $('#people-skill-new-modal').modal('hide')
      } catch (error) {
        Ember.Logger.warn(error.stack)
      }
      /* eslint-enable no-undef  */
    },

    async submit(event) {
      if (this.get('newSkillSelected')) {
        if (this.get('selectedCategory.content') != null) this.set('newSkill.category', this.get('selectedCategory'))
        let skill = this.get('newSkill').save().catch(() => {
          this.get('newSkill.errors').forEach(({ attribute, message }) => {
            let translated_attribute = this.get('i18n').t(`skill.${attribute}`)['string']
            this.get('notify').alert(`${translated_attribute} ${message}`, { closeAfter: 10000 });
          });
          return
        });
        await skill
        this.set('newPeopleSkill.skill', skill);
      }
      this.set('newPeopleSkill.person', this.get('person'));
      return this.get('newPeopleSkill').save()
        .then(() => this.get('notify').success('Member-Skill wurde hinzugefügt!'))
        .then(() => this.send('abortNew'))
        .catch(() => {
          this.set('newPeopleSkill.person', null);
          this.get('newPeopleSkill.errors').forEach(({ attribute, message }) => {
            let translated_attribute = this.get('i18n').t(`peopleSkill.${attribute}`)['string']
            this.get('notify').alert(`${translated_attribute} ${message}`, { closeAfter: 10000 });
          });
        });
    }

  }
});