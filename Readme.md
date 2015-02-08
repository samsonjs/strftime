strftime
========

strftime for JavaScript, works in Node.js and browsers, supports localization.
Most standard specifiers from C are supported as well as some other extensions
from Ruby.


Installation
============

    npm install strftime


The New API in 0.9
==================

The current version, 0.9, deprecates the older API that exported several functions: `strftimeTZ`, `strftimeUTC`, and `localizedStrftime`. In addition to this the exported function referenced itself as `require('strftime').strftime` for consistency with the other functions. *These functions are deprecated in 0.9 and will be removed in 1.0.*

Now you only need the single object exported and you can create a specialized version of it using the functions `utc()`, `localize(locale)`, and `timezone(offset)`. You can no longer pass in a timezone or locale on each call to `strftime` which is a regression. If you need this let me know and we will add it back into the API.


Usage
=====

    var strftime = require('strftime')
    console.log(strftime('%B %d, %Y %H:%M:%S')) // => April 28, 2011 18:21:08
    console.log(strftime('%F %T', new Date(1307472705067))) // => 2011-06-07 18:51:45


If you want to localize it:

    var strftime = require('strftime')
    var it_IT = {
        days: ['domenica', 'lunedi', 'martedi', 'mercoledi', 'giovedi', 'venerdi', 'sabato'],
        shortDays: ['dom', 'lun', 'mar', 'mer', 'gio', 'ven', 'sab'],
        months: ['gennaio', 'febbraio', 'marzo', 'aprile', 'maggio', 'giugno', 'luglio', 'agosto', 'settembre', 'ottobre', 'novembre', 'dicembre'],
        shortMonths: ['gen', 'feb', 'mar', 'apr', 'mag', 'giu', 'lug', 'ago', 'set', 'ott', 'nov', 'dic'],
        AM: 'AM',
        PM: 'PM',
        am: 'am',
        pm: 'pm',
        formats: {
            D: '%m/%d/%y',
            F: '%Y-%m-%d',
            R: '%H:%M',
            r: '%I:%M:%S %p',
            T: '%H:%M:%S',
            v: '%e-%b-%Y'
        }
    }
    var strftimeIT = strftime.localize(it_IT)
    console.log(strftimeIT('%B %d, %Y %H:%M:%S')) // => aprile 28, 2011 18:21:08
    console.log(strftimeIT('%B %d, %Y %H:%M:%S', new Date(1307472705067))) // => giugno 7, 2011 18:51:45


Time zones can be passed in as an offset from GMT in minutes.

    var strftime = require('strftime')
    var strftimePDT = strftime.timezone(-420)
    var strftimeCEST = strftime.timezone(120)
    console.log(strftimePDT('%B %d, %y %H:%M:%S', new Date(1307472705067))) // => June 07, 11 11:51:45
    console.log(strftimeCEST('%F %T', new Date(1307472705067))) // => 2011-06-07 20:51:45


Alternatively you can use the timezone format used by ISO 8601, `+HHMM` or `-HHMM`.

    var strftime = require('strftime')
    var strftimePDT = strftime.timezone('-0700')
    var strftimeCEST = strftime.timezone('+0200')
    console.log(strftimePDT('', new Date(1307472705067))) // => June 07, 11 11:51:45
    console.log(strftimeCEST('%F %T', new Date(1307472705067))) // => 2011-06-07 20:51:45


Supported Specifiers
====================

Extensions from Ruby are noted in the following list.

Unsupported specifiers are rendered without the percent sign.
e.g. `%q` becomes `q`. Use `%%` to get a literal `%` sign.

- A: full weekday name
- a: abbreviated weekday name
- B: full month name
- b: abbreviated month name
- C: AD century (year / 100), padded to 2 digits
- D: equivalent to `%m/%d/%y`
- d: day of the month, padded to 2 digits (01-31)
- e: day of the month, padded with a leading space for single digit values (1-31)
- F: equivalent to `%Y-%m-%d`
- H: the hour (24-hour clock), padded to 2 digits (00-23)
- h: the same as %b (abbreviated month name)
- I: the hour (12-hour clock), padded to 2 digits (01-12)
- j: day of the year, padded to 3 digits (001-366)
- k: the hour (24-hour clock), padded with a leading space for single digit values (0-23)
- L: the milliseconds, padded to 3 digits [Ruby extension]
- l: the hour (12-hour clock), padded with a leading space for single digit values (1-12)
- M: the minute, padded to 2 digits (00-59)
- m: the month, padded to 2 digits (01-12)
- n: newline character
- o: day of the month as an ordinal (without padding), e.g. 1st, 2nd, 3rd, 4th, ...
- P: "am" or "pm" in lowercase [Ruby extension]
- p: "AM" or "PM"
- R: equivalent to `%H:%M`
- r: equivalent to `%I:%M:%S %p`
- S: the second, padded to 2 digits (00-60)
- s: the number of seconds since the Epoch, UTC
- T: equivalent to `%H:%M:%S`
- t: tab character
- U: week number of the year, Sunday as the first day of the week, padded to 2 digits (00-53)
- u: the weekday, Monday as the first day of the week (1-7)
- v: equivalent to `%e-%b-%Y`
- W: week number of the year, Monday as the first day of the week, padded to 2 digits (00-53)
- w: the weekday, Sunday as the first day of the week (0-6)
- Y: the year with the century
- y: the year without the century (00-99)
- Z: the time zone name, replaced with an empty string if it is not found
- z: the time zone offset from UTC, with a leading plus sign for UTC and zones east
     of UTC and a minus sign for those west of UTC, hours and minutes follow each
     padded to 2 digits and with no delimiter between them

For more detail see `man 3 strftime` as the format specifiers should behave
identically. If behaviour differs please [file a bug](https://github.com/samsonjs/strftime/issues/new).

Any specifier can be modified with `-`, `_`, or `0` as well, as in Ruby.
Using `%-` will omit any leading zeroes or spaces, `%_` will force spaces
for padding instead of the default, and `%0` will force zeroes for padding.
There's some redundancy here as `%-d` and `%e` have the same result, but it
solves some awkwardness with formats like `%l`.

Contributors
============

* [Rob Colburn](https://github.com/robcolburn)
* [Alexandr Nikitin](https://github.com/alexandrnikitin)
* [Sami Samhuri](https://github.com/samsonjs)
* [Andrew Schaaf](https://github.com/andrewschaaf)
* [Ryan Stafford](https://github.com/ryanstafford)


License
=======

Copyright 2010 - 2015 Sami Samhuri sami@samhuri.net

[MIT license](http://sjs.mit-license.org)

