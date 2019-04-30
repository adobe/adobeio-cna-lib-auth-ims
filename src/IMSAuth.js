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
var IMSAUTHProviderFactory = require('./providers/IMSAUTHProviderFactory.js')

class IMSAuth {
  constructor (response_type, package_binding_name, sequence_name) {
    this.IMSAUTHProviderClass = IMSAUTHProviderFactory.get(response_type)
    this.imsAuthProvider = new this.IMSAUTHProviderClass(package_binding_name, sequence_name)
  }

  login(){
    return this.imsAuthProvider.login()
  }
  logout(){
    return this.imsAuthProvider.logout()
  }

  async getToken(params){
    return this.imsAuthProvider.getToken(params)
  }

}
module.exports = IMSAuth
