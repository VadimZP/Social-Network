<?php

use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;


/* Users Controller */
$app->get('/users/{name}', 'UsersController:getUser');
// $app->get('/users/user[/{request_purpose}[/{email}[/{name}]]]', 'UsersController:getUser');
$app->get('/users/all/{id}[/{start}[/{end}]]', 'UsersController:getAllUsers');
$app->post('/users/last', 'UsersController:getLastUser');
$app->get('/users/{id}/friends', 'UsersController:getAllFriends');
$app->delete('/users/{userId}/friends/{friendId}', 'UsersController:deleteFriend');

/* Authentication Controller */
$app->post('/register', 'AuthController:register');
$app->post('/signIn', 'AuthController:signIn');

/* Settings Controller */
$app->put('/settings', 'SettingsController:changeData');
$app->post('/settings/avatar', 'SettingsController:uploadAvatar');

/* Messages Controller */
$app->get('/users/{id}/messages', 'MessagesController:getAllMessages');
$app->post('/users/{id}/messages', 'MessagesController:sendMessage');

/* Notifications Controller */
$app->get('/users/{id}/notifications', 'NotificationsController:getNotifications');
$app->post('/notifications/friendship/send', 'NotificationsController:sendFriendship');
$app->post('/notifications/friendship/accept', 'NotificationsController:acceptFriendship');
$app->delete('/notifications/friendship/reject', 'NotificationsController:rejectFriendship');