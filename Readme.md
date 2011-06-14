strftime
========

strftime for JavaScript, supports localization.


Installation
============

npm install strftime


Usage
=====

    var strftime = require('strftime').strftime
    console.log(strftime('%B %d, %y %H:%M:%S')) // => April 28, 2011 18:21:08

If you want to localize it:

    var strftime = require('strftime').strftime
    var it_IT = {
        days: [ 'domenica', 'lunedi', 'martedi', 'mercoledi', 'giovedi', 'venerdi', 'sabato' ],
        shortDays: [ 'dom', 'lun', 'mar', 'mer', 'gio', 'ven', 'sab' ],

        months: [ 'gennaio', 'febbraio', 'marzo', 'aprile', 'maggio', 'giugno', 'luglio',
                  'agosto', 'settembre', 'ottobre', 'novembre', 'dicembre' ],

        shortMonths: [ 'gen', 'feb', 'mar', 'apr', 'mag', 'giu', 'lug', 'ago',
                       'set', 'ott', 'nov', 'dic' ],
        AM: 'AM',
        PM: 'PM'
    }
    console.log(strftime('%B %d, %y %H:%M:%S', it_IT)) // => aprile 28, 2011 18:21:08

And if you don't want to pass a localization object every time you can get a localized `strftime` function like so:

    var strftime = require('strftime')
    var it_IT = { /* same as above */ }
    var strftime_IT = strftime.localizedStrftime(it_IT)
    console.log(strftime_IT('%B %d, %y %H:%M:%S')) // aprile 28, 2011 18:21:08

For details just see `man 3 strftime` as the format specifiers are identical.

**NOTE:** `getLocalizedStrftime` is deprecated, use `localizedStrftime` instead. `getLocalizedStrftime` will be removed in 0.5 or 0.6.

License
=======

Copyright 2010 - 2011 Sami Samhuri sami.samhuri@gmail.com

MIT (see included [LICENSE](/samsonjs/strftime/blob/master/LICENSE))
