<?php

require_once('stripe-php/init.php');

// Set your secret key: remember to change this to your live secret key in production
// See your keys here https://dashboard.stripe.com/account/apikeys
\Stripe\Stripe::setApiKey("sk_test_AA4Pw0XbFwPbjutfhGt5VmX4");

// Get the credit card details submitted by the form
$token = $_POST['stripe_token'];

// Create the charge on Stripe's servers - this will charge the user's card
try {
    $charge = \Stripe\Charge::create(array(
        "amount" => $_POST['amount'], // amount in cents, again
        "currency" => "gbp",
        "source" => $token,
        "description" => "Example charge"
    ));
} catch(\Stripe\Error\Card $e) {
    // The card has been declined
}