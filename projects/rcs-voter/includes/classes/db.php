<?php
class VoterDB{
    private $hostname = "box933.bluehost.com";
    private $db_name = "swingda2_event";
    private $db_user = "swingda2_batman";
    private $db_pw = "swingda2_rcs";

    private $conn = null;
	private $err = false;

    function __construct(){
		$this->conn = new mysqli($this->hostname, $this->db_user, $this->db_pw, $this->db_name);
		if ($this->conn->connect_error) {
			$this->err = $this->conn->connect_error;
 			die("Connection failed: " . $conn->connect_error);
		}
	}

    public function addCompetition($data){
        $sql = "insert into event_competition (comp_name, is_current) values ('%s', %b);";
        $query = vsprintf($sql, array($data['name'], $data['is_current']));
        $result = $this->conn->query($query);
        return $result;
    }

    public function deleteCompetition($id){
        //Delete all children too
        $sql = "delete from event_competition where comp_id=%d;";
        $query = vsprintf($sql, array($id));
        $result = $this->conn->query($query);
        return $result;
    }
    public function makeCompetitionCurrent($id){
        //Delete all children too
        $makeCurrentSql = "update event_competition set is_current=1 where comp_id=%d;";
        $makeCurrentQuery = vsprintf($makeCurrentSql, array($id));
        $resetCurrentSql = "update event_competition set is_current=0 where comp_id <> %d;";
        $resetCurrentQuery = vsprintf($resetCurrentSql, array($id));
        if($this->conn->query($resetCurrentQuery) === true){
            return $this->conn->query($makeCurrentQuery);
        }else{
            return false;
        }
    }
    public function makeCompetitionNotCurrent($id){
        //Delete all children too
        $makeCurrentSql = "update event_competition set is_current=0 where comp_id=%d;";
        $makeCurrentQuery = vsprintf($makeCurrentSql, array($id));
        return $this->conn->query($makeCurrentQuery);
    }
    public function closeCompetition($id){
        //Delete all children too
        $closeCurrentSql = "update event_competition set is_closed=1 where comp_id=%d;";
        $closeCurrentQuery = vsprintf($closeCurrentSql, array($id));
        return $this->conn->query($closeCurrentQuery) === true;
    }
    public function openCompetition($id){
        //Delete all children too
        $closeCurrentSql = "update event_competition set is_closed=0 where comp_id=%d;";
        $closeCurrentQuery = vsprintf($closeCurrentSql, array($id));
        return $this->conn->query($closeCurrentQuery) === true;
    }

    public function getCompetitions(){
        $competitions = array();
        $sql = "select * from event_competition;";
        $result = $this->conn->query($sql);
        if ($result->num_rows > 0) {
            // output data of each row
            while($row = $result->fetch_assoc()) {
                array_push($competitions, $row);
            }
        }
        return $competitions;
    }

    public function getCompetition($id){
        if($id == null){
            //handle error better
            return false;
        }
        $sql = "select * from event_competition where comp_id=%d;";
        $sql = vsprintf($sql, array($id));
        $result = $this->conn->query($sql);
        $comp = new Competition($result->fetch_assoc());
        return $comp;
    }

    public function getCompetitionFromCoupleId($id){
        if($id == null){
            //handle error better
            return false;
        }
        $sql = "select ec.* from event_competition ec inner join competition_couples cc on cc.comp_id = ec.comp_id where cc.couple_id=%d;";
        $sql = vsprintf($sql, array($id));
        $result = $this->conn->query($sql);
        $comp = new Competition($result->fetch_assoc());
        return $comp;
    }

    public function getCurrentCompetition(){
        $sql = "select * from event_competition where is_current=1;";
        $result = $this->conn->query($sql);
        $row = $result->fetch_assoc();
        if($row == null){
            return false;
        }else{
            return new Competition($row);
        }
    }

    public function addCouple($data){
        if(!is_array($data)){
            //handle error better
            return false;
        }
        $coupleSql = "insert into event_couples (partner_1, partner_2) values ('%s', '%s')";
        $coupleQuery = vsprintf($coupleSql, array($data['partner_1'], $data['partner_2']));
        $compCoupleSql = "insert into competition_couples (comp_id, couple_id) values (%d, %d);";
        if ($this->conn->query($coupleQuery) === true) {
            $lastId = $this->conn->insert_id;
            $compCoupleQuery = vsprintf($compCoupleSql, array($data["comp_id"], $lastId));
            return $this->conn->query($compCoupleQuery);
        } else {
            return false;
        }
    }
    public function updateCouple($data){
        if(!is_array($data)){
            //handle error better
            return false;
        }
        $coupleSql = "update event_couples set partner_1='%s', partner_2='%s' where couple_id=%d";
        $coupleQuery = vsprintf($coupleSql, array($data['partner_1'], $data['partner_2'], $data['couple_id']));
        return $this->conn->query($coupleQuery) === true;
    }

