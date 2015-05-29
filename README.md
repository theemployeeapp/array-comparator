#  [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url]

> The best module ever.


## Install

```sh
$ npm install array-comparator --save
```
##Description
Comparator for use with the chrysalis framework: [https://github.com/APPrise-Mobile/chrysalis]
This is the module used to determine what documents need to be created, based on a comparative array of documents the endpoint database already contains, and an array of comparative keys to compare.  These keys are usually unique identifiers for each document, the framework will then check to see if the value of the compareKey exists on any of the documents from the compare array.  If it doesn't exists, then the document is marked for creation.

Support for update and deletion coming soon.  


## Usage

```js
var arrayComparator = require('array-comparator');
var chrysalis = require('chrysalis');

var options = {
  comparativeKeys: ['integrationId'],
  comparativeArray: mongoData
};
var comparator = arrayComparator(options);

var chrysis = chrysalis();
chrysis.setComparator(comparator);
```


## License

MIT © [APPrise-Mobile]()


[npm-image]: https://badge.fury.io/js/array-comparator.svg
[npm-url]: https://npmjs.org/package/array-comparator
[travis-image]: https://travis-ci.org/APPrise-Mobile/array-comparator.svg?branch=master
[travis-url]: https://travis-ci.org/APPrise-Mobile/array-comparator
[daviddm-image]: https://david-dm.org/APPrise-Mobile/array-comparator.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/APPrise-Mobile/array-comparator
