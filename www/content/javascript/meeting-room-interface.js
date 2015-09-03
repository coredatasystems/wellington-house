var meeting_room_times = ["9:00 - 10:00",
                          "10:00 - 11:00",
                          "11:00 - 12:00",
                          "12:00 - 13:00",
                          "13:00 - 14:00",
                          "14:00 - 15:00",
                          "15:00 - 16:00",
                          "16:00 - 17:00"];

jQuery.fn.extend({
    advance_week: function () {
        this.data('curMonday').setDate(this.data('curMonday').getDate() + 7);
        this.get_meeting_week('new');
        this.data('booking_table').addClass('transitioning');
        window.setTimeout(function(table){
            $('.timeslot:not(.new)').remove();
            $('.wholeday.mod-btn:not(.new)').remove();
            $('.day-header:not(.new)').remove();
            $('.new').removeClass('new');
            table.removeClass('transitioning');
        }, 500, this.data('booking_table'));
    },
    get_meeting_week: function(class_addition) {
        class_addition = typeof class_addition !== 'undefined' ? class_addition : '';

        /* Print out formatted weekdays*/
        for (var d = 0; d < 5; d++) {
            var col_date = new Date(this.data('curMonday').getTime());
            col_date.setDate(col_date.getDate() + d);
            this.data('booking_header_row').append('<th class="day-header ' + class_addition + '">' + dayName(col_date) + ' ' + ordinal(col_date.getDate()) + '</th>');
            this.data('booking_wholeday_row').append($('<td class="wholeday mod-btn mod-available ' + class_addition + '"></td>'));

            for (var i=0; i < this.data('main_booking_rows').length; i++) {
                var booking_body_cell = $('<td class="timeslot ' + class_addition + '"></td>');
                this.data('main_booking_rows')[i].append(booking_body_cell);
            }

        }
    },
    meeting_room_init: function () {

        /* Create Booking Table, and header row: */
        this.data('booking_table', $('<table id="meeting-room-booking" class="table table-bordered"></table>'));
        var booking_header = $('<thead></thead>');

        this.data('booking_header_row', $('<tr></tr>'));
        this.data('booking_header_row').append('<th class="fixed-col">Time</th>');

        /* Append header to main table: */
        booking_header.append(this.data('booking_header_row'));
        this.data('booking_table').append(booking_header);

        /* Create table body: */
        var booking_body = $('<tbody></tbody>');

        /* Create book whole day row */
        this.data('booking_wholeday_row', $('<tr></tr>'));
        this.data('booking_wholeday_row').append($('<td class="wholeday fixed-col"></td>'));
        booking_body.append(this.data('booking_wholeday_row'));

        /* Append body to main table */
        this.data('booking_table').append(booking_body);

        /* Get the first monday of the week, or the next monday if it's the weekend */
            var date = new Date(),
                day = date.getDay(),
                diff = date.getDate() - day + (day == 6 ? 8 : 1); // If day is saturday, shift forward to next monday

        this.data('curMonday', new Date(date.setDate(diff)));

        /* Loop through all times and create a new row for each */
        this.data('main_booking_rows', []);
        for (var i=0; i < meeting_room_times.length; i++) {
            this.data('main_booking_rows')[i] = $('<tr><td class="fixed-col">' + meeting_room_times[i] + '</td></tr>');
            booking_body.append(this.data('main_booking_rows')[i]);
        }

        this.append(this.data('booking_table'));

        this.get_meeting_week();
    }
});

/* Useful Functions */
function ordinal(i) {
    var j = i % 10,
        k = i % 100;
    if (j == 1 && k != 11) {
        return i + "st";
    }
    if (j == 2 && k != 12) {
        return i + "nd";
    }
    if (j == 3 && k != 13) {
        return i + "rd";
    }
    return i + "th";
}
function dayName(date) {
    var daysOfWeek = new Array('Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday');
    return daysOfWeek[date.getDay()];
}