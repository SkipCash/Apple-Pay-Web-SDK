<?php
$amount = 1;
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $amount = $_POST["amount"];
}
function guidv4($data = null)
{
    // Generate 16 bytes (128 bits) of random data or use the data passed into the function.
    $data = $data ?? random_bytes(16);
    assert(strlen($data) == 16);
    // Set version to 0100
    $data[6] = chr(ord($data[6]) & 0x0f | 0x40);
    // Set bits 6-7 to 10
    $data[8] = chr(ord($data[8]) & 0x3f | 0x80);
    // Output the 36 character UUID.
    return vsprintf('%s%s-%s-%s-%s-%s%s%s', str_split(bin2hex($data), 4));
}
function generate_random_letters($length)
{
    $random = '';
    for ($i = 0; $i < $length; $i++) {
        $random .= chr(rand(ord('a'), ord('z')));
    }
    return $random;
}


$sandboxUrl = "https://skipcashtest.azurewebsites.net/api/v1/payments";
$prodUrl = "https://api.skipcash.app/api/v1/payments";

$uniqueid = generate_random_letters(6);
$myuuid = guidv4();
$secretkey = "skipcash secret key";
$data = [];
$data['Uid'] = $myuuid;
$data['KeyId'] = "skipcash key id";
$data['Amount'] = $amount;
$data['FirstName'] = "";
$data['LastName'] = "";
$data['Phone'] = "";
$data['Email'] = "";
$data['TransactionId'] = $myuuid;
$data_string = json_encode($data);
$resultheader = "Uid=" . $data['Uid'] . ',KeyId=' . $data['KeyId'] . ',Amount=' . $data['Amount'] . ',FirstName=' . $data['FirstName'] . ',LastName=' . $data['LastName'] . ',Phone=' . $data['Phone'] . ',Email=' . $data['Email'] . ',TransactionId=' . $data['TransactionId'];


$s = hash_hmac('sha256', $resultheader, $secretkey, true);
$authorisationheader = base64_encode($s);
$curl = curl_init();

curl_setopt_array($curl, array(
    CURLOPT_URL => $prodUrl,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_ENCODING => "",
    CURLOPT_MAXREDIRS => 10,
    CURLOPT_TIMEOUT => 30,
    CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_2_0,
    CURLOPT_CUSTOMREQUEST => "POST",
    CURLOPT_POSTFIELDS => $data_string,
    CURLOPT_HTTPHEADER => array(
        'Content-Type:application/json',
        'Authorization:' . $authorisationheader
    ),
)
);

// Perform the cURL request
$response = curl_exec($curl);

// Check for cURL errors
if (curl_errno($curl)) {
    echo 'Curl error: ' . curl_error($curl);
}

// Close the cURL session
curl_close($curl);


echo $response;
exit;