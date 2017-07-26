<?php
require_once("../config.php");
require_once("db.php");
require_once("competition.php");
class Session{
    function __construct(){
        if(session_status() == PHP_SESSION_NONE){
            session_start();
        }
    }
    public function getSession(){
        $session = session_id();
        if(empty($session)){
            session_start();
            $session = session_id();
        }
        return $session;
    }

    public static function CheckSession(){
        $session = new Session();
        $sessionId = $session->getSession();
        $current = Competition::GetCurrent();
        $db = new VoterDB();
        return $db->hasSessionVoted($current->id, $sessionId);
    }

    public static function LogSessionCompetition($compId){
        $session = new Session();
        $sessionId = $session->getSession();
        $db = new VoterDB();
        return $db->writeSessionToComp($compId, $sessionId);
    }

    public static function Login($form){
        if(Session::CheckLogin()){
            return true;
        }
        $session = new Session();
        $sessionId = $session->getSession();
        $db = new VoterDB();
        if($form['Username'] == AdminUser && $form['Password'] == AdminPassword){
            $db->writeLoginToSession($sessionId);
            return true;
        }        
        return false;
    }

    public static function CheckLogin(){
        $session = new Session();
        $sessionId = $session->getSession();
        $db = new VoterDB();
        return $db->checkLoginSession($sessionId);
    }
}
?>
