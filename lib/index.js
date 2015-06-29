'use strict';
var _ = require('lodash');
var q = require('q');

module.exports = function ArrayComparator(options) {
  var findKey, existingArray, updateFunc, updateKeys;
  if(_.isString(options.findKey) && options.findKey.length > 0) {
    findKey = options.findKey;
  } else {
    throw new Error('A key used to find the existing data is required');
  }
  if(_.isArray(options.existingArray)) {
    existingArray = options.existingArray;
  } else {
    throw new Error('Array of data to compare against is required');
  }
  if(_.isFunction(options.updateFunction)) {
    updateFunc = options.updateFunction;
  }
  if(_.isObject(options.updateKeys)) {
    updateKeys = options.updateKeys;
  }

  var _compare = function _compare(dataArray) {
    var result = {};
    var potentialUpdates = _.remove(dataArray, function(data) {
      var query = {};
      query[findKey] = data[findKey];
      var foundData = _.find(existingArray, query);
      if(_.isUndefined(foundData)) {
        return false;
      } else {
        return true;
      }
    });
    result.create = dataArray;

    result.delete = _.remove(existingArray, function(data) {
      var query = {};
      query[findKey] = data[findKey];
      var foundData = _.find(potentialUpdates, query);
      if(_.isUndefined(foundData)) {
        return true;
      } else {
        return false;
      }
    });

    result.update = [];
    var keys = Object.keys(potentialUpdates[0]);
    _.forEach(potentialUpdates, function(updatedDoc) {
      var query = {};
      query[findKey] = updatedDoc[findKey];
      var existingDoc = _.find(existingArray, query);
      if(!_.isEqual(updatedDoc, _.pick(existingDoc, keys))) {
        result.update.push(_.assign(existingDoc, updatedDoc));
      }
    });
    return q.resolve(result);
  };

  var compare = function compare(dataArray) {
    return _compare(dataArray);
  };

  return {
    compare: compare
  };
};
