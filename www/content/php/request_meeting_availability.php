<?php

    function validateDate($date)
    {
        $d = DateTime::createFromFormat('Y-m-d', $date);
        return $d && $d->format('Y-m-d') == $date;
    }

    $range = filter_input(INPUT_GET, "range", FILTER_SANITIZE_STRING);
    $date = filter_input(INPUT_GET, "date", FILTER_SANITIZE_STRING);

    if (!validateDate($date)) {
        die("Error: Invalid date value.");
    }

    if ($range == 'day') {
        $end_date = $date;
    } elseif ($range == 'week') {
        $d = DateTime::createFromFormat('Y-m-d', $date);
        $d->modify('+6 days');
        $end_date = $d->format('Y-m-d');
    } else {
        die("Error: Invalid range value. Values accepted: 'day', 'week'.");
    }

    $mysqli = new mysqli('localhost', 'betawell_meeting', 'St@ndard1', 'betawell_meeting');

    /* check connection */
    if ($mysqli->connect_errno) {
        die("Error: Could not connect to meeting room bookings database.");
    }

    /* Select queries return a json object */
    if ($result = $mysqli->query("
        SELECT datetime FROM bookings WHERE (datetime between '$date' and '$end_date 23:59:59') AND reserved = 1
    ")) {
        $rows = array();
        while($r = mysqli_fetch_assoc($result)) {
            $rows[] = $r;
        }
        print json_encode($rows);
    } else {
        die("Error: Could not connect to meeting room bookings database.");
    }