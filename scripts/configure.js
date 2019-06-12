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
const yaml = require('js-yaml')
const fs = require('fs')
const path = require('path')

require('dotenv').config({ path: path.join(__dirname, '../', '.env') })

function configureAuth(){
  let imsAuthType = process.env["IMS_AUTH_TYPE"]
  if(!imsAuthType) return

  let serverlessAuthConfigFileName = ''
  let sequenceName = ''
  let sequenceLength = 0
  let persistActionIndex = 0
  if(imsAuthType == "jwt"){
    serverlessAuthConfigFileName = "serverless-jwt.yml"
    sequenceName = 'jwtauthenticate'
    sequenceLength = 1
    persistActionIndex = 1
  }else if(imsAuthType == "code"){
    serverlessAuthConfigFileName = "serverless.yml"
    sequenceName = 'authenticate'
    sequenceLength = 3
    persistActionIndex = 2
  }else{
    console.log("Invalid IMS Auth Type")
    return
  }

  //Read serverless.yml and make changes based on parameters (eg:- enabling/disabling persistence)
  const serverlessAuthConfig = yaml.safeLoad(fs.readFileSync(path.join(__dirname, '../' + serverlessAuthConfigFileName), 'utf8'))
  let imsAuthPersist = process.env["IMS_AUTH_PERSIST"]
  if(imsAuthPersist !== 'undefined'){
    if(imsAuthPersist.toLowerCase() == 'true'){
      if(serverlessAuthConfig["functions"][sequenceName]["sequence"].length==sequenceLength){
        console.log(serverlessAuthConfig["functions"][sequenceName]["sequence"])
        serverlessAuthConfig["functions"][sequenceName]["sequence"].splice(persistActionIndex, 0, "/${self:custom.namespace}/${self:custom.adobe_cache_package}/persist")
        console.log(serverlessAuthConfig["functions"][sequenceName]["sequence"])
        if(typeof(serverlessAuthConfig["resources"]["packages"]["adobe-cache"]) === 'undefined'){
          let adobeCachePackage = {
            name: "${self:custom.adobe_cache_package}",
            binding: "/${self:custom.shared_namespace}/${self:custom.shared_cache_package}",
            parameters: {
              accessKeyId: "${self:custom.accessKeyId}",
              secretAccessKey: "${self:custom.secretAccessKey}"
            }
          }
          serverlessAuthConfig["resources"]["packages"]["adobe-cache"] = adobeCachePackage
        }
      }else
        console.log("Either no change required in serverless.yml or it is malformed")
    }else{
      if(serverlessAuthConfig["functions"][sequenceName]["sequence"].length>sequenceLength){
        console.log(serverlessAuthConfig["functions"][sequenceName]["sequence"])
        serverlessAuthConfig["functions"][sequenceName]["sequence"].splice(persistActionIndex,1)
        console.log(serverlessAuthConfig["functions"][sequenceName]["sequence"])
        delete serverlessAuthConfig["resources"]["packages"]["adobe-cache"]
      }else
        console.log("Either no change required in serverless.yml or it is malformed")
    }
  }

  fs.writeFile(path.join(__dirname, '../' + serverlessAuthConfigFileName), yaml.safeDump(serverlessAuthConfig), (err) => {
    if (err) {
        console.log(err);
    }
  });

}

configureAuth()
