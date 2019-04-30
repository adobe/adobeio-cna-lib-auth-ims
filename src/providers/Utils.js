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
var openwhisk = require('openwhisk')

function buildResp (message, status, extraHeaders) {
  status = status || 200
  let headers = {
    'content-type': 'application/json',
    ...extraHeaders
  }
  //headers = Object.assign({}, extraHeaders, headers)
  let bodyJSON = typeof (message) === 'string' ? { message } : message
  return {
    headers,
    statusCode: status,
    body: bodyJSON
  }
}

function callOWAction (actionName, params){
  return new Promise((resolve, reject) => {
    let ow = openwhisk()
    let invokeParams = { actionName: actionName, blocking: true, result: true }
    if(params)
      invokeParams.params = params
    ow.actions.invoke(invokeParams)
      .then(res => {
        resolve(res)
      })
      .catch(err => { console.log(err); resolve(err)})
  })
}

module.exports = {
  callOWAction : callOWAction,
  buildResp : buildResp
}
