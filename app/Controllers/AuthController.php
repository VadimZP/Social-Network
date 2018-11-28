<?php

namespace App\Controllers;
use Respect\Validation\Validator as v;

class AuthController extends Controller {

    public function register($request, $response) {
        $error = array();

        $validateEmail        = v::notEmpty()->email()->noWhitespace()->validate($request->getParam('email'));
        $email                = $validateEmail ? $request->getParam('email') : $error[] = 'email';
        $validatePass         = v::notEmpty()->alnum()->length(6, null)->noWhitespace()->validate($request->getParam('password'));
        $password             = $validatePass ? password_hash($request->getParam('password'), PASSWORD_DEFAULT) : $error[] = 'password';
        $validateName         = v::notEmpty()->alnum()->length(2, null)->noWhitespace()->validate($request->getParam('name'));
        $name                 = $validateName ? $request->getParam('name') : $error[] = 'name';
        $validateSurname      = v::notEmpty()->noWhitespace()->length(2, null)->validate($request->getParam('surname'));
        $surname              = $validateSurname ? $request->getParam('surname') : $error[] = 'surname';
        $gender               = $request->getParam('gender');
        $birth                = "{$request->getParam('birth')['day']} {$request->getParam('birth')['month']} {$request->getParam('birth')['year']}";
        $country                = $request->getParam('country');
        $avatar               = $request->getParam('avatar');

        if(!empty($error)) {
            return $this->errorHandler($response, 400, 'Next fields are in incorrect form: '. implode(", ", $error).'');
        }

        $sql = "SELECT * FROM users WHERE email='$email'";

        try {
            $stmt = $this->db->prepare($sql);
    
            $user = $this->db->query($sql)->fetchAll(\PDO::FETCH_OBJ);
        } catch(PDOException $e) {
            echo '{"error": {"text": '.$e->getMessage().'}}';
        }
        
        if(count($user)) {
            return $this->errorHandler($response, 409, 'This email is already registered');
        }

        /* Add user to 'users' table */
        $sql = "INSERT INTO 
            users (email,password,name,surname,gender,birth,country,avatar) 
            VALUES 
            (:email,:password,:name,:surname,:gender,:birth,:country,:avatar)";
    
        try {
            $stmt = $this->db->prepare($sql);
    
            $stmt->bindParam(':email', $email);
            $stmt->bindParam(':password', $password);
            $stmt->bindParam(':name', $name);
            $stmt->bindParam(':surname', $surname);
            $stmt->bindParam(':gender', $gender);
            $stmt->bindParam(':birth', $birth);
            $stmt->bindParam(':country', $country);
            $stmt->bindParam(':avatar', $avatar);
    
            $stmt->execute();
        } catch(PDOException $e) {
            echo '{"error": {"text": '.$e->getMessage().'}}';
        }

        $sql = "SELECT * FROM users WHERE email='$email'";
        $stmt = $this->db->prepare($sql);
    
        $user = $this->db->query($sql)->fetchAll(\PDO::FETCH_OBJ);
        $stmt->execute();

        return json_encode($user);
    }

    public function signIn($request, $response) {
        $email                = $request->getParam('email');
        $password             = $request->getParam('password');
    
        $sql = "SELECT * FROM users WHERE email='$email'";

        try {
            $stmt = $this->db->prepare($sql);
    
            $user = $this->db->query($sql)->fetchAll(\PDO::FETCH_OBJ);

            if(!count($user)) {
                return $this->errorHandler($response, 409, 'This email is not registered');
            }
            
            if(!password_verify($password, $user[0]->password)) {
                return $this->errorHandler($response, 409, 'Password is incorrect');
            }
            
            $stmt->execute();
        } catch(PDOException $e) {
            echo '{"error": {"text": '.$e->getMessage().'}}';
        }
        
        $res = json_encode($user);
        
        return $res;
    }
}