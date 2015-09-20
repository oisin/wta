// Javascript file for SHD Customer facing page, git repository

/* Datestamp YYYYMMDD */
function datestamp(unixtime) {
    var date = new Date();

    date.setTime(unixtime * 1000);

    var year  = date.getFullYear();
    var month = date.getMonth() + 1;
    var day   = date.getDate();
    return("" + year + ((month<10) ? "0" + month : month) + ((day<10) ? "0" + day : day));
}

function get(id) {
    if (typeof id == "string") {
        return(document.getElementById(id));
    } else {
        return(id);
    }
}

function show(id) {
    if (e = get(id)) {
        e.style.display = '';
    }
}

function hide(id) {
    if (e = get(id)) {
        e.style.display = 'none';
    }
}

function toggle(id) {
    target = document.getElementById(id);
    if (!target) {
        return;
    }

    if (target.style.display == 'none') {
        show(target)
    } else {
        hide(target);
    }
}

function toggleCurrent(obj, id) {
    target = document.getElementById(id);

    if (!target) {
        return;
    }

    if (target.style.display == 'none') {
        target.style.display = '';
        obj.innerHTML = 'less <img src="/images/less.gif" />';
    } else {
        target.style.display = 'none';
        obj.innerHTML = 'more <img src="/images/more.gif" />';
    }
}

var cols = 0;
var day = 86400;
var cursor = new Array();
var today = 0;
var serverTimeZoneOffset = 0;
var localTimeZoneOffset = (new Date()).getTimezoneOffset();
var lock = new Array();
var services = new Array();
var locales = new Array();
var localeRows = new Array();
var curTable = new Array();
var newTable;
// the value for realm must be set in the html file using this script, valid values are Classic, BJS, DCA;
var realm;

var noOfDaysInWeek = 7;
// The number of days that we are including to show the svc history
// Since we are showing status by weeks, the number of days is kept as multiples of 7.
var noOfDaysShownInHistory = 53*noOfDaysInWeek; // Showing history for 53 weeks (For the biz requirement of 365 days)

// time is in seconds
// the TimeZoneOffsets are in minutes, 
// serverTimeZoneOffset comes from Perl and has sign positive East of GMT
// localTimeZoneOffset comes from Javascript and has sign positive West of GMT
function adjustTime(time) {
    return time + 60 * (serverTimeZoneOffset + localTimeZoneOffset);
}

var months = new Array(
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec'
);

/* Dates are formatted depending on the realm */
function showDate(locale, date, left) {
    lock[locale] = true;

    document.getElementById(locale + '_nextDate_img').src = '/images/arrows-grey-left.gif';
    document.getElementById(locale + '_prevDate_img').src = '/images/arrows-grey-right.gif';

    if (!curTable[locale])
        curTable[locale] = document.getElementById(locale + 'statusHistoryContent');

    curTable[locale].parentNode.style.overflow = 'hidden';

    newTable = document.createElement('table');
    newTable.className = curTable[locale].className;
    var b = document.createElement('tbody');

    /* Header row */
    var r = document.createElement('tr');
    var dates = new Array(cols);
    for (var j=0;j<cols;j++) {
        var timestamp = adjustTime(date - (j*day));
        dates[j] = new Date();
        dates[j].setTime(timestamp*1000);

        var h = document.createElement('th');
        // format the dates based on the realm, Chinese format for BJS
        if (realm == 'BJS') { 
            h.innerHTML = (dates[j].getMonth()+1).zeroPad(2) + "-" + dates[j].getDate().zeroPad(2);
        } else {
            h.innerHTML = months[dates[j].getMonth()] + " " + dates[j].getDate();
        }
        r.appendChild(h);
    }
    b.appendChild(r);

    /* Body row */
    var rows = localeRows[locale];
    for (var i=0;i<rows;i++) {
        r = document.createElement('tr');
        for (var j=0;j<cols;j++) {
            var stamp = datestamp(dates[j].getTime() / 1000);
            var index = services[locale][i] + "_" + stamp;
            if ("20080413" >= stamp) { /* We don't have any info before this date. */
                var c = document.createElement('td');
                c.innerHTML = '<img src="/images/status-disabled.gif" />';
                r.appendChild(c);
            } else if (eventData.archive[index]) {
                var event = eventData.archive[index];
                var td = document.createElement('td');
                var s1 = document.createElement('span');
                var im = document.createElement('img');
                var s2 = document.createElement('span');
                var dv = document.createElement('div');

                /* Status popup */
                var dvp = document.createElement('div');
                var dvi = document.createElement('div');
                var dvs = document.createElement('div');
                var dvd = document.createElement('div');
                var im1 = document.createElement('img');

                /* Set table properties/contents. */
                dvp.className = "whitebg pad4";
                dvi.className = "pad4 floatLeft";
                dvs.className = "pad4 bold yellowfg floatLeft";
                dvd.className = "pad4 clear";
                im1.src = "/images/status" + event.status + ".gif";
                dvs.innerHTML = event.summary;
                dvd.innerHTML = event.description;

                /* Put elements in the right spot. */
                dvi.appendChild(im1);
                dvp.appendChild(dvi);
                dvp.appendChild(dvs);
                dvp.appendChild(dvd);
                dv.appendChild(dvp);

                im.src = '/images/status' + event.status + '.gif';
                s1.id = "imagecontainer_archive_" + locale + "_" + index;
                dv.id = "archive_" + locale + "_" + index;
                s2.style.position = 'relative';
                dv.style.display = 'none';
                dv.className = 'greybg bordered-dark pad8 archivePopup';
                s1.appendChild(im);
                s2.appendChild(dv);
                td.appendChild(s1);
                td.appendChild(s2);
                r.appendChild(td);

                setupHistoryEventHandler("archive_" + locale + "_" + index);
            } else {
                var c = document.createElement('td');
                    c.innerHTML = '<img src="/images/status0.gif" />';
                r.appendChild(c);
            }
        }
        b.appendChild(r);
    }
    newTable.appendChild(b);

    var doComplete = function(e) {
        element = this.getEl();
        par = element.parentNode;
        par.removeChild(element);
        par.style.overflow = 'visible';
        lock[locale] = false;
    }

    if (left) {
        newTable.style.left = '470px';
        var animCur = new YAHOO.util.Anim(curTable[locale], { left: { from: 0, to: -470 }}, 0.5, YAHOO.util.Easing.easeBoth);
        var animNew = new YAHOO.util.Anim(newTable, { left: { from: 470, to: 0 }}, 0.5, YAHOO.util.Easing.easeBoth);
    } else {
        newTable.style.left = '-470px';
        var animCur = new YAHOO.util.Anim(curTable[locale], { left: { from: 0, to: 470 }}, 0.5, YAHOO.util.Easing.easeBoth);
        var animNew = new YAHOO.util.Anim(newTable, { left: { from: -470, to: 0 }}, 0.5, YAHOO.util.Easing.easeBoth);
    }
    newTable.style.position = 'absolute';
    newTable.style.visibility = 'hidden';
    curTable[locale].parentNode.appendChild(newTable);
    animCur.onComplete.subscribe( doComplete );
    newTable.style.visibility = 'visible';
    animCur.animate();
    animNew.animate();

    curTable[locale] = newTable;
    newTable = null;
    
    if (cursor[locale] <= day) {
        document.getElementById(locale + '_nextDate_img').src = '/images/arrows-grey-left.gif';
    } else {
        document.getElementById(locale + '_nextDate_img').src = '/images/arrows-red-left.gif';
    }
    
    // We are showing historical data in terms of weeks(7 days at a time).
    // So, except for the last week, the right arrow(indicating prev date) should
    // be enabled for all the other weeks
    if (cursor[locale] >= (day * (noOfDaysShownInHistory-noOfDaysInWeek))) {
        document.getElementById(locale + '_prevDate_img').src = '/images/arrows-grey-right.gif';
    } else {
        document.getElementById(locale + '_prevDate_img').src = '/images/arrows-red-right.gif';
    }
}

