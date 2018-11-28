<?php

namespace App\Controllers;

class Controller {
    
    protected $container;

    public function __construct($container) {

        $this->container = $container;
    }

    
    public function errorHandler( $response, $statusCode, $errorMsg) {
        $body = json_encode(["status" => "error", "message" => $errorMsg], JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT);
    
        return $response
                ->withStatus($statusCode)
                ->withHeader("Content-type", "application/json")
                ->write($body);
    }

    public function __get($property) {

        if($this->container->{$property}) {
            return $this->container->{$property};
        }
    }
}