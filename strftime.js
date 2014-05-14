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
    // Where to export the API
    var namespace;
    var toString = Object.prototype.toString;

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

    // d, locale, and options are optional, but you can't leave
    // holes in the argument list. If you pass options you have to pass
    // in all the preceding args as well.
    //
    // options:
    //   - locale   [object] an object with the same structure as DefaultLocale
    //   - timezone [number] timezone offset in minutes from GMT
    function _strftime(format, date, locale, options) {
        var matches;
        var _options = options || {};
        var _locale = locale;
        var _date = date;
        var timestamp;
        var index = 0;
        var result = '';
        var regExp = /%([-_0]?)(.)/g;

        // date and locale are optional so check if date is really the locale
        if (_date && !isDate(_date)) {
            _locale = _date;
            _date = undefined;
        }

        _date = _date || new Date();
        timestamp = _date.getTime();
        _locale = _locale || DefaultLocale;
        _locale.formats = _locale.formats || {};

        _date = fixTimeZone(_date, _options);

        while (matches = regExp.exec(format)) {
            result += format.substring(index, matches.index) + processing(matches, _date, _locale, timestamp, _options);
            index = matches.index + matches[0].length;
        }

        return result;
    }

    var mask = {
        'A': function (padding, date, locale) {
            return locale.days[date.getDay()];
        },
        'a': function (padding, date, locale) {
            return locale.shortDays[date.getDay()];
        },
        'B': function (padding, date, locale) {
            return locale.months[date.getMonth()];
        },
        'b': function (padding, date, locale) {
            return locale.shortMonths[date.getMonth()];
        },
        'C': function (padding, date) {
            return pad(Math.floor(date.getFullYear() / 100), padding);
        },
        'D': function (padding, date, locale) {
            return _strftime(locale.formats.D || '%m/%d/%y', date, locale);
        },
        'd': function (padding, date) {
            return pad(date.getDate(), padding);
        },
        'e': function (padding, date) {
            return date.getDate();
        },
        'F': function (padding, date, locale) {
            return _strftime(locale.formats.F || '%Y-%m-%d', date, locale);
        },
        'H': function (padding, date) {
            return pad(date.getHours(), padding);
        },
        'h': function (padding, date, locale) {
            return locale.shortMonths[date.getMonth()];
        },
        'I': function (padding, date) {
            return pad(hours12(date), padding);
        },
        'j': function (padding, date) {
            var y = new Date(date.getFullYear(), 0, 1);
            var day = Math.ceil((date.getTime() - y.getTime()) / (1000 * 60 * 60 * 24));
            return pad(day, null, 3);
        },
        'k': function (padding, date) {
            return pad(date.getHours(), padding == null ? ' ' : padding);
        },
        'L': function (padding, date, locale, timestamp) {
            return pad(Math.floor(timestamp % 1000), null, 3);
        },
        'l': function (padding, date) {
            return pad(hours12(date), padding == null ? ' ' : padding);
        },
        'M': function (padding, date) {
            return pad(date.getMinutes(), padding);
        },
        'm': function (padding, date) {
            return pad(date.getMonth() + 1, padding);
        },
        'n': function () {
            return '\n';
        },
        'o': function (padding, date) {
            var _date = date.getDate();
            return String(_date) + ordinal(_date);
        },
        'P': function (padding, date, locale) {
            return date.getHours() < 12 ? locale.am : locale.pm;
        },
        'p': function (padding, date, locale) {
            return date.getHours() < 12 ? locale.AM : locale.PM;
        },
        'R': function (padding, date, locale) {
            return _strftime(locale.formats.R || '%H:%M', date, locale);
        },
        'r': function (padding, date, locale) {
            return _strftime(locale.formats.r || '%I:%M:%S %p', date, locale);
        },
        'S': function (padding, date) {
            return pad(date.getSeconds(), padding);
        },
        's': function (padding, date, locale, timestamp) {
            return Math.floor(timestamp / 1000);
        },
        'T': function (padding, date, locale) {
            return _strftime(locale.formats.T || '%H:%M:%S', date, locale);
        },
        't': function () {
            return '\t';
        },
        'U': function (padding, date) {
            return pad(weekNumber(date, 'sunday'), padding);
        },
        'u': function (padding, date) {
            var day = date.getDay();
            return day === 0 ? 7 : day;
        },
        'v': function (padding, date, locale) {
            return _strftime(locale.formats.v || '%e-%b-%Y', date, locale);
        },
        'W': function (padding, date) {
            return pad(weekNumber(date, 'monday'), padding);
        },
        'w': function (padding, date) {
            return date.getDay();
        },
        'Y': function (padding, date) {
            return date.getFullYear();
        },
        'y': function (padding, date) {
            return String(date.getFullYear()).slice(-2);
        },
        'Z': function (padding, date, locale, timestamp, options) {
            if (options.utc) {
                return 'GMT';
            } else {
                var tzString = date.toString().match(/\((\w+)\)/);
                return tzString && tzString[1] || '';
            }
        },
        'z': function (padding, date, locale, timestamp, options) {
            if (options.utc) {
                return '+0000';
            } else {
                var off = typeof options.timezone === 'number' ? options.timezone : -date.getTimezoneOffset();
                return (off < 0 ? '-' : '+') + pad(Math.abs(off / 60)) + pad(off % 60);
            }
        }
    };

    function processing(match, date, locale, timestamp, options) {
        var padding = match[1];
        var char = match[2];

        // Most of the specifiers supported by C's strftime, and some from Ruby.
        // Some other syntax extensions from Ruby are supported: %-, %_, and %0
        // to pad with nothing, space, or zero (respectively).
        if (padding) {
            switch (padding) {
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
                    break;

                // unrecognized, return the format
                default:
                    return match[0];
            }
        } else {
            padding = null;
        }

        return mask[char] ? mask[char](padding, date, locale, timestamp, options) : char;
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

    function isDate(date) {
        return toString.call(date) === '[object Date]';
    }

    // ISO 8601 format timezone string, [-+]HHMM
    // Convert to the number of minutes and it'll be applied to the date below.
    function fixTimeZone(date, options) {
        var _date = date;
        var timeZone = options.timezone;
        var tzType = typeof timeZone;

        if (options.utc || tzType === 'number' || tzType === 'string') {
            _date = dateToUTC(_date);
        }

        if (timeZone) {
            if (tzType === 'string') {
                var sign = timeZone[0] === '-' ? -1 : 1;
                var hours = parseInt(timeZone.slice(1, 3), 10);
                var mins = parseInt(timeZone.slice(3, 5), 10);

                timeZone = sign * (60 * hours) + mins;
            }

            _date = new Date(_date.getTime() + (timeZone * 60000));
            options.timezone = timeZone;
        }

        return _date;
    }

    namespace.strftime = strftime;

    namespace.strftimeTZ = strftime.strftimeTZ = function strfTimeTZ(fmt, d, locale, timeZone) {
        var _locale = locale;
        var _timeZone = timeZone;

        if ((typeof locale === 'number' || typeof locale === 'string') && timeZone == null) {
            _timeZone = locale;
            _locale = undefined;
        }

        return _strftime(fmt, d, _locale, {
            timezone: _timeZone
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
