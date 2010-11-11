/// strftime
/// http://github.com/samsonjs/strftime
/// @_sjs
///
/// Copyright 2010 Sami Samhuri <sami.samhuri@gmail.com>
/// MIT License

var Weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday',
                'Friday', 'Saturday'];

var WeekdaysShort = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

var Months = ['January', 'February', 'March', 'April', 'May', 'June', 'July',
              'August', 'September', 'October', 'November', 'December'];

var MonthsShort = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug',
                   'Sep', 'Oct', 'Nov', 'Dec'];

if (typeof exports !== 'undefined') exports.strftime = strftime

// Most of the specifiers supported by C's strftime
function strftime(fmt, d) {
    var c,
        i,
        n = fmt.length,
        s = '',
        pad = function(n, padding) {
            padding = padding || '0';
            return n < 10 ? (padding + n) : n;
        };
    d || (d = new Date())
    for (i = 0; i < n; ++i) {
        c = fmt.charAt(i);
        if (c == '%') {
            i += 1;
            c = fmt.charAt(i);
            switch (c) {
                case 'A':
                    s += Weekdays[d.getDay()];
                    break;
                case 'a':
                    s += WeekdaysShort[d.getDay()];
                    break;
                case 'B':
                    s += Months[d.getMonth()];
                    break;
                case 'b':
                case 'h':
                    s += MonthsShort[d.getMonth()];
                    break;
                case 'D':
                    s += strftime(d, '%m/%d/%y');
                    break;
                case 'd':
                    var day = d.getDate();
                    s += pad(day);
                    break;
                case 'e':
                    s += d.getDate();
                    break;
                case 'F':
                    s += strftime(d, '%Y-%m-%d');
                    break;
                case 'H':
                    var hour = d.getHours();
                    s += pad(hour);
                    break;
                case 'I':
                    var hour = d.getHours();
                    if (hour == 0) hour = 12;
                    else if (hour > 12) hour -= 12;
                    s += pad(hour);
                    break;
                case 'k':
                    var hour = d.getHours();
                    s += pad(hour, ' ');
                    break;
                case 'l':
                    var hour = d.getHours();
                    if (hour == 0) hour = 12;
                    else if (hour > 12) hour -= 12;
                    s += pad(hour, ' ');
                    break;
                case 'M':
                    var min = d.getMinutes();
                    s += pad(min);
                    break;
                case 'm':
                    var month = d.getMonth() + 1;
                    s += pad(month);
                    break;
                case 'n':
                    s += '\n';
                    break;
                case 'p':
                    s += d.getHours() < 12 ? 'AM' : 'PM';
                    break;
                case 'R':
                    s += strftime(d, '%H:%M');
                    break;
                case 'r':
                    s += strftime(d, '%I:%M:%S %p');
                    break;
                case 'S':
                    s += pad(d.getSeconds());
                    break;
                case 's':
                    s += d.getTime();
                    break;
                case 'T':
                    s += strftime(d, '%H:%M:%S');
                    break;
                case 't':
                    s += '\t';
                    break;
                case 'u':
                    var day = d.getDay();
                    s += day == 0 ? 7 : day; // 1 - 7, Monday is first day of the week
                    break;
                case 'v':
                    s += strftime(d, '%e-%b-%Y');
                    break;
                case 'w':
                    s += d.getDay(); // 0 - 6, Sunday is first day of the week
                    break;
                case 'Y':
                    s += d.getFullYear();
                    break;
                case 'y':
                    var year = d.getYear();
                    s += year < 100 ? year : year - 100;
                    break;
                case 'Z':
                    var tz = d.toString().match(/\((\w+)\)/);
                    s += tz && tz[1] || '';
                    break;
                case 'z':
                    var off = d.getTimezoneOffset();
                    s += (off < 0 ? '-' : '+') + pad(off / 60) + pad(off % 60);
                    break;
                default:
                    s += c;
                    break;
            }
        } else {
            s += c;
        }
    }
    return s;
}