function nextDate(locale) {
    if (!cursor[locale]) cursor[locale] = day;

    if (cursor[locale] <= day) return;
    if (lock[locale] == true) return;

    cursor[locale] -= day * 7;
    showDate(locale, today - cursor[locale], false);
}

function prevDate(locale) {
    if (!cursor[locale]) cursor[locale] = day;

    // If it's the last week, then no need to change the date, as no 
    // prev date is shown after this. In that case, just return
    if (cursor[locale] >= (day * (noOfDaysShownInHistory-noOfDaysInWeek))) return;
    if (lock[locale] == true) return;

    cursor[locale] += day * 7;
    showDate(locale, today - cursor[locale], true);
}

// Pad a number with leading zeros
Number.prototype.zeroPad = Number.prototype.zeroPad || 
    function(digits){
        var num = this, addLength = (digits - String(num).length);
        var str = addLength > 0 ? new Array(addLength + 1).join('0') + num : num;
        return str; 
    };

/* Pre-load data immediately */
var eventData = {
    fetch:
    function() {
        YAHOO.util.Connect.asyncRequest('GET', '/data.json', { success: this.onSuccess, scope: this }, null);
    },
    onSuccess:
    function(obj) {
        var data = YAHOO.lang.JSON.parse(obj.responseText);
        this.current = data.current;
        this.archive = data.archive;

        /* Index the archive array, add objects as properties to the array. */
        for (var i=0;i<this.archive.length;i++) {
            var date = datestamp(adjustTime(parseInt(this.archive[i].date)));
            var index = this.archive[i].service + "_" + date;
            this.archive[index] = this.archive[i];
        }
    },
    current: null,
    archive: null
}

var onImageClick = function(event, id) {
    event.cancelBubble = true;
    if (e = document.getElementById(id)) {
        if (e.clicked) {
            hide(id);
            e.clicked = false;
        } else {
            show(id);
            e.clicked = true;
        }
    }
}

var onImageMouseOver = function(event, id) {
    if (!document.getElementById(id).clicked) {
        event.cancelBubble = true;
        show(id);
    }
}

var onImageMouseOut = function(event, id) {
    if (!document.getElementById(id).clicked) {
        event.cancelBubble = true;
        hide(id);
    }
}

var onDocumentClick = function(event, id) {
    if (e = get(id)) {
        hide(e);
        e.clicked = false;
    }
}

function setupHistoryEventHandler(id) {
    YAHOO.util.Event.addListener('imagecontainer_' + id, 'click',     onImageClick,     id);
    YAHOO.util.Event.addListener('imagecontainer_' + id, 'mouseover', onImageMouseOver, id);
    YAHOO.util.Event.addListener('imagecontainer_' + id, 'mouseout',  onImageMouseOut,  id);
    YAHOO.util.Event.addListener(id,                     'mouseover', onImageMouseOver, id);
    YAHOO.util.Event.addListener(id,                     'mouseout',  onImageMouseOut,  id);
    YAHOO.util.Event.addListener(document,               'click',     onDocumentClick,  id);
}
