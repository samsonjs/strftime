/// strftime
/// https://github.com/samsonjs/strftime
/// @_sjs
///
/// Copyright 2010 - 2011 Sami Samhuri <sami.samhuri@gmail.com>
/// MIT License

;(function() {

    var DefaultLocale = {
        days: [ 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday' ],
        shortDays: [ 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat' ],

        months: [ 'January', 'February', 'March', 'April', 'May', 'June', 'July',
                  'August', 'September', 'October', 'November', 'December' ],

        shortMonths: [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug',
                       'Sep', 'Oct', 'Nov', 'Dec' ],
        AM: 'AM',
        PM: 'PM'
    }

    function pad(n, padding) {
        padding = padding || '0';
        return n < 10 ? (padding + n) : n;
    }

    function hours12(d) {
        var hour = d.getHours();
        if (hour == 0) hour = 12;
        else if (hour > 12) hour -= 12;
        return hour;
    }

    // locale is an object with the same structure as DefaultLocale
    function _strftime(fmt, d, locale, _useUTC) {
        // d and locale are optional so check if d is really the locale
        if (d && !(d instanceof Date)) {
            locale = d;
            d = undefined;
        }
        d = d || new Date();
        locale = locale || DefaultLocale;
        locale.formats = locale.formats || {}

        if (_useUTC) {
            d = new Date(d.getTime() + ((d.getTimezoneOffset() || 0) * 60000));
        }

        // Most of the specifiers supported by C's strftime
        return fmt.replace(/%(.)/g, function(_, c) {
            switch (c) {
                case 'A': return locale.days[d.getDay()];
                case 'a': return locale.shortDays[d.getDay()];
                case 'B': return locale.months[d.getMonth()];
                case 'b': // fall through
                case 'h': return locale.shortMonths[d.getMonth()];
                case 'D': return strftime(locale.formats.D || '%m/%d/%y', d, locale);
                case 'd': return pad(d.getDate());
                case 'e': return d.getDate();
                case 'F': return strftime(locale.formats.F || '%Y-%m-%d', d, locale);
                case 'H': return pad(d.getHours());
                case 'I': return pad(hours12(d));
                case 'k': return pad(d.getHours(), ' ');
                case 'l': return pad(hours12(d), ' ');
                case 'M': return pad(d.getMinutes());
                case 'm': return pad(d.getMonth() + 1);
                case 'n': return '\n';
                case 'p': return d.getHours() < 12 ? locale.AM : locale.PM;
                case 'R': return strftime(locale.formats.R || '%H:%M', d, locale);
                case 'r': return strftime(locale.formats.r || '%I:%M:%S %p', d, locale);
                case 'S': return pad(d.getSeconds());
                case 's': return d.getTime();
                case 'T': return strftime(locale.formats.T || '%H:%M:%S', d, locale);
                case 't': return '\t';
                case 'u':
                    var day = d.getDay();
                    return day == 0 ? 7 : day; // 1 - 7, Monday is first day of the week
                case 'v': return strftime(locale.formats.v || '%e-%b-%Y', d, locale);
                case 'w': return d.getDay(); // 0 - 6, Sunday is first day of the week
                case 'Y': return d.getFullYear();
                case 'y':
                    var y = String(d.getFullYear());
                    return y.slice(y.length - 2);
                case 'Z':
                    if (_useUTC) {
                        return "GMT";
                    }
                    else {
                        var tz = d.toString().match(/\((\w+)\)/);
                        return tz && tz[1] || '';
                    }
                case 'z':
                    if (_useUTC) {
                        return "+0000";
                    }
                    else {
                        var off = d.getTimezoneOffset();
                        return (off < 0 ? '-' : '+') + pad(off / 60) + pad(off % 60);
                    }
                default: return c;
            }
        });
    }

    function strftime(fmt, d, locale) {
        return _strftime(fmt, d, locale, false);
    }

    function strftimeUTC(fmt, d, locale) {
        return _strftime(fmt, d, locale, true);
    }

    function getLocalizedStrftime(locale) {
        return function(fmt, d) {
            return strftime(fmt, d, locale);
        };
    }

    if (typeof exports !== 'undefined') {
        exports.strftime = strftime;
        exports.strftimeUTC = strftimeUTC;
        exports.getLocalizedStrftime = getLocalizedStrftime;
    } else {
        (function(global) {
            global.strftime = strftime;
            global.strftimeUTC = strftimeUTC;
            global.getLocalizedStrftime = getLocalizedStrftime;
        }(this));
    }

}());