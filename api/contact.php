<?php
// Receives contact-form and newsletter submissions, emails them, and keeps a CSV backup.
header('Content-Type: application/json; charset=utf-8');
require __DIR__ . '/config.php';

function out($ok, $msg, $code = 200) {
    http_response_code($code);
    echo json_encode($ok ? ['success' => true, 'message' => $msg] : ['success' => false, 'error' => $msg]);
    exit;
}
function clean($v, $max = 255) {
    $v = trim((string)($v ?? ''));
    $v = str_replace(["\r", "\n", "%0a", "%0d"], ' ', $v);   // blocks email header injection
    return mb_substr($v, 0, $max);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') out(false, 'Invalid request.', 405);
if (!empty($_POST['website'])) out(true, 'Thank you!');          // honeypot: bots fill this hidden field

$type  = ($_POST['form_type'] ?? '') === 'newsletter' ? 'newsletter' : 'contact';
$email = filter_var(clean($_POST['email'] ?? ''), FILTER_VALIDATE_EMAIL);
if (!$email) out(false, 'Please enter a valid email address.', 422);

// simple rate limit: 1 submission per 20 seconds per visitor IP
$ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
$lock = sys_get_temp_dir() . '/enq_' . md5($ip);
if (is_file($lock) && time() - filemtime($lock) < 20) out(false, 'Please wait a moment before sending again.', 429);
@touch($lock);

if ($type === 'newsletter') {
    $subject = "[$SITE_NAME] New newsletter subscriber";
    $body = "New subscriber: $email";
    $row = [date('c'), 'newsletter', '', $email, '', '', '', ''];
    $ok_msg = 'Thanks for subscribing!';
} else {
    $name = clean($_POST['name'] ?? '', 120);
    $message = trim((string)($_POST['message'] ?? ''));
    if ($name === '' || $message === '') out(false, 'Please fill in your name and message.', 422);
    $message = mb_substr($message, 0, 3000);
    $phone = clean($_POST['phone'] ?? '', 40);
    $service = clean($_POST['serviceType'] ?? '', 60);
    $dest = clean($_POST['destination'] ?? '', 160);
    $subject = "[$SITE_NAME] New enquiry from $name";
    $body = "Name: $name\nEmail: $email\nPhone: $phone\nService: $service\nDestination: $dest\n\nMessage:\n$message\n";
    $row = [date('c'), 'contact', $name, $email, $phone, $service, $dest, str_replace(["\r", "\n"], ' ', $message)];
    $ok_msg = 'Thank you! Your enquiry has been sent. We will contact you shortly.';
}

// CSV backup (folder is blocked from the web by api/data/.htaccess)
$f = @fopen(__DIR__ . '/data/enquiries.csv', 'a');
if ($f) { fputcsv($f, $row); fclose($f); }

$headers = "From: $SITE_NAME <$FROM_EMAIL>\r\nReply-To: $email\r\nContent-Type: text/plain; charset=utf-8\r\n";
$sent = @mail($TO_EMAIL, '=?UTF-8?B?' . base64_encode($subject) . '?=', $body, $headers);

// Success if either the email went out or the CSV backup was saved
if ($sent || $f) out(true, $ok_msg);
out(false, 'Sorry, we could not send your message. Please call us instead.', 500);
