<?php

function ErrorHandler( $response, $statusCode, $errorMsg) {
  $body = json_encode(["status" => "error", "message" => $errorMsg], JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT);

  return $response
          ->withStatus($statusCode)
          ->withHeader("Content-type", "application/json")
          ->write($body);
}
