
[![Build Status](https://travis-ci.com/adobe/adobeio-cna-lib-auth-ims.svg?branch=master)](https://travis-ci.com/adobe/adobeio-cna-lib-auth-ims)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)


# DEPRECATED

Please use https://github.com/adobe/aio-app-scripts

This module is to help CNA developers allow
- app users to login using IMS (This is done by creating server-side authentication flow using grant type of auth_code)
- apps to authenticate with IMS using JWT.

The following runtime artifacts will be created in your namespace (one for each auth flow).
- A runtime package with binding to oauth/jwt action from shared namespace.
- A sequence for oauth/jwt workflow which takes care of persisting the tokens.

## Configuration
The configuration is based on an .env file in the module's root folder.
Create an .env file in root dir with following parameters.

### For grant type of auth_code
```
OW_APIHOST=adobeioruntime.net
OW_AUTH="<change-me>"
OW_NAMESPACE="<change-me>"
OAUTH_API_KEY=<API_KEY of OAUTH integration in IO console>
CLIENT_SECRET=<client_secret of above integration>
REDIRECT_URL=https://runtime.adobe.io/
COOKIE_PATH='<cookie path for the cookie which stores the identity of logged in user>'
# Optional parameters (should use 'npm run configure' if used)
IMS_AUTH_TYPE=<code/jwt>
IMS_AUTH_PERSIST=<true/false(default)>
# If using persistence
AWS_ACCESS_KEY_ID="<change-me>"
AWS_SECRET_ACCESS_KEY="<change-me>"
```
#### Persistence
The database supported right now for tokens persistence is dynamodb and the tables required for persistence should have the following schema. So you will have to create these tables, get the AWS access creds and provide them in .env file as shown above.
```
#Profile (TableName)
profileID (Partition Key)
provider (Sort Key)

#RefreshToken (TableName)
profileID (Partition Key)
expiryDate (Sort Key)
```

### For JWT
```
OW_NAMESPACE="<change-me>"
# Optional parameters (should use 'npm run configure' if used)
IMS_AUTH_TYPE=<code/jwt>
```
In addition to the above configuration, for JWT, you need to edit jwt.json file (located in the module's root folder) with details of integration.
```
"jwt_client_id": "change-me",
"jwt_client_secret": "change-me",
"technical_account_id": "change-me",
"org_id": "change-me",
"meta_scopes": ["change-me"],
"private_key": ["change-me"]
```
You can find these details in Overview and JWT tabs of your integration in IO Console.

## Deployment

### For grant type of auth_code
```
npm install
npm run deploy
```

### For JWT
```
npm install
npm run deploy-jwt
```

## Usage
This module comes with an example.js in src folder to help with usage. You can deploy it on runtime by putting the following lines under 'functions' in serverless.yml located in root folder.
```
  # imsauth
  imsauthexample:
    handler: src/example.main
    name: imsauthexample
    annotations:
      web-export: true
```

### Contributing

Contributions are welcomed! Read the [Contributing Guide](./.github/CONTRIBUTING.md) for more information.

### Licensing

This project is licensed under the Apache V2 License. See [LICENSE](LICENSE) for more information.