    public function deleteCouple($id){
        if(!$id){
            //handle error better
            return false;
        }
        $coupleSql = "delete from event_couples where couple_id=%d;";
        $coupleQuery = vsprintf($coupleSql, array($id));
        $compCoupleSql = "delete from competition_couples where couple_id=%d";
        $compCoupleQuery = vsprintf($compCoupleSql, array($id));
        if ($this->conn->query($coupleQuery) === true) {
            return $this->conn->query($compCoupleQuery);
        } else {
            return false;
        }
    }

    public function getCouples($compId){
        $couples = array();
        $sql = "SELECT
                cc.comp_id,
                ec.couple_id,
                ec.partner_1,
                ec.partner_2
                FROM `event_couples` ec
                inner join competition_couples cc
                on ec.couple_id = cc.couple_id
                where cc.comp_id = %d";
        $query = vsprintf($sql, array($compId));
        $result = $this->conn->query($query);
        if ($result->num_rows > 0) {
            // output data of each row
            while($row = $result->fetch_assoc()) {
                array_push($couples, $row);
            }
        }
        return $couples;
    }

    public function voteOnCompetition($compId, $placements){
        if(!$compId || !is_array($placements)){
            return false;
        }
        $voteSql = "insert into event_votes (comp_id_vote, first, second, third) values (%d, %d, %d, %d)";
        $voteQuery = vsprintf($voteSql, array($compId, $placements['first'], $placements['second'], $placements['third']));
        return $this->conn->query($voteQuery);
    }

    public function writeSessionToComp($compId, $sessionId){
        $sessionSql = "insert into session_votes (comp_id, session) values (%d, '%s')";
        $sessionQuery = vsprintf($sessionSql, array($compId, $sessionId));
        return $this->conn->query($sessionQuery);
    }

    public function hasSessionVoted($compId, $sessionId){
        if(!$compId || !$sessionId){
            return false;
        }
        $sql = "select * from session_votes where comp_id=%d and session='%s'";
        $query = vsprintf($sql, array($compId, $sessionId));
        $result = $this->conn->query($query);
        return $result->num_rows > 0;
    }

    public function getCompetitionPlacements($compId){
        $placements = array(
            "first" => null,
            "second" => null,
            "third" => null
        );
        $firstPlaces = array();
        $secondPlaces = array();
        $thirdPlaces = array();
        $firstSql = "SELECT count(*) as votes, first as couple_id FROM `event_votes` group by first order by votes desc";
        $secondSql = "SELECT count(*) as votes, second as couple_id FROM `event_votes` group by second order by votes desc";
        $thirdSql = "SELECT count(*) as votes, third as couple_id FROM `event_votes` group by third order by votes desc";
        $firstResult = $this->conn->query($firstSql);
        if ($firstResult->num_rows > 0) {
            while($row = $firstResult->fetch_assoc()) {
                array_push($firstPlaces, $row);
            }
        }
        $secondResult = $this->conn->query($secondSql);
        if ($secondResult->num_rows > 0) {
            while($row = $secondResult->fetch_assoc()) {
                array_push($secondPlaces, $row);
            }
        }
        $thirdResult = $this->conn->query($thirdSql);
        if ($thirdResult->num_rows > 0) {
            while($row = $thirdResult->fetch_assoc()) {
                array_push($thirdPlaces, $row);
            }
        }
        $i = 0;
        $placements['first'] = array($firstPlaces[$i]);
        while(array_key_exists(($i + 1), $firstPlaces) && $firstPlaces[$i]['votes'] == $firstPlaces[$i + 1]['votes']){
            array_push($placements['first'], $firstPlaces[++$i]);
        }
        $i = 0;
        $placements['second'] = array($secondPlaces[$i]);
        while(array_key_exists(($i + 1), $secondPlaces) && $secondPlaces[$i]['votes'] == $secondPlaces[$i + 1]['votes']){
            array_push($placements['second'], $secondPlaces[++$i]);
        }
        $i = 0;
        $placements['third'] = array($thirdPlaces[$i]);
        while(array_key_exists(($i + 1), $thirdPlaces) && $thirdPlaces[$i]['votes'] == $thirdPlaces[$i + 1]['votes']){
            array_push($placements['third'], $thirdPlaces[++$i]);
        }
        return $placements;
    }

    public function getCouple($id){
        $sql = "select * from event_couples where couple_id=%d";
        $query = vsprintf($sql, array($id));
        $result = $this->conn->query($query);
        return $result->fetch_assoc();
    }

    public function writeLoginToSession($sessionId){
        $sql = "insert into session_login (session_id) values ('%s')";
        $query = vsprintf($sql, array($sessionId));
        return $this->conn->query($query) === true;

    }

    public function checkLoginSession($sessionId){
        $sql = "select * from session_login where session_id = '%s'";
        $query = vsprintf($sql, array($sessionId));
        $result = $this->conn->query($query);
        return $result->num_rows > 0;
    }
}
?>
