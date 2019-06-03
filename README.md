# wavecell-sdk

[![Greenkeeper badge](https://badges.greenkeeper.io/andcards/wavecell-sdk.svg)](https://greenkeeper.io/)
[![Build Status](https://travis-ci.org/andcards/wavecell-sdk.svg?branch=master)](https://travis-ci.org/andcards/wavecell-sdk)
[![npm package](https://badge.fury.io/js/wavecell-sdk.svg)](https://www.npmjs.org/package/wavecell-sdk)
[![Dependency Status](https://david-dm.org/andcards/wavecell-sdk.svg)](https://david-dm.org/andcards/wavecell-sdk)
[![devDependency Status](https://david-dm.org/andcards/wavecell-sdk/dev-status.svg)](https://david-dm.org/andcards/wavecell-sdk#info=devDependencies)
[![Coverage Status](https://codecov.io/gh/andcards/wavecell-sdk/branch/master/graph/badge.svg)](https://codecov.io/gh/andcards/wavecell-sdk)

Javascript SDK for Wavecell API.
https://developer.wavecell.com/v1/api-documentation.

## Installation

Install Wavecell SDK from npm

```sh
npm install --save wavecell-sdk
```

or with yarn:

```sh
yarn add wavecell-sdk
```

## API

- [otpCodeSend](#otpcodesend)
- [otpCodeVerify](#otpcodeverify)
- [Error Types](#error-types)

### otpCodeSend

To generate OTP code and send it to your phone number, use `otpCodeSend`.

```javascript
import { otpCodeSend } from "wavecell-sdk";

const phoneNumber = "+3809399927332";

otpCodeSend({
  apiKey: "ApiKey from customer portal",
  destination: phoneNumber,
  smsSource: "Wavecell SDK",
  smsText: "Your verification code is {code}.",
  subAccountId: "Your wavecell sub account id"
}).then(response => {
  // Use resourceUri for validating OTP.
  console.log(response.resourceUri);
});
```

#### Parameters

- `apiKey` - Api key from Wavecell customer portal.
- `accountId` - Wavecell account id. (Required if `apiKey` is not specified)
- `accountPassword` - Wavecell account password. (Required if `apiKey` is not
  specified)
- `destination` - receiver phone number. (Required)
- `smsSource` - Used as senderID. (Required)
- `smsText` - Text of SMS body. Can be personalized with {code} and
  {productName}. placeholders.
- `subAccountId` - Wavecell sub account id. (Required)
- `options` - Additional configurations.
  - `codeLength` - Length of sended code. Default `4`. (Optional)
  - `codeType` - Type of sended code. Default `NUMERIC`. (Optional)
  - `codeValidity` - Number of seconds code will be valid. Default `300`.
    (Optional)
  - `createNew` - Flag to force create new code each time. Default `true`.
    (Optional)
  - `resendingInterval` - Number of seconds between requests to the same phone
    number. default `15`. (Optional)
  - `productName` - Product name which can be displayed in sms text. (Optional)
  - `smsEncoding` - Character set to use for this SMS - The possible values are
    `AUTO` - `GSM7` - `UCS2`. Default `AUTO`. (Optional)

#### Response

Resolves with object, same to response body of Wavecell API.
https://developer.wavecell.com/v1/api-documentation/verify-code-generation.

### otpCodeVerify

To verify OTP received in SMS, use `otpCodeVerify`.

```javascript
import { otpCodeVerify, VERIFICATION_STATUS } from "wavecell-sdk";

otpCodeVerify({
  apiKey: "ApiKey from customer portal",
  otp: "OTP received in SMS",
  resourceUri: "Resource uri received in otpCodeSend step"
}).then(response => {
  if (response.status === VERIFICATION_STATUS.VERIFIED) {
    // Log in user
  } else {
    return Promise.reject(new Error("Log in failed."));
  }
});
```

#### Parameters

- `accountId` - Wavecell account id. (Required if `apiKey` is not specified)
- `accountPassword` - Wavecell account password. (Required if `apiKey` is not
  specified)
- `apiKey` - Api key from Wavecell customer portal.
- `otp` - OTP code received via sms. Pass empty OTP code to get current status
  of authentication object.
- `resourceUri` - Uri for validating OTP. Can be found in `otpCodeSend`
  response. (Required)

#### Response

Resolves with object, same to response body of Wavecell API.
https://developer.wavecell.com/v1/api-documentation/verify-code-validation.

### Error types

Usage:

```javascript
import { ERROR_TYPES } from "wavecell-sdk";

otpCodeVerify({
  apiKey: "invalid api key",
  otp: "OTP received in SMS",
  resourceUri: "Resource uri received in otpCodeSend step"
}).catch(error => {
  if (error.type === ERROR_TYPES.AUTH_FAILED_ERROR_TYPE) {
    console.warn("Authentication failed");
  }
});
```

Supported error types:

| Error type                          | Explanation                                              |
| ----------------------------------- | -------------------------------------------------------- |
| `AUTH_FAILED_ERROR_TYPE`            | ApiKey, accountId, password or subAccountId is not valid |
| `CONTENT_TYPE_NOT_VALID_ERROR_TYPE` | API response is not in json format                       |
| `DESTINATION_NOT_VALID_ERROR_TYPE`  | Receiver of SMS is not valid                             |
| `OBJECT_NOT_FOUND_ERROR_TYPE`       | Requested object not found or already expired            |
| `RE_SENDING_NOT_ALLOWED_ERROR_TYPE` | Tried to send OTP code in restricted time period         |
| `SMS_TEMPLATE_NOT_VALID_ERROR_TYPE` | SMS template is not provided or is not valid             |
| `REQUEST_FAILED_ERROR_TYPE`         | Default error type                                       |

### License

MIT
