<?php
require_once __DIR__ . '/../config/config.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'error' => 'method_not_allowed']);
    exit;
}

$raw = file_get_contents('php://input');
$data = json_decode($raw, true) ?: [];

$allowedEvents = ['whatsapp_click', 'banner_click'];
$eventType = $data['event_type'] ?? '';

if (!in_array($eventType, $allowedEvents, true)) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'invalid_event_type']);
    exit;
}

$productId = isset($data['product_id']) ? (int)$data['product_id'] : null;
$bannerId = isset($data['banner_id']) ? (int)$data['banner_id'] : null;
$page = isset($data['page']) ? substr((string)$data['page'], 0, 255) : null;

track_event($eventType, $productId, $bannerId, $page);

echo json_encode(['ok' => true]);
