<?php

$request_body = file_get_contents('php://input');
$data = json_decode($request_body);

if (!$data->id) {
    $data->id = strtolower($data->name);
}

$folder = $data->npc? 'npc' : 'pc';

$path = 'characters/' . $folder . '/' . $data->id . '.json';
file_put_contents($path, $request_body);