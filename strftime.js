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
    var _timestamp;

    function strftime(fmt, d, locale) {
        return _strftime(fmt, d, locale);
    }

    function strfTimeTZ(fmt, d, locale, timezone) {
        var _locale = locale;
        var _timezone = timezone;

        if ((typeof locale === 'number' || typeof locale === 'string') && timezone == null) {
            _timezone = locale;
            _locale = undefined;
        }

        return _strftime(fmt, d, _locale, {
            timezone: _timezone
        });
    }

    function strftimeUTC(fmt, d, locale) {
        return _strftime(fmt, d, locale, {
            utc: true
        });
    }

    function localizedStrftime(locale) {
        return function (fmt, d, options) {
            return _strftime(fmt, d, locale, options);
        };
    }

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

        // Hang on to this Unix timestamp because we might mess with it directly below.
        _timestamp = _date.getTime();

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

        // Most of the specifiers supported by C's strftime, and some from Ruby.
        // Some other syntax extensions from Ruby are supported: %-, %_, and %0
        // to pad with nothing, space, or zero (respectively).
        /*var part;
         var regExp = /%([-_0]?.)/g;*/

        //        while (part = regExp.exec(format)) {
        //            var padding;
        //            var _c = part[1];
        //
        //            if (_c.length === 2) {
        //                switch (_c[0]) {
        //                    // omit padding
        //                    case '-':
        //                        padding = '';
        //                        break;
        //
        //                    // pad with space
        //                    case '_':
        //                        padding = ' ';
        //                        break;
        //
        //                    // pad with zero
        //                    case '0':
        //                        padding = '0';
        //                        break;
        //
        //                    // unrecognized, return the format
        //                    default:
        //                        return part[0];
        //                }
        //
        //                _c = _c[1];
        //            }
        //
        //            switch (_c) {
        //                // Examples for new Date(0) in GMT
        //
        //                // 'Thursday'
        //                case 'A':
        //                    return _locale.days[_d.getDay()];
        //
        //                // 'Thu'
        //                case 'a':
        //                    return _locale.shortDays[_d.getDay()];
        //
        //                // 'January'
        //                case 'B':
        //                    return _locale.months[_d.getMonth()];
        //
        //                // 'Jan'
        //                case 'b':
        //                    return _locale.shortMonths[_d.getMonth()];
        //
        //                // '19'
        //                case 'C':
        //                    return pad(Math.floor(_d.getFullYear() / 100), padding);
        //
        //                // '01/01/70'
        //                case 'D':
        //                    return _strftime(_locale.formats.D || '%m/%d/%y', _d, _locale);
        //
        //                // '01'
        //                case 'd':
        //                    return pad(_d.getDate(), padding);
        //
        //                // '01'
        //                case 'e':
        //                    return _d.getDate();
        //
        //                // '1970-01-01'
        //                case 'F':
        //                    return _strftime(_locale.formats.F || '%Y-%m-%d', _d, _locale);
        //
        //                // '00'
        //                case 'H':
        //                    return pad(_d.getHours(), padding);
        //
        //                // 'Jan'
        //                case 'h':
        //                    return _locale.shortMonths[_d.getMonth()];
        //
        //                // '12'
        //                case 'I':
        //                    return pad(hours12(_d), padding);
        //
        //                // '000'
        //                case 'j':
        //                    var y = new Date(_d.getFullYear(), 0, 1);
        //                    var day = Math.ceil((_d.getTime() - y.getTime()) / (1000 * 60 * 60 * 24));
        //                    return pad(day, null, 3);
        //
        //                // ' 0'
        //                case 'k':
        //                    return pad(_d.getHours(), padding == null ? ' ' : padding);
        //
        //                // '000'
        //                case 'L':
        //                    return pad(Math.floor(timestamp % 1000), null, 3);
        //
        //                // '12'
        //                case 'l':
        //                    return pad(hours12(_d), padding == null ? ' ' : padding);
        //
        //                // '00'
        //                case 'M':
        //                    return pad(_d.getMinutes(), padding);
        //
        //                // '01'
        //                case 'm':
        //                    return pad(_d.getMonth() + 1, padding);
        //
        //                // '\n'
        //                case 'n':
        //                    return '\n';
        //
        //                // '1st'
        //                case 'o':
        //                    return String(_d.getDate()) + ordinal(_d.getDate());
        //
        //                // 'am'
        //                case 'P':
        //                    return _d.getHours() < 12 ? _locale.am : _locale.pm;
        //
        //                // 'AM'
        //                case 'p':
        //                    return _d.getHours() < 12 ? _locale.AM : _locale.PM;
        //
        //                // '00:00'
        //                case 'R':
        //                    return _strftime(_locale.formats.R || '%H:%M', _d, _locale);
        //
        //                // '12:00:00 AM'
        //                case 'r':
        //                    return _strftime(_locale.formats.r || '%I:%M:%S %p', _d, _locale);
        //
        //                // '00'
        //                case 'S':
        //                    return pad(_d.getSeconds(), padding);
        //
        //                // '0'
        //                case 's':
        //                    return Math.floor(timestamp / 1000);
        //
        //                // '00:00:00'
        //                case 'T':
        //                    return _strftime(_locale.formats.T || '%H:%M:%S', _d, _locale);
        //
        //                // '\t'
        //                case 't':
        //                    return '\t';
        //
        //                // '00'
        //                case 'U':
        //                    return pad(weekNumber(_d, 'sunday'), padding);
        //
        //                // '4'
        //                case 'u':
        //                    var day = _d.getDay();
        //                    return day === 0 ? 7 : day; // 1 - 7, Monday is first day of the week
        //
        //                // '1-Jan-1970'
        //                case 'v':
        //                    return _strftime(_locale.formats.v || '%e-%b-%Y', _d, _locale);
        //
        //                // '00'
        //                case 'W':
        //                    return pad(weekNumber(_d, 'monday'), padding);
        //
        //                // '4'
        //                case 'w':
        //                    return _d.getDay(); // 0 - 6, Sunday is first day of the week
        //
        //                // '1970'
        //                case 'Y':
        //                    return _d.getFullYear();
        //
        //                // '70'
        //                case 'y':
        //                    return String(_d.getFullYear()).slice(-2);
        //
        //                // 'GMT'
        //                case 'Z':
        //                    if (_options.utc) {
        //                        return 'GMT';
        //                    } else {
        //                        var tzString = _d.toString().match(/\((\w+)\)/);
        //                        return tzString && tzString[1] || '';
        //                    }
        //
        //                // '+0000'
        //                case 'z':
        //                    if (_options.utc) {
        //                        return '+0000';
        //                    } else {
        //                        var off = typeof tz === 'number' ? tz : -_d.getTimezoneOffset();
        //                        return (off < 0 ? '-' : '+') + pad(Math.abs(off / 60)) + pad(off % 60);
        //                    }
        //
        //                default:
        //                    return _c;
        //            }
        //        }

        return format.replace(/%([-_0]?.)/g, processing);
    }

    function processing(_, c) {
        var padding;
        var _c = c;
        var day;

        if (_c.length === 2) {
            switch (_c[0]) {
                // omit padding
                case '-':
                    padding = '';
                    break;

                // pad with space
                case '_':
                    padding = ' ';
                    break;

                // pad with zero
                case '0':
                    padding = '0';
                    break;

                // unrecognized, return the format
                default:
                    return _;
            }

            _c = _c[1];
        }

        if (_c === 'A') {
            return _locale.days[_date.getDay()];
        } else if (_c === 'a') {
            return _locale.shortDays[_date.getDay()];
        } else if (_c === 'B') {
            return _locale.months[_date.getMonth()];
        } else if (_c === 'b') {
            return _locale.shortMonths[_date.getMonth()];
        } else if (_c === 'C') {
            return pad(Math.floor(_date.getFullYear() / 100), padding);
        } else if (_c === 'D') {
            return _strftime(_locale.formats.D || '%m/%d/%y', _date, _locale);
        } else if (_c === 'd') {
            return pad(_date.getDate(), padding);
        } else if (_c === 'e') {
            return _date.getDate();
        } else if (_c === 'F') {
            return _strftime(_locale.formats.F || '%Y-%m-%d', _date, _locale);
        } else if (_c === 'H') {
            return pad(_date.getHours(), padding);
        } else if (_c === 'h') {
            return _locale.shortMonths[_date.getMonth()];
        } else if (_c === 'I') {
            return pad(hours12(_date), padding);
        } else if (_c === 'j') {
            var y = new Date(_date.getFullYear(), 0, 1);
            day = Math.ceil((_date.getTime() - y.getTime()) / (1000 * 60 * 60 * 24));
            return pad(day, null, 3);
        } else if (_c === 'k') {
            return pad(_date.getHours(), padding == null ? ' ' : padding);
        } else if (_c === 'L') {
            return pad(Math.floor(_timestamp % 1000), null, 3);
        } else if (_c === 'l') {
            return pad(hours12(_date), padding == null ? ' ' : padding);
        } else if (_c === 'M') {
            return pad(_date.getMinutes(), padding);
        } else if (_c === 'm') {
            return pad(_date.getMonth() + 1, padding);
        } else if (_c === 'n') {
            return '\n';
        } else if (_c === 'o') {
            return String(_date.getDate()) + ordinal(_date.getDate());
        } else if (_c === 'P') {
            return _date.getHours() < 12 ? _locale.am : _locale.pm;
        } else if (_c === 'p') {
            return _date.getHours() < 12 ? _locale.AM : _locale.PM;
        } else if (_c === 'R') {
            return _strftime(_locale.formats.R || '%H:%M', _date, _locale);
        } else if (_c === 'r') {
            return _strftime(_locale.formats.r || '%I:%M:%S %p', _date, _locale);
        } else if (_c === 'S') {
            return pad(_date.getSeconds(), padding);
        } else if (_c === 's') {
            return Math.floor(timestamp / 1000);
        } else if (_c === 'T') {
            return _strftime(_locale.formats.T || '%H:%M:%S', _date, _locale);
        } else if (_c === 't') {
            return '\t';
        } else if (_c === 'U') {
            return pad(weekNumber(_date, 'sunday'), padding);
        } else if (_c === 'u') {
            day = _date.getDay();
            return day === 0 ? 7 : day;
        } else if (_c === 'v') {
            return _strftime(_locale.formats.v || '%e-%b-%Y', _date, _locale);
        } else if (_c === 'W') {
            return pad(weekNumber(_date, 'monday'), padding);
        } else if (_c === 'w') {
            return _date.getDay();
        } else if (_c === 'Y') {
            return _date.getFullYear();
        } else if (_c === 'y') {
            return String(_date.getFullYear()).slice(-2);
        } else if (_c === 'Z') {
            if (_options.utc) {
                return 'GMT';
            } else {
                var tzString = _date.toString().match(/\((\w+)\)/);
                return tzString && tzString[1] || '';
            }
        } else if (_c === 'z') {
            if (_options.utc) {
                return '+0000';
            } else {
                var off = typeof _timeZone === 'number' ? _timeZone : -_date.getTimezoneOffset();
                return (off < 0 ? '-' : '+') + pad(Math.abs(off / 60)) + pad(off % 60);
            }
        } else {
            return _c;
        }
    }

    // TODO: Did not inline quacksLikeDate called from _strftime (target requires context change).
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
        new Date(d.getTime() + (d.getTimezoneOffset() || 0) * 60000);
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

    namespace.strftime = strftime;
    namespace.strftimeTZ = strftime.strftimeTZ = strfTimeTZ;
    namespace.strftimeUTC = strftime.strftimeUTC = strftimeUTC;
    namespace.localizedStrftime = strftime.localizedStrftime = localizedStrftime;

}());
