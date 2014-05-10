//
// strftime
// github.com/samsonjs/strftime
// @_sjs
//
// Copyright 2010 - 2013 Sami Samhuri <sami@samhuri.net>
//
// MIT License
// http://sjs.mit-license.org
//

;
(function () {
    //// Where to export the API
    var namespace;

    try {
        // CommonJS / Node module
        namespace = module.exports = strftime;
    } catch (error) {
        // Browsers and other environments
        // Get the global object. Works in ES3, ES5, and ES5 strict mode.
        namespace = new Function('return this')();
    }

    var DefaultLocale = {
        days: 'Sunday Monday Tuesday Wednesday Thursday Friday Saturday'.split(' '),
        shortDays: 'Sun Mon Tue Wed Thu Fri Sat'.split(' '),
        months: 'January February March April May June July August September October November December'.split(' '),
        shortMonths: 'Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec'.split(' '),
        AM: 'AM',
        PM: 'PM',
        am: 'am',
        pm: 'pm'
    };

    var RequiredDateMethods = [
        'getTime',
        'getTimezoneOffset',
        'getDay',
        'getDate',
        'getMonth',
        'getFullYear',
        'getYear',
        'getHours',
        'getMinutes',
        'getSeconds'
    ];

    var _options;
    var _locale;
    var _date;
    var _timeZone;
    var _padding;

    // d, locale, and options are optional, but you can't leave
    // holes in the argument list. If you pass options you have to pass
    // in all the preceding args as well.
    //
    // options:
    //   - locale   [object] an object with the same structure as DefaultLocale
    //   - timezone [number] timezone offset in minutes from GMT
    function _strftime(format, d, locale, options) {
        _options = options || {};
        _locale = locale;
        _date = d;
        _timeZone = _options.timezone;

        // d and locale are optional so check if d is really the locale
        if (_date && !quacksLikeDate(_date)) {
            _locale = _date;
            _date = undefined;
        }

        _date = _date || new Date();
        _locale = _locale || DefaultLocale;
        _locale.formats = _locale.formats || {};

        var tzType = typeof _timeZone;

        if (_options.utc || tzType === 'number' || tzType === 'string') {
            _date = dateToUTC(_date);
        }

        if (_timeZone) {
            // ISO 8601 format timezone string, [-+]HHMM
            // Convert to the number of minutes and it'll be applied to the date below.
            if (tzType === 'string') {
                var sign = _timeZone[0] === '-' ? -1 : 1;
                var hours = parseInt(_timeZone.slice(1, 3), 10);
                var mins = parseInt(_timeZone.slice(3, 5), 10);

                _timeZone = sign * (60 * hours) + mins;
            }

            _date = new Date(_date.getTime() + (_timeZone * 60000));
        }

        return format.replace(/%([-_0]?)(.)/g, processing);
    }

    var mask = {
        'A': function () {
            return _locale.days[_date.getDay()];
        },
        'a': function () {
            return _locale.shortDays[_date.getDay()];
        },
        'B': function () {
            return _locale.months[_date.getMonth()];
        },
        'b': function () {
            return _locale.shortMonths[_date.getMonth()];
        },
        'C': function () {
            return pad(Math.floor(_date.getFullYear() / 100), _padding);
        },
        'D': function () {
            return _strftime(_locale.formats.D || '%m/%d/%y', _date, _locale);
        },
        'd': function () {
            return pad(_date.getDate(), _padding);
        },
        'e': function () {
            return _date.getDate();
        },
        'F': function () {
            return _strftime(_locale.formats.F || '%Y-%m-%d', _date, _locale);
        },
        'H': function () {
            return pad(_date.getHours(), _padding);
        },
        'h': function () {
            return _locale.shortMonths[_date.getMonth()];
        },
        'I': function () {
            return pad(hours12(_date), _padding);
        },
        'j': function () {
            var y = new Date(_date.getFullYear(), 0, 1);
            var day = Math.ceil((_date.getTime() - y.getTime()) / (1000 * 60 * 60 * 24));
            return pad(day, null, 3);
        },
        'k': function () {
            return pad(_date.getHours(), _padding == null ? ' ' : _padding);
        },
        'L': function () {
            return pad(Math.floor(_date.getTime() % 1000), null, 3);
        },
        'l': function () {
            return pad(hours12(_date), _padding == null ? ' ' : _padding);
        },
        'M': function () {
            return pad(_date.getMinutes(), _padding);
        },
        'm': function () {
            return pad(_date.getMonth() + 1, _padding);
        },
        'n': function () {
            return '\n';
        },
        'o': function () {
            return String(_date.getDate()) + ordinal(_date.getDate());
        },
        'P': function () {
            return _date.getHours() < 12 ? _locale.am : _locale.pm;
        },
        'p': function () {
            return _date.getHours() < 12 ? _locale.AM : _locale.PM;
        },
        'R': function () {
            return _strftime(_locale.formats.R || '%H:%M', _date, _locale);
        },
        'r': function () {
            return _strftime(_locale.formats.r || '%I:%M:%S %p', _date, _locale);
        },
        'S': function () {
            return pad(_date.getSeconds(), _padding);
        },
        's': function () {
            return Math.floor(_date.getTime() / 1000);
        },
        'T': function () {
            return _strftime(_locale.formats.T || '%H:%M:%S', _date, _locale);
        },
        't': function () {
            return '\t';
        },
        'U': function () {
            return pad(weekNumber(_date, 'sunday'), _padding);
        },
        'u': function () {
            var day = _date.getDay();
            return day === 0 ? 7 : day;
        },
        'v': function () {
            return _strftime(_locale.formats.v || '%e-%b-%Y', _date, _locale);
        },
        'W': function () {
            return pad(weekNumber(_date, 'monday'), _padding);
        },
        'w': function () {
            return _date.getDay();
        },
        'Y': function () {
            return _date.getFullYear();
        },
        'y': function () {
            return String(_date.getFullYear()).slice(-2);
        },
        'Z': function () {
            if (_options.utc) {
                return 'GMT';
            } else {
                var tzString = _date.toString().match(/\((\w+)\)/);
                return tzString && tzString[1] || '';
            }
        },
        'z': function () {
            if (_options.utc) {
                return '+0000';
            } else {
                var off = typeof _timeZone === 'number' ? _timeZone : -_date.getTimezoneOffset();
                return (off < 0 ? '-' : '+') + pad(Math.abs(off / 60)) + pad(off % 60);
            }
        }
    };

    function processing(_, p, c) {
        var _padding;

        // Most of the specifiers supported by C's strftime, and some from Ruby.
        // Some other syntax extensions from Ruby are supported: %-, %_, and %0
        // to pad with nothing, space, or zero (respectively).
        if (p) {
            switch (p) {
                // omit padding
                case '-':
                    _padding = '';
                    break;

                // pad with space
                case '_':
                    _padding = ' ';
                    break;

                // pad with zero
                case '0':
                    _padding = '0';
                    break;

                // unrecognized, return the format
                default:
                    return _;
            }
        }

        return mask[c] ? mask[c]() : c;
    }

    function quacksLikeDate(x) {
        var index = RequiredDateMethods.length;

        while (index--) {
            if (typeof x[RequiredDateMethods[index]] !== 'function') {
                return false;
            }
        }

        return true;
    }

    function dateToUTC(d) {
        return new Date(d.getTime() + (d.getTimezoneOffset() || 0) * 60000);
    }

    // Default padding is '0' and default length is 2, both are optional.
    function pad(n, padding, length) {
        var _padding = padding == null ? '0' : padding;
        var _n = String(n);
        var _length = length || 2;

        // padding may be an empty string, don't loop forever if it is
        if (_padding) {
            while (_n.length < _length) {
                _n = _padding + _n;
            }
        }

        return _n;
    }

    function hours12(d) {
        var hour = d.getHours();

        if (hour === 0) {
            hour = 12;
        } else if (hour > 12) {
            hour -= 12;
        }

        return hour;
    }

    // Get the ordinal suffix for a number: st, nd, rd, or th
    function ordinal(n) {
        var i = n % 10;
        var ii = n % 100;

        if ((ii >= 11 && ii <= 13) || i === 0 || i >= 4) {
            return 'th';
        }

        switch (i) {
            case 1:
                return 'st';
            case 2:
                return 'nd';
            case 3:
                return 'rd';
        }
    }

    // firstWeekday: 'sunday' or 'monday', default is 'sunday'
    // Pilfered & ported from Ruby's strftime implementation.
    function weekNumber(d, firstWeekday) {
        var firstDayOfYear = new Date(d.getFullYear(), 0, 1);
        // This works by shifting the weekday back by one day if we
        // are treating Monday as the first day of the week.
        var wDay = d.getDay();
        var yDay = (d - firstDayOfYear) / 86400000;

        if (firstWeekday === 'monday') {
            if (wDay === 0) {
                // Sunday
                wDay = 6;
            } else {
                wDay--;
            }
        }

        return Math.floor((yDay + 7 - wDay) / 7);
    }

    function strftime(fmt, d, locale) {
        return _strftime(fmt, d, locale);
    }

    namespace.strftime = strftime;

    namespace.strftimeTZ = strftime.strftimeTZ = function strfTimeTZ(fmt, d, locale, timezone) {
        var _locale = locale;
        var _timezone = timezone;

        if ((typeof locale === 'number' || typeof locale === 'string') && timezone == null) {
            _timezone = locale;
            _locale = undefined;
        }

        return _strftime(fmt, d, _locale, {
            timezone: _timezone
        });
    };

    namespace.strftimeUTC = strftime.strftimeUTC = function strftimeUTC(fmt, d, locale) {
        return _strftime(fmt, d, locale, {
            utc: true
        });
    };

    namespace.localizedStrftime = strftime.localizedStrftime = function localizedStrftime(locale) {
        return function (fmt, d, options) {
            return _strftime(fmt, d, locale, options);
        };
    };

}());
