'use strict';
var _ = require('lodash');
var q = require('q');

module.exports = function ArrayComparator(options) {
  var comparativeKeys, comparativeArray, updateFunc, updateKeys;
  if(_.isArray(options.comparativeKeys)) {
    comparativeKeys = options.comparativeKeys;
  } else {
    throw new Error('Array of keys to compare is required');
  }
  if(_.isArray(options.comparativeArray)) {
    comparativeArray = options.comparativeArray;
  } else {
    throw new Error('Array of data to compare against is required');
  }
  if(_.isFunction(options.updateFunction)) {
    updateFunc = options.updateFunction;
  }
  if(_.isObject(options.updateKeys)) {
    updateKeys = options.updateKeys;
  }

  var buildFindQuery = function(data) {
    var findQuery = {};
    _.forEach(comparativeKeys, function(key) {
      findQuery[key] = data[key];
    });
    return findQuery;
  };

  var getCreateAndUpdateArray = function getCreateArray(dataArray) {
    var createArray = [];
    var updateArray = [];
    _.forEach(dataArray, function(data) {
      var findQuery = buildFindQuery(data);
      var existingDoc = _.find(comparativeArray, findQuery);
      if(!existingDoc) {
        createArray.push(data);
      } else {
        updateArray.push(existingDoc);
      }
    });
    return q.resolve({
      create: createArray,
      update: updateArray,
      feed: dataArray
    });
  };

  // var basicUpdate = function basicUpdate(potentialUpdates, feedArray) {
  //   _.forEach(potentialUpdates, function(existingDoc) {
  //     feedDoc = _.find(feedArray, buildFindQuery());
  //     //LEAVING OFF HERE
  //   })
  // };

  // var checkForUpdates = function checkForUpdates(dataArray, feedArray) {
  //   if(!_.isUndefined(updateFunc)) {

  //   } else if (!_.isUndefined(updateKeys)) {
  //     return basicUpdate(dataArray, feedArray);
  //   }
  // };

  var compare = function compare(dataArray) {
    return getCreateAndUpdateArray(dataArray)
      .then(function(dataArrays) {
        // return checkForUpdates(dataArrays.update, dataArrays.feed);
        return {
          create: dataArrays.create
        };
      });
  };

  return {
    compare: compare
  };
};
