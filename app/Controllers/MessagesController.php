<?php

namespace App\Controllers;

class MessagesController extends Controller {

    public function getAllMessages($request, $response, $args) {
        $id = $args['id'];

        $sql  = "SELECT * FROM messages WHERE sender_id = $id OR receiver_id = $id";
        
        try {
            $stmt = $this->db->prepare($sql);

            $messages = $this->db->query($sql)->fetchAll(\PDO::FETCH_OBJ);

            $stmt->execute();
        } catch(PDOException $e) {
            echo '{"error": {"text": '.$e->getMessage().'}}';
        }
    
        $res = json_encode($messages);
        return $res;
    }

    public function sendMessage($request, $response, $args) {
        $receiver_id     = $request->getParam('receiver_id');
        $text            = $request->getParam('text');
        $sender_id       = $request->getParam('sender_id');
        $sender_name     = $request->getParam('sender_name');
        $sender_surname  = $request->getParam('sender_surname');
        $sender_avatar   = $request->getParam('sender_avatar');
        $date            = $request->getParam('date');

        $sql = "INSERT INTO 
        messages (type,receiver_id,text,sender_id,sender_name,sender_surname,sender_avatar,date) 
        VALUES 
        ('outbox',:receiver_id,:text,:sender_id,:sender_name,:sender_surname,:sender_avatar,CURRENT_TIMESTAMP)";
        
        try {
            $stmt = $this->db->prepare($sql);

            $stmt->bindParam(':receiver_id', $receiver_id);
            $stmt->bindParam(':text', $text);
            $stmt->bindParam(':sender_id', $sender_id);
            $stmt->bindParam(':sender_name', $sender_name);
            $stmt->bindParam(':sender_surname', $sender_surname);
            $stmt->bindParam(':sender_avatar', $sender_avatar);

            $stmt->execute();
       } catch(PDOException $e) {
           echo '{"error": {"text": '.$e->getMessage().'}}';
       }
        
        $message = array(
            'receiver_id' => $receiver_id,
            'sender_id' => $sender_id,
            'text' => $text,
            'sender_name' => $sender_name,
            'sender_surname' => $sender_surname,
            'sender_avatar' => $sender_avatar,
            'date' => $date
        );
        $res = json_encode($message);
    
        return $res;
    }
}