<?php
require __DIR__ . '/../vendor/autoload.php';
require __DIR__ . '/../config/db.php';

$app = new \Slim\App(['settings' => $config]);

require __DIR__ . '/../app/dependencies.php';
require __DIR__ . '/../app/routes.php';

$app->run();