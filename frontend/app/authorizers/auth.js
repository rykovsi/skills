import Base from 'ember-simple-auth/authorizers/base';

export default Base.extend({

  authorize(sessionData, block) {
    let api_token = sessionData.token;
    let ldap_uid = sessionData.ldap_uid;

    if (api_token && ldap_uid) {
      block('api_token', api_token);
      block('ldap_uid', ldap_uid);
    }
  }
});
