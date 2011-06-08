// Based on CoffeeScript by andrewschaaf on github

var assert = require('assert')
  , lib = require('./../lib')

    // Tue, 07 Jun 2011 18:51:45 GMT
  , Time = new Date(1307472705067)

  , Tests =
    [ { format: '%L', expected: '067' }
    , { format: '%Y', expected: '2011' }
    , { format: '%m', expected: '06' }
    , { format: '%b', expected: 'Jun' }
    , { format: '%B', expected: 'June' }
    , { format: '%d', expected: null, expectedUTC: '07' }
    , { format: '%H', expected: null, expectedUTC: '18' }
    , { format: '%M', expected: '51' }
    , { format: '%S', expected: '45' }
    , { format: '%s', expected: '1307472705' }
    , { format: '%l', expected: null, expectedUTC: ' 6' }
    ]

Tests.forEach(function(t) {
  if (t.expected) test('strftime', t.format, t.expected)
  test('strftimeUTC', t.format, t.expectedUTC || t.expected)
})

function test(name, format, expected) {
  var actual = lib[name](format, Time)
  assert.equal(expected, actual, name + '("' + format + '", Time) is ' + JSON.stringify(actual) + ', expected ' + JSON.stringify(expected))
}

console.log('OK')
