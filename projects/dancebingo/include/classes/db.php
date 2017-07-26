<?php
require_once("./config.php");
date_default_timezone_set ('America/Los_Angeles');
class BingoDB{
	public $servername = SERVERNAME;
	public $username = USERNAME;
	public $password = PASSWORD;
	public $dbname = DBNAME;	
	private $conn = null;
	private $err = false;
	function __construct(){
		$this->conn = new mysqli($this->servername, $this->username, $this->password, $this->dbname);
		if ($this->conn->connect_error) {
			$this->err = $this->conn->connect_error;
 			die("Connection failed: " . $conn->connect_error);
		}
	}

	/**
	 * Get all pieces
	 * 
	 */
	public function getPieces(){
		//$sql = "(SELECT * FROM bingo_board where text not like '%costume%' limit 24) union (Select * from bingo_board where text like '%costume%' order by rand() limit 1);";
		$sql = "SELECT * FROM bingo_board where text not like '%costume%' limit 24;";
		$pieces = array();
		$result = $this->conn->query($sql);
		if ($result->num_rows > 0) {
		    // output data of each row
		    while($row = $result->fetch_assoc()) {
		    	array_push($pieces, $row);
		    }
		} 
		return $pieces;	
	}

	public function recordBingo($name, $location, $bingo){
		$sql = "insert into bingo_winners (name, location, date, event, pattern) values ('%s', '%s', '%s', 'the_after_party', '%s');";
		$sql = vsprintf($sql, array($name, $location, date("Y-m-d H:i:s"), $this->conn->real_escape_string($bingo)));
		$result = $this->conn->query($sql);
	}
	public function getWinners(){
		$sql = "SELECT * FROM bingo_winners where event='the_after_party' and archived=0 order by date desc limit 300;";
		$winners = array();
		$result = $this->conn->query($sql);
		if ($result->num_rows > 0) {
		    // output data of each row
		    while($row = $result->fetch_assoc()) {
		    	array_push($winners, $row);
		    }
		} 
		return array_slice($winners, 0, 20);	
	}

	public function insertList($list){
		$sql = "insert into bingo_board (text) values";
		foreach($list as $item){
			if($item == end($list)){
				$sql .= " ('" . $item . "')";	
			}else{
				$sql .= " ('" . $item . "'),";	
			}			
		}
		$sql .= ";";
		var_dump($sql);
		//$result = $this->conn->query($sql);
	}
	public function archiveList($list){
		$sql = "update bingo_winners set archived=1 where id in (%s)";
		$sql = vsprintf($sql, array($list));
		$result = $this->conn->query($sql);
	}

}
?>