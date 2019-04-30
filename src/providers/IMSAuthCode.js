/*
Copyright 2019 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/
const cookie = require('cookie')
const utils = require('./Utils')

class IMSAuthCode {
  constructor (package_binding_name, sequence_name) {
    this.namespace = process.env["__OW_NAMESPACE"]
    this.package_binding_name = package_binding_name || 'myauthp-shared'
    this.sequence_name = sequence_name || 'myauthp/authenticate'
  }

  login(){
    return utils.buildResp("", 302, {'Location': '/api/v1/web/'+this.namespace+'/'+this.sequence_name})
  }
  logout(){
    return utils.buildResp("", 302, {'Location': '/api/v1/web/'+this.namespace+'/'+this.package_binding_name+'/logout'})
  }

  async getToken(params){
    switch(typeof(params)) {
      case 'undefined':
        //Redirect to tokens shared endpoint
        return utils.buildResp("", 302, {
            'Location': '/api/v1/web/'+this.namespace+'/'+this.package_binding_name+'/tokens'
          })
        break;

      case 'string':
        //Get accessToken for profileID passed as params
        return await utils.callOWAction(this.package_binding_name+'/tokens', {profileID: params})
        break;

      case 'object'://Read cookie from OW params and get profileID
        let cookieName = params ? params.cookieName : undefined
        let ctx = this.readCookies(params, cookieName)
        let profile = this.readProfile(ctx)
        //return accessToken if stored in cookie (in case of no persistence), else get it from db
        return typeof(profile) !== 'undefined'
                  ? profile.accessToken
                      ? { token: profile.accessToken }
                      : await utils.callOWAction(this.package_binding_name+'/tokens', {profileID: profile.user_id})
                  : undefined
        break;

      default:
        break;
    }
  }

  readCookies (params, cookieName) {
    cookieName = cookieName || '__Secure-auth_context'
    var cookies = cookie.parse(params.__ow_headers['cookie'] || '')
    var ctx = cookies[cookieName] ? JSON.parse(cookies[cookieName]) : {}
    ctx.identities = ctx.identities || []
    return ctx
  }

  readProfile (ctx) {
    if(ctx.identities.length == 0)
      return;

    for (var i = 0; i < ctx.identities.length; i++) {
      let ident = ctx.identities[i]
      if (ident !== null && typeof (ident) !== 'undefined') {
        if (ident.provider === 'adobe') {
          return ident
        }
      }
    }
  }

}
module.exports = IMSAuthCode
