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
const utils = require('./Utils')

class IMSAuthJWT {
  constructor (package_binding_name, sequence_name) {
    this.namespace = process.env["__OW_NAMESPACE"]
    this.package_binding_name = package_binding_name || 'jwtauthp-shared'
    this.sequence_name = sequence_name || 'jwtauthp/jwtauthenticate'
  }

  login(){
    return utils.buildResp("", 404)
  }

  logout(){
    return utils.buildResp("", 404)
  }

  async getToken(params){
    if(params && typeof(params) !== "object")
      return "Invalid parameters"
    // TODO This should call the 'tokens' shared action instead to handle the persistence and auto refresh
    let res = await utils.callOWAction(this.package_binding_name+'/jwtauth', params)

    if(res && res.accessToken)
      return {token:res.accessToken}
    return "Invalid parameters"
  }

}
module.exports = IMSAuthJWT
