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
/* eslint-env mocha */

const assert = require('assert')
const sinon = require('sinon')

const IMSAuth = require('../../src/IMSAuth.js')
var imsAuth = new IMSAuth("code")

describe('imsauth', () => {
  describe('code', () => {
    it('login() should redirect', () => {
      const res = imsAuth.login()
      assert(res.statusCode == "302")
    })

    it('login() should redirect to authenticate sequence', () => {
      const res = imsAuth.login()
      assert(res.headers.Location == "/api/v1/web/undefined/myauthp/authenticate")
    })

    it('logout() should redirect', () => {
      const res = imsAuth.logout()
      assert(res.statusCode == "302")
    })

  })
})
