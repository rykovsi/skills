import Ember from 'ember';
import sortByYear from '../utils/sort-by-year';


export default Ember.Component.extend({
  sortedProjects: sortByYear('projects')
});
