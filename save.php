<?php

$request_body = file_get_contents('php://input');
$data = json_decode($request_body);
$path = 'characters/' . $data->name . '.json';
file_put_contents($path, $request_body);
chmod($path, 0777);