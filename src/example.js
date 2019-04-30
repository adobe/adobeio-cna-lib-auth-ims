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
var IMSAuth = require("./IMSAuth.js")

async function main(params){
  //console.log(params)
  let message = {
                body:
                "CODE<br>" +
                "<a href='?type=code&action=login'>login</a> (Redirect)<br>" +
                "<a href='?type=code&action=logout'>logout</a> (Redirect)<br>" +
                "<a href='?type=code&action=tokens'>tokens</a> (Redirect)<br>" +
                "<a href='?type=code&action=tokens-params'>tokens-params</a> (Using OW Params)<br>" +
                "<a href='?type=code&action=tokens-id'>tokens-id</a> (Using profileID)<br>" +
                "<br>JWT<br>" +
                "<a href='?type=jwt&action=tokens'>tokens</a><br>"
              }
  if(params.type && params.action){
    var imsAuth = new IMSAuth(params.type)
    switch (params.action) {
      case 'login':
        message = imsAuth.login() // Redirects the user to auth flow
        break;
      case 'logout':
        message = imsAuth.logout() // clears the cookies and redirects
        break;
      case 'tokens':
        message = await imsAuth.getToken()
        break;
      case 'tokens-params':
        message = await imsAuth.getToken(params)
        break
      case 'tokens-id':
        message = await imsAuth.getToken("XXXXX")
        break
      default:
        break;
    }
  }
  //console.log(message)

  message = typeof(message) === "string" ? {message} : message
  message = typeof(message) === "object" && typeof(message.body) === "undefined" ? {body:message} : message
  return message

}

exports.main = main
