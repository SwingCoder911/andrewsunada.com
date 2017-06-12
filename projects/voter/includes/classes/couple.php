<?php
require_once("db.php");
class Couple{
  public $id = null;
  public $compId = null;
  public $partner1 = "";
  public $partner2 = "";

  function __construct($data){
    $this->id = array_key_exists("couple_id", $data) ? $data["couple_id"] : null;
    $this->compId = array_key_exists("comp_id", $data) ? $data["comp_id"] : null;
    $this->partner1 = array_key_exists("partner_1", $data) ? $data["partner_1"] : "";
    $this->partner2 = array_key_exists("partner_2", $data) ? $data["partner_2"] : "";
  }

  public static function SaveCouple($request){
      if(!is_array($request)){
          return false;
      }
      $db = new VoterDB();
      $insertable = array();
      $insertable["couple_id"] = (array_key_exists("Id", $request)) ? intval($request["Id"]) : "";
      $insertable["partner_1"] = (array_key_exists("Partner1", $request)) ? $request["Partner1"] : "";
      $insertable["partner_2"] = (array_key_exists("Partner2", $request)) ? $request["Partner2"] : "";
      return $db->updateCouple($insertable);
  }
  public static function DeleteCouple($id){
      if(!$id){
          return false;
      }
      $db = new VoterDB();
      return $db->deleteCouple($id);
  }

  public static function GetCouple($id){
      $db = new VoterDB();
      return new Couple($db->getCouple($id));
  }
}
?>
