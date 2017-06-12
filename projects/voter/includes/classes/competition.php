<?php
require_once("couple.php");
require_once("db.php");
class Competition{
   public $name = "";
   public $id = "";
   public $isCurrent = false;
   public $isClosed = false;
   public $couples = array();

   function __construct($data = array()){
     $this->name = array_key_exists("comp_name", $data) ? $data["comp_name"] : "";
     $this->id = array_key_exists("comp_id", $data) ? $data["comp_id"] : null;
     $this->isCurrent = array_key_exists("is_current", $data) ? $data["is_current"] : false;
     $this->isClosed = array_key_exists("is_closed", $data) ? $data["is_closed"] : false;
   }

   public function loadCouples(){
        $db = new VoterDB();
        $couples = $db->getCouples($this->id);
        foreach($couples as $couple){
            array_push($this->couples, new Couple($couple));
        }
   }

   public static function Register($data){
       $request = Competition::GetCompetitionRequest($data);
       $db = new VoterDB();
       $db->addCompetition($request);
   }

   public static function Delete($id){
       $db = new VoterDB();
       $db->deleteCompetition($id);
   }

   public static function GetCompetitionRequest($request){
       $returnable = array();
       $returnable["name"] = (array_key_exists("Name", $request)) ? $request["Name"] : "";
       $returnable["is_current"] = (array_key_exists("IsCurrent", $request)) ? $request["IsCurrent"] == "true" : false;
       return $returnable;
   }

   public static function GetCompetitionList(){
       $db = new VoterDB();
       $competitions = $db->getCompetitions();
       $comps = array();
       foreach($competitions as $comp){
           array_push($comps, new Competition($comp));
       }
       return $comps;
   }

   public static function GetCompetition($id){
       if($id == null){
           return false;
       }
       $db = new VoterDB();
       $comp = $db->getCompetition($id);
       $comp->loadCouples();
       return $comp;
   }

   public static function AddCouple($request){
       if(!is_array($request)){
           return;
       }
       $db = new VoterDB();
       $insertable = array();
       $insertable["comp_id"] = (array_key_exists("Id", $request)) ? intval($request["Id"]) : "";
       $insertable["partner_1"] = (array_key_exists("Partner1", $request)) ? $request["Partner1"] : "";
       $insertable["partner_2"] = (array_key_exists("Partner2", $request)) ? $request["Partner2"] : "";
       return $db->addCouple($insertable);
   }

   public static function MakeCurrent($id){
       $db = new VoterDB();
       return $db->makeCompetitionCurrent($id);
   }
   public static function MakeNotCurrent($id){
       $db = new VoterDB();
       return $db->makeCompetitionNotCurrent($id);
   }

   public static function Close($id){
       $db = new VoterDB();
       return $db->closeCompetition($id);
   }
   public static function Open($id){
       $db = new VoterDB();
       return $db->OpenCompetition($id);
   }
   public static function GetCurrent(){
       $db = new VoterDB();
       $comp = $db->getCurrentCompetition();
       if(!$comp){
           return false;
       }
       $comp->loadCouples();
       return $comp;
   }
   public static function Vote($request){
       $db = new VoterDB();
       $placements = array(
           "first" => $request["First"],
           "second" => $request["Second"],
           "third" => $request["Third"],
       );
       $comp = $db->getCurrentCompetition();
       $result = $db->voteOnCompetition($comp->id, $placements);
       return $comp;
   }
   public static function GetCurrentPlacements(){
       $db = new VoterDB();
       $placements = array();
       $comp = $db->getCurrentCompetition();
       $placementObjects = $db->getCompetitionPlacements($comp->id);
       foreach($placementObjects as $place => $placementList){
           $couples = array();
           foreach($placementList as $placement){
               array_push($couples, Couple::GetCouple($placement["couple_id"]));
           }
           $placements[$place] = array("votes" => $placement["votes"], "couples" => $couples);
       }
       return $placements;
   }
 }
 ?>
