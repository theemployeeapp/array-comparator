'use strict';
var arrayComparator = require('./index');
var _ = require('lodash');

describe('Array Comparator', function() {

  beforeEach(function() {

  });

  afterEach(function() {

  });

  it('should throw an error if a comparativeKeys array is not supplied in the options', function() {
    var options = {
      findKey: ''
    };
    (function() {
      arrayComparator(options);
    }).should.throw('A key used to find the existing data is required');
  });

  it('should throw an error if a comparativeArray is not supplied in the options', function() {
    var options = {
      findKey: 'integrationId'
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

    var existingArray = [
      {
        id: 3,
        name: 'Jay'
      }
    ];

    var findKey = 'id';

    var options = {
      existingArray: existingArray,
      findKey: findKey
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
      })
      .then(null, done);
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
      findKey: 'id',
      existingArray: data
    };
    var comparator = arrayComparator(options);
    comparator.compare(data)
      .then(function(results) {
        results.create.length.should.equal(0);
        done();
      });
  });

  it('should return an array of items to delete', function(done) {
    var existingArray = [
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
    var dataArray = [
      {
        id: 1,
        name: 'Frank'
      }
    ];
    var options = {
      findKey: 'id',
      existingArray: existingArray
    };
    var comparator = arrayComparator(options);
    comparator.compare(dataArray)
      .then(function(results) {
        results.create.length.should.equal(0);
        results.delete.length.should.equal(2);
        results.delete[0].id.should.equal(2);
        results.delete[0].name.should.equal('Dave');
        results.delete[1].id.should.equal(3);
        results.delete[1].name.should.equal('Jay');
        done();
      })
      .then(null, done);
  });

  it('should return an array of items to update', function(done) {
    var existingArray = [
      {
        _id: '1111',
        integrationId: 1,
        name: 'Frank Rossi'
      }, {
        _id: '2222',
        integrationId: 2,
        name: 'Dave Arata'
      }, {
        _id: '3333',
        integrationId: 3,
        name: 'Jay Mayde'
      }
    ];
    var dataArray = [
      {
        integrationId: 1,
        name: 'Frank A Rossi'
      }, {
        integrationId: 2,
        name: 'David Arata'
      }, {
        integrationId: 3,
        name: 'Jay Mayde'
      }
    ];
    var options = {
      findKey: 'integrationId',
      existingArray: existingArray
    };
    var comparator = arrayComparator(options);
    comparator.compare(dataArray)
      .then(function(result) {
        result.create.length.should.equal(0);
        result.delete.length.should.equal(0);
        result.update.length.should.equal(2);

        result.update[0]._id.should.equal('1111');
        result.update[0].name.should.equal('Frank A Rossi');
        result.update[0].integrationId.should.equal(1);

        result.update[1]._id.should.equal('2222');
        result.update[1].name.should.equal('David Arata');
        result.update[1].integrationId.should.equal(2);
        done();
      })
      .then(null, done);
  });

  it('should create 1 document, delete 1 document, and update 1 document', function(done) {
    var existingArray = [
      {
        _id: '1111',
        integrationId: 1,
        name: 'Frank Rossi'
      }, {
        _id: '2222',
        integrationId: 2,
        name: 'Dave Arata'
      }, {
        _id: '3333',
        integrationId: 3,
        name: 'Jay Mayde'
      }
    ];
    var dataArray = [
      {
        integrationId: 4,
        name: 'TJ Martinez'
      },
      {
        integrationId: 2,
        name: 'David Arata'
      },
      {
        integrationId: 3,
        name: 'Jay Mayde'
      }
    ];
    var options = {
      findKey: 'integrationId',
      existingArray: existingArray
    };
    var comparator = arrayComparator(options);
    comparator.compare(dataArray)
      .then(function(result) {
        result.create.length.should.equal(1);
        result.create[0].integrationId.should.equal(4);
        result.create[0].name.should.equal('TJ Martinez');

        result.delete.length.should.equal(1);
        result.delete[0]._id.should.equal('1111');
        result.delete[0].integrationId.should.equal(1);
        result.delete[0].name.should.equal('Frank Rossi');

        result.update.length.should.equal(1);
        result.update[0].name.should.equal('David Arata');
        result.update[0].integrationId.should.equal(2);
        result.update[0]._id.should.equal('2222');
        done();
      })
      .then(null, done);
  });

  it('deep comparison test', function() {
    var date = new Date();
    var obj1 = {
      name: 'frank',
      date: date,
      nestedObj: {
        number: 1,
        anotherDate: date,
        array: [1, 2, 3, 4],
        nested2: {
          name: 'hello',
          subSubArray: [date]
        }
      }
    };

    var obj2 = {
      name: 'frank',
      date: date,
      nestedObj: {
        number: 1,
        anotherDate: date,
        array: [1, 2, 3, 4],
        nested2: {
          name: 'hello',
          subSubArray: [date]
        }
      }
    };

    var isEqual = _.isEqual(obj1, obj2);
    isEqual.should.equal(true);
  });

  it('should use a custom assign function if passed into options', function(done) {
    var existingArray = [
      {
        registrationCode: 'reg1',
        groups: [1, 2, 3, 4],
        someOtherField: 'hello'
      }, {
        registrationCode: 'reg2',
        groups: [1, 2],
        someOtherField: 'hola'
      }, {
        registrationCode: 'reg3',
        groups: [1, 2, 3, 4, 5]
      }, {
        registrationCode: 'deleteMe',
        groups: [1 , 2, 3, 4, 5]
      }
    ];

    var inputArray = [
      {
        registrationCode: 'reg1',
        groups: [5]
      }, {
        registrationCode: 'reg2',
        groups: [5]
      }, {
        registrationCode: 'reg3',
        groups: [5]
      }
    ];

    var assignFunc = function (existingDoc, inputDoc) {
      if(_.contains(existingDoc.groups, 5)) {
        return existingDoc;
      } else {
        existingDoc.groups.push(inputDoc.groups[0]);
        return existingDoc;
      }
    };

    var options = {
      findKey: 'registrationCode',
      existingArray: existingArray,
      assignFunction: assignFunc
    };

    var comparator = arrayComparator(options);
    comparator.compare(inputArray)
      .then(function(result) {
        result.create.length.should.equal(0);
        result.update.length.should.equal(3);

        result.update[0].registrationCode.should.equal('reg1');
        result.update[0].groups.length.should.equal(5);
        result.update[0].groups.should.contain(5);

        result.update[1].registrationCode.should.equal('reg2');
        result.update[1].groups.length.should.equal(3);
        result.update[1].groups.should.contain(5);

        result.update[2].registrationCode.should.equal('reg3');
        result.update[2].groups.length.should.equal(5);
        result.update[2].groups.should.contain(5);

        result.delete.length.should.equal(1);
        result.delete[0].registrationCode.should.equal('deleteMe');

        done();
      })
      .then(null, done);
  });

  it('should compare the documents using the keys passed into the options', function(done) {
    var existingArray = [
      {
        registrationCode: 'reg1',
        groups: [1, 2, 3, 4],
        manageType: 'MANAGED'
      }, {
        registrationCode: 'reg2',
        groups: [1, 2],
        manageType: 'ADHOC'
      }, {
        registrationCode: 'reg3',
        groups: [1, 2, 3, 4, 5],
        manageType: 'MANAGED'
      }
    ];

    var inputArray = [
      {
        registrationCode: 'reg1',
        groups: [5],
        manageType: 'MANAGED'
      }, {
        registrationCode: 'reg2',
        groups: [5],
        manageType: 'MANAGED'
      }, {
        registrationCode: 'reg3',
        groups: [5],
        manageType: 'MANAGED'
      }
    ];

    var options = {
      findKey: 'registrationCode',
      existingArray: existingArray,
      compareKeys: ['manageType']
    };

    var comparator = arrayComparator(options);
    comparator.compare(inputArray)
      .then(function(result) {
        result.create.length.should.equal(0);
        result.delete.length.should.equal(0);
        result.update.length.should.equal(1);
        result.update[0].registrationCode.should.equal('reg2');
        done();
      })
      .then(null, done);
  });
});
