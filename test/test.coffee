
assert = require 'assert'

lib = require './../lib'


# Tue, 07 Jun 2011 18:51:45 GMT
t = new Date 1307472705867


TESTS = [
  
  ["%L", "867"]
  
  ["%Y", "2011"]
  
  ["%m", "06"]
  ["%b", "Jun"]
  ["%B", "June"]
  
  ["%d", null, "07"]
  
  ["%H", null, "18"]
  
  ["%M", "51"]
  
  ["%S", "45"]
  
  ["%s", "1307472705"]
]

for [format, expectedNonUTC, expectedUTC] in TESTS
  expectedUTC or= expectedNonUTC
  for [name, expected] in [['strftime', expectedNonUTC], ['strftimeUTC', expectedUTC]]
    if expected
      got = lib[name] format, t
      assert.equal expected, got, "Error for #{name}(#{JSON.stringify(format)}, t): expected #{JSON.stringify(expected)}, got #{JSON.stringify(got)}"

console.log "OK"
