<?php


// Replace with the path to your certificate & privateKey  file (.pem) and the password protecting it
$certificatePath = 'certificate.pem';
$privateKeyPath = 'privateKey.pem';

$p12Password = 'Your .p12 password';


// Read the file and extract the certificate and private key
if (!file_exists($certificatePath)) {
    echo "certificate file not found.";
    exit;
}

if (!file_exists($privateKeyPath)) {
    echo "privateKey file not found.";
    exit;
}

// $jsonPayload = json_encode($data);
$validation_url = $_GET['u'];
if ("https" == parse_url($validation_url, PHP_URL_SCHEME) && substr(parse_url($validation_url, PHP_URL_HOST), -10) == ".apple.com") {

    $ch = curl_init();

    $data = '{"merchantIdentifier":"apple pay merchant Id", "domainName":"", "displayName":""}';

    curl_setopt($ch, CURLOPT_URL, $validation_url);
    curl_setopt($ch, CURLOPT_SSLCERT, $certificatePath);
    curl_setopt($ch, CURLOPT_SSLKEY, $privateKeyPath);
    curl_setopt($ch, CURLOPT_SSLKEYPASSWD, $p12Password);
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $data);

    if (curl_exec($ch) === false) {
        echo '{"curlError":"' . curl_error($ch) . '"}';
    }

    // close cURL resource, and free up system resources
    curl_close($ch);
}
?>