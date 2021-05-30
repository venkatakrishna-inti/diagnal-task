## Quick Start

Install the latest version of the Serverless Framework:

```
npm i -g serverless

```

Then, clone the App:

```
cd diganal-task

cd layers/common/nodejs
npm install

cd ../../
sls deploy -s dev

cd ../crawler
npm install
sls deploy -s dev
```

API End Point:

```
https://o5vwp3tmpf.execute-api.ap-south-1.amazonaws.com/dev/parser
```

`https://o5vwp3tmpf.execute-api.ap-south-1.amazonaws.com/dev` is the Domain
