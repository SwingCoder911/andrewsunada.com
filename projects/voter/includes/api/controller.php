<?php
require_once("../classes/competition.php");
require_once("../classes/session.php");
class Controller{
    //Create a Request object
    public function run(){
        return $this->handlePost();
    }

    public function handlePost(){
        $params = $_POST;
        if(!array_key_exists("Method", $params)){
            return true;
        }
        switch($params["Method"]){
            case "CreateCompetition":
                Competition::Register($params);
                return true;
            break;
            case "DeleteCompetition":
                if(!array_key_exists("Id", $params)){
                    return false;
                }
                return Competition::Delete($params["Id"]);
            break;
            case "CloseCompetition":
                if(!array_key_exists("Id", $params)){
                    return false;
                }
                return Competition::Close($params["Id"]);
            break;
            case "OpenCompetition":
                if(!array_key_exists("Id", $params)){
                    return false;
                }
                return Competition::Open($params["Id"]);
            break;
            case "MakeCompetitionCurrent":
                if(!array_key_exists("Id", $params)){
                    return false;
                }
                return Competition::MakeCurrent($params["Id"]);
            break;
            case "MakeCompetitionNotCurrent":
                if(!array_key_exists("Id", $params)){
                    return false;
                }
                return Competition::MakeNotCurrent($params["Id"]);
            break;
            case "GetCurrentCompetition":
                return Competition::GetCurrent();
            break;
            case "UpdateCompetition":
            break;
            case "Vote":
                if(Session::CheckSession()){
                    return false;
                }
                $comp = Competition::Vote($params);
                $sessionReturn = Session::LogSessionCompetition($comp->id);
                return $sessionReturn;
            break;
            case "GetCompetitionList":
                return Competition::GetCompetitionList();
            break;
            case "GetCompetition":
                if(!array_key_exists("Id", $params)){
                    return false;
                }
                return Competition::GetCompetition($params["Id"]);
            break;
            case "GetCompetitionPlacements":
                return Competition::GetCurrentPlacements();
            break;
            case "GetCompetitionChoices":
            break;
            case "AddCouple":
                if(!array_key_exists("Id", $params)){
                    return false;
                }
                return Competition::AddCouple($params);
            break;
            case "SaveCouple":
                if(!array_key_exists("Id", $params)){
                    return false;
                }
                return Couple::SaveCouple($params);
            break;
            case "DeleteCouple":
                if(!array_key_exists("Id", $params)){
                    return false;
                }
                return Couple::DeleteCouple($params["Id"]);
            break;
            case "CheckSession":
                return Session::CheckSession();
            break;
            case "Login":
                return Session::Login($params);
            break;
            case "CheckLogin":
                return Session::CheckLogin();
            break;
        }
    }
    public static function IsPost(){
        return (strtoupper($_SERVER['REQUEST_METHOD']) == 'POST');
    }

    public static function IsGet(){
        return (strtoupper($_SERVER['REQUEST_METHOD']) == 'GET');
    }
}
?>
