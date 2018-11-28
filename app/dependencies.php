<?php
// DIC configuration

$container = $app->getContainer();

// db connection
$container['db'] = function($c) {
    $db = $c['settings']['db'];
    $pdo = new PDO('mysql:host=' . $db['host'] . ';dbname=' . $db['dbname'],
        $db['user'], $db['pass']);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
    return $pdo;
};

$container['UsersController'] = function($c) {
    return new \App\Controllers\UsersController($c);
};

$container['SettingsController'] = function($c) {
    return new \App\Controllers\SettingsController($c);
};

$container['AuthController'] = function($c) {
    return new \App\Controllers\AuthController($c);
};

$container['MessagesController'] = function($c) {
    return new \App\Controllers\MessagesController($c);
};

$container['NotificationsController'] = function($c) {
    return new \App\Controllers\NotificationsController($c);
};
