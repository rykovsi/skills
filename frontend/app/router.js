import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function(){
  this.route('people', function(){
    this.route('new');
    this.route('person', { path: '/:person_id', resetNamespace: true });
  });
});

export default Router;