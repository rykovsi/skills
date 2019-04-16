import Route from '@ember/routing/route';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Route.extend(AuthenticatedRouteMixin, {
  queryParams: {
    defaultSet: {
      refreshModel: true,
      replace: true
    },

    category: {
      refreshModel: true,
      replace: true
    },

    title: {
      refreshModel: true,
      replace: true
    }
  },

  model({ defaultSet, category, title }) {
    return this.store.query('skill', { defaultSet, category, title })
  },
});