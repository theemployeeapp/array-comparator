'use strict';
var arrayComparator = require('./index');

describe('Array Comparator', function() {

  beforeEach(function() {

  });

  afterEach(function() {

  });

  it('should throw an error if a comparativeKeys array is not supplied in the options', function() {
    var options = {
      comparativeArray: []
    };
    (function() {
      arrayComparator(options);
    }).should.throw('Array of keys to compare is required');
  });

  it('should throw an error if a comparativeArray is not supplied in the options', function() {
    var options = {
      comparativeKeys: []
    };
    (function() {
      arrayComparator(options);
    }).should.throw('Array of data to compare against is required');
  });

  it('should return 2 objects that need to be created', function(done) {
    var dataArray = [
      {
        id: 1,
        name: 'Frank'
      },
      {
        id: 2,
        name: 'Dave'
      },
      {
        id: 3,
        name: 'Jay'
      }
    ];

    var comparativeArray = [
      {
        id: 3,
        name: 'Jay'
      }
    ];

    var comparativeKeys = ['id', 'name'];

    var options = {
      comparativeArray: comparativeArray,
      comparativeKeys: comparativeKeys
    };
    var comparator = arrayComparator(options);
    comparator.compare(dataArray)
      .then(function(results) {
        results.create.length.should.equal(2);
        results.create[0].id.should.equal(1);
        results.create[0].name.should.equal('Frank');
        results.create[1].id.should.equal(2);
        results.create[1].name.should.equal('Dave');
        done();
      });
  });

  it('should return an empty array to create', function(done) {
    var data = [
      {
        id: 1,
        name: 'Frank'
      },
      {
        id: 2,
        name: 'Dave'
      },
      {
        id: 3,
        name: 'Jay'
      }
    ];
    var options = {
      comparativeKeys: ['id'],
      comparativeArray: data
    };
    var comparator = arrayComparator(options);
    comparator.compare(data)
      .then(function(results) {
        results.create.length.should.equal(0);
        done();
      });
  });
});
