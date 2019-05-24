# wavecell-sdk

[![Greenkeeper badge](https://badges.greenkeeper.io/andcards/wavecell-sdk.svg)](https://greenkeeper.io/)
[![Build Status](https://travis-ci.org/andcards/wavecell-sdk.svg?branch=master)](https://travis-ci.org/andcards/wavecell-sdk)
[![npm package](https://badge.fury.io/js/wavecell-sdk.svg)](https://www.npmjs.org/package/wavecell-sdk)
[![Dependency Status](https://david-dm.org/andcards/wavecell-sdk.svg)](https://david-dm.org/andcards/wavecell-sdk)
[![devDependency Status](https://david-dm.org/andcards/wavecell-sdk/dev-status.svg)](https://david-dm.org/andcards/wavecell-sdk#info=devDependencies)

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

### otpCodeSend(phoneNumber, smsTemplate, accountConfig, options = {})

To send otp code to your phone number, use `otpCodeSend`.

```javascript
import { otpCodeSend } from "wavecell-sdk";

const smsTemplate = {
  source: "Wavecell SDK",
  text: "Your verification code is {code}."
};

const accountConfig = {
  accountId: "Your wavecell account id",
  password: "Your wavecell account password",
  subAccountId: "Your wavecell sub account id"
};

otpCodeSend("+3809399927332", smsTemplate, accountConfig).then(response => {
  // Use resourceUri for validating otp.
  console.log(response.resourceUri);
});
```

#### Parameters

- `phoneNumber` - receiver phone number. (Required)
- `smsTemplate` - SMS template configuration. (Required)
  - `source` - Used as senderID. (Required)
  - `text` - Text of SMS body. Can be personalized with {code} and {productName}
    placeholders.
  - `encoding` - Character set to use for this SMS - The possible values are
    AUTO - GSM7 - UCS2. Default `AUTO`. (Optional)
- `accountConfig` - Wavecell account credentials. (Required)
  - `accountId` - Wavecell account id. (Required)
  - `password` - Wavecell account password. (Required)
  - `subAccountId` - Wavecell sub account id. (Required)
- `options` (Optional)
  - `codeLength` - Length of sended code. Default `4`. (Optional)
  - `codeType` - Type of sended code. Default `NUMERIC`. (Optional)
  - `codeValidity` - Number of seconds code will be valid. Default `300`.
    (Optional)
  - `createNew` - Flag to force create new code each time. Default `true`.
    (Optional)
  - `resendingInterval` - Number of seconds between requests to the same phone
    number. default `15`. (Optional)
  - `productName` - Product name which can be displayed in sms text. (Optional)

#### Response

Resolves with object, same to response body of Wavecell API.
https://developer.wavecell.com/v1/api-documentation/verify-code-generation.

### otpCodeVerify(otp, resourceUri, accountConfig)

To verify otp received in SMS, use `otpCodeVerify`.

```javascript
import { otpCodeVerify, VERIFICATION_STATUS } from "wavecell-sdk";

const accountConfig = {
  accountId: "Your wavecell account id",
  password: "Your wavecell account password",
  subAccountId: "Your wavecell sub account id"
};

const otp = "Otp received in SMS";
const resourceUri = "Resource uri received in otpCodeSend step";

otpCodeVerify(otp, resourceUri, accountConfig).then(response => {
  if (response.status === VERIFICATION_STATUS.VERIFIED) {
    // Log in user
  } else {
    return Promise.reject(new Error("Log in failed."));
  }
});
```

#### Parameters

- `otp` - Otp code received via sms. Pass empty otp code to get current status
  of authentication object.
- `resourceUri` - Uri for validating otp. Can be found in `otpCodeSend`
  response. (Required)
- `accountConfig` - Wavecell account credentials. (Required)
  - `accountId` - Wavecell account id. (Required)
  - `password` - Wavecell account password. (Required)

#### Response

Resolves with object, same to response body of Wavecell API.
https://developer.wavecell.com/v1/api-documentation/verify-code-validation.

### License

MIT
