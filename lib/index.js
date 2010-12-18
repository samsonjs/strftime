/// strftime
/// http://github.com/samsonjs/strftime
/// @_sjs
///
/// Copyright 2010 Sami Samhuri <sami.samhuri@gmail.com>
/// MIT License

var strftime = (function() {
    var Weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday',
                    'Friday', 'Saturday'];

    var WeekdaysShort = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    var Months = ['January', 'February', 'March', 'April', 'May', 'June', 'July',
                  'August', 'September', 'October', 'November', 'December'];
    
    var MonthsShort = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug',
                       'Sep', 'Oct', 'Nov', 'Dec'];
    
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
    
    // Most of the specifiers supported by C's strftime
    function strftime(fmt, d) {
        d || (d = new Date());
        return fmt.replace(/%(.)/g, function(_, c) {
            switch (c) {
                case 'A': return Weekdays[d.getDay()];
                case 'a': return WeekdaysShort[d.getDay()];
                case 'B': return Months[d.getMonth()];
                case 'b': // fall through
                case 'h': return MonthsShort[d.getMonth()];
                case 'D': return strftime('%m/%d/%y', d);
                case 'd': return pad(d.getDate());
                case 'e': return d.getDate();
                case 'F': return strftime('%Y-%m-%d', d);
                case 'H': return pad(d.getHours());
                case 'I': return pad(hours12(d));
                case 'k': return pad(d.getHours(), ' ');
                case 'l': return pad(hours12(d), ' ');
                case 'M': return pad(d.getMinutes());
                case 'm': return pad(d.getMonth() + 1);
                case 'n': return '\n';
                case 'p': return d.getHours() < 12 ? 'AM' : 'PM';
                case 'R': return strftime('%H:%M', d);
                case 'r': return strftime('%I:%M:%S %p', d);
                case 'S': return pad(d.getSeconds());
                case 's': return d.getTime();
                case 'T': return strftime('%H:%M:%S', d);
                case 't': return '\t';
                case 'u':
                    var day = d.getDay();
                    return day == 0 ? 7 : day; // 1 - 7, Monday is first day of the week
                case 'v': return strftime('%e-%b-%Y', d);
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
    }
    return strftime;
}());

if (typeof exports !== 'undefined') exports.strftime = strftime;
else (function(global) { global.strftime = strftime }(this));
