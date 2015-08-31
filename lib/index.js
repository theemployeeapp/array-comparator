'use strict';
var _ = require('lodash');
var q = require('q');

module.exports = function ArrayComparator(options) {
  var findKey, existingArray, assignFunction;
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
  if(_.isFunction(options.assignFunction)) {
    assignFunction = options.assignFunction;
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
    if(potentialUpdates.length > 0) {
      var keys = Object.keys(potentialUpdates[0]);
      _.forEach(potentialUpdates, function(updatedDoc) {
        var query = {};
        query[findKey] = updatedDoc[findKey];
        var existingDoc = _.find(existingArray, query);

        var isEqual = true;
        if(_.isArray(options.compareKeys)) {
          _.forEach(options.compareKeys, function (key) {
            if(!_.isEqual(existingDoc[key], updatedDoc[key])) {
              isEqual = false;
            }
          });
        } else {
          if(!_.isEqual(updatedDoc, _.pick(existingDoc, keys))) {
            isEqual = false;
          }
        }

        if(!isEqual) {
          if(assignFunction) {
            result.update.push(assignFunction(existingDoc, updatedDoc));
          } else {
            result.update.push(_.assign(existingDoc, updatedDoc));
          }
        }
      });
    }
    return q.resolve(result);
  };

  var compare = function compare(dataArray) {
    return _compare(dataArray);
  };

  return {
    compare: compare
  };
};
