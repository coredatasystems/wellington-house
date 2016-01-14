<?php
require __DIR__ . '/vendor/autoload.php';

define('APPLICATION_NAME', 'Wellington House Meeting Room Booking System');
define('CREDENTIALS_PATH', __DIR__ . '/.credentials/calendar-php-quickstart.json');
define('CLIENT_SECRET_PATH', __DIR__ . '/client_secret.json');
define('SCOPES', implode(' ', array(
        Google_Service_Calendar::CALENDAR_READONLY)
));

/**
 * Returns an authorized API client.
 * @return Google_Client the authorized client object
 */
function getClient() {
    $client = new Google_Client();
    $client->setApplicationName(APPLICATION_NAME);
    $client->setScopes(SCOPES);
    $client->setAuthConfigFile(CLIENT_SECRET_PATH);
    $client->setAccessType('offline');

    // Load previously authorized credentials from a file.
    $credentialsPath = CREDENTIALS_PATH;

    if (file_exists($credentialsPath)) {
        $accessToken = file_get_contents($credentialsPath);
    } else {
        die('Could not communicate with Google Calendar.');
    }

    $client->setAccessToken($accessToken);

    // Refresh the token if it's expired.
    if ($client->isAccessTokenExpired()) {
        $client->refreshToken($client->getRefreshToken());
        file_put_contents($credentialsPath, $client->getAccessToken());
    }
    return $client;
}


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
$d = DateTime::createFromFormat('Y-m-d H:i:s', $date . ' 00:00:00');
$start_date = $d->format('c');

if ($range == 'day') {
    $d->modify('+1 days');
} elseif ($range == 'week') {
    $d->modify('+7 days');
} else {
    die("Error: Invalid range value. Values accepted: 'day', 'week'.");
}
$end_date = $d->format('c');

// Get the API client and construct the service object.
$client = getClient();
$service = new Google_Service_Calendar($client);

// Print the next 10 events on the user's calendar.
$calendarId = 'primary';
$optParams = array(
    'maxResults' => 500,
    'orderBy' => 'startTime',
    'singleEvents' => TRUE,
    'timeMin' => $start_date,
    'timeMax' => $end_date
);

$results = $service->events->listEvents($calendarId, $optParams);

$events = array();

if (count($results->getItems()) == 0) {
    print "No upcoming events found.\n";
} else {
    foreach ($results->getItems() as $event) {
        $events[] = ['start' => $event->start->dateTime, 'end' => $event->end->dateTime];
        print json_encode($events);
    }
}

