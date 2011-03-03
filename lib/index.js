/// strftime
/// https://github.com/samsonjs/strftime
/// @_sjs
///
/// Copyright 2010 Sami Samhuri <sami.samhuri@gmail.com>
/// MIT License

;(function() {

    var strftime = (function() {
        var Weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday',
                        'Friday', 'Saturday'];

        var WeekdaysShort = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

        var Months = ['January', 'February', 'March', 'April', 'May', 'June', 'July',
                      'August', 'September', 'October', 'November', 'December'];

        var MonthsShort = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug',
                           'Sep', 'Oct', 'Nov', 'Dec'];

        var AM = 'AM',
            PM = 'PM';

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

        // loc is a function that maps the default English names to localized
        // names. In most cases it will just look up strings in a map but it's
        // a function for added flexibility.
        return function strftime(fmt, d, loc) {
            // d and loc are optional, check if d is really loc
            if (typeof d === 'function') {
                loc = d;
                d = new Date();
            } else if (!loc) {
                // no localization
                loc = function(x) { return x; };
            }
            d = d || new Date();

            // Most of the specifiers supported by C's strftime
            return fmt.replace(/%(.)/g, function(_, c) {
                switch (c) {
                    case 'A': return loc(Weekdays[d.getDay()]);
                    case 'a': return loc(WeekdaysShort[d.getDay()]);
                    case 'B': return loc(Months[d.getMonth()]);
                    case 'b': // fall through
                    case 'h': return loc(MonthsShort[d.getMonth()]);
                    case 'D': return strftime('%m/%d/%y', d, loc);
                    case 'd': return pad(d.getDate());
                    case 'e': return d.getDate();
                    case 'F': return strftime('%Y-%m-%d', d, loc);
                    case 'H': return pad(d.getHours());
                    case 'I': return pad(hours12(d));
                    case 'k': return pad(d.getHours(), ' ');
                    case 'l': return pad(hours12(d), ' ');
                    case 'M': return pad(d.getMinutes());
                    case 'm': return pad(d.getMonth() + 1);
                    case 'n': return '\n';
                    case 'p': return d.getHours() < 12 ? loc(AM) : loc(PM);
                    case 'R': return strftime('%H:%M', d, loc);
                    case 'r': return strftime('%I:%M:%S %p', d, loc);
                    case 'S': return pad(d.getSeconds());
                    case 's': return d.getTime();
                    case 'T': return strftime('%H:%M:%S', d, loc);
                    case 't': return '\t';
                    case 'u':
                        var day = d.getDay();
                        return day == 0 ? 7 : day; // 1 - 7, Monday is first day of the week
                    case 'v': return strftime('%e-%b-%Y', d, loc);
                    case 'w': return d.getDay(); // 0 - 6, Sunday is first day of the week
                    case 'Y': return d.getFullYear();
                    case 'y':
                        var year = d.getYear();
                        return year < 100 ? year : year - 100;
                    case 'Z':
                        var tz = d.toString().match(/\((\w+)\)/);
                        return tz && tz[1] || '';
                    case 'z':
                        var off = d.getTimezoneOffset();
                        return (off < 0 ? '-' : '+') + pad(off / 60) + pad(off % 60);
                    default: return c;
                }
            });
        };
    }());

    function getLocalizedStrftime(loc) {
        return function(fmt, d) {
            return strftime(fmt, d, loc);
        };
    }

    if (typeof exports !== 'undefined') {
        exports.strftime = strftime;
        exports.getLocalizedStrftime = getLocalizedStrftime;
    } else {
        (function(global) {
            global.strftime = strftime;
            global.getLocalizedStrftime = getLocalizedStrftime;
        }(this));
    }

}());