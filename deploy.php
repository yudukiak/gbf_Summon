<?php
include '../gbf_summon.php';

// http://isometriks.com/verify-github-webhooks-with-php
$secret = $Git_Secret;

$headers = getallheaders();
$hubSignature = $headers['X-Hub-Signature'];

// Split signature into algorithm and hash
list($algo, $hash) = explode('=', $hubSignature, 2);

// Get payload
$payload = file_get_contents('php://input');

// Calculate hash based on payload and the secret
$payloadHash = hash_hmac($algo, $payload, $secret);

// Check if hashes are equivalent
if ($hash !== $payloadHash) {
    // Kill the script or do something else here.
    die('Bad secret');
}

// Your code here.
exec('cd summon;~/opt/bin/git pull');

?>