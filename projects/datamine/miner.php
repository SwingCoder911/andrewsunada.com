<?php
require_once("config.php");
class Miner{
	const API_KEY = API_KEY;
	const CURL_GET = 'GET';
	const CURL_POST = 'POST';

	//The maximum requests allowed by Google API
	const MAX_REQUESTS = 1000;//Should be 1000
	const MAX_CALLS_PER_CELL	= 33;//3 max requests for pages to 60 and average return of results is 30(0-60)
	const DEFAULT_CELL_SIZE = .166; //Conversion of what about 1 mile is in lat/long decimal for the cell size

	const METER_STEP = 1850; //Meter conversion of DEFAULT_CELL_SIZE
	const CELL_STEP_COUNT = 10; // Number of steps in cell

	private $dbHost = DB_HOST;
	private $dbUsername = DB_USERNAME;
	private $dbPassword = DB_PASSWORD;
	private $dbDatabase = DB_DATABASE;
	private $errors = array();

	public $location; //Should be an array of 'longitude'/'latitude'
	public $category;
	public $places;
	public $cellSize; //Probably should make this user toggleable
	public $grid;
	public $headers;

	public function __construct(){

	}

	/**
	  * This is the basic "run" function that returns a response array:
	  * array('code' => '', 'data' => '', 'errors' => '', 'headers' => '')
	  */
	public function processData($postalCode, $category){
		$response = array(
			'code' => false,
			'data' => array(),
			'errors' => false
			);
		$this->category = $category;
		$this->places = array();
		//Use coded as an error response
		$coded = $this->geoCode($postalCode);
		if(!$coded){
			$response['code'] = "error";
			$response['errors'] = $this->errors;
			return $response;
		}
		$this->buildGrid();
		$gridState = $this->processGrid($category);
		if(!$gridState){
			$response['code'] = "error";
			$response['errors'] = $this->errors;
			return $response;
		}
		$dbState = $this->storePlaces();
		if(!$dbState){
			$response['code'] = "error";
			$response['errors'] = $this->errors;
			return $response;
		}
		error_log(json_encode($this));
		$this->getHeaders();
		$response['code'] = "success";
		$response['data'] = $this->places;
		$response['headers'] = $this->headers;
		return $response;
	}

	/**
	  * The response should be a success/error response from this
	  * This function's purpose is to get the lat/long coordinates from the requested zip code
	  */
	public function geoCode($postalCode){
		$url = 'https://maps.googleapis.com/maps/api/geocode/json?';
		$params = array(
			'key' => self::API_KEY,
			'components' => "postal_code:$postalCode",
			'sensor' => false
			);
		$response = $this->curlRequest($url . http_build_query($params));
		$coded = json_decode($response);
		//We've only seen one record being returned but handle multiple records being returned
		if(!property_exists($coded, 'results') || (count($coded->results) == 0)){
			$this->errors[] = "Geocoding Error";
			return "Error";
		}
		if(property_exists($coded, 'error_message') && (($coded->error_message != '') || ($coded->error_message != false))){
			$this->errors[] = "Google Api: $decodedPlaces->error_message";
			return false;
		}
		$content = $coded->results[0];
		if(!property_exists($content, 'geometry')){
			$this->errors[] = "Geocoding Error: no results";
			return "Error";
		}
		$geometry = $content->geometry;
		if(!property_exists($geometry, 'location')){
			$this->errors[] = "Geocoding Error: invalid response";
			return "Error";
		}
		$location = $geometry->location;
		if(!property_exists($location, 'lat') || !property_exists($location, 'lng')){
			$this->errors[] = "Geocoding Error: invalid response";
			return "Error";
		}
		$this->location = array('lat' => $location->lat, 'long' => $location->lng);
		return $coded;
	}

	/**
	  * This function's purpose is to build out the grid with the desired lat/long coords
	  */
	public function buildGrid(){
		$gridDimensions = floor(sqrt((self::MAX_REQUESTS - 1) / self::MAX_CALLS_PER_CELL));
		$this->cellSize = self::DEFAULT_CELL_SIZE;
		$adjust = !($gridDimensions % 2) ? ($this->cellSize / 2) : 0;
		$xSlider = $ySlider = floor($gridDimensions / 2);
		$this->grid = array();
		for($i = 0; $i < $gridDimensions; $i++){
			$this->grid[$i] = array();
			$xSlider = floor($gridDimensions / 2);
			for($k = 0; $k < $gridDimensions; $k++){
				$this->grid[$i][$k] = ($this->location['lat'] - ($xSlider * $this->cellSize) + $adjust) . ',' . ($this->location['long'] - ($ySlider * $this->cellSize) + $adjust);
				$xSlider -= 1;
			}
			$ySlider -= 1;
		}
	}

	/**
	  * The purpose of this function is to run the findPlaces function on all lat/long pairs in the grid.
	  */
	public function processGrid(){
		$radius = (self::METER_STEP * (self::CELL_STEP_COUNT / 2));//In meters. Find a way to specify this in miles and convert to meters
		$success = true;
		foreach($this->grid as $col){
			foreach($col as $cell){
				$success = $this->findPlaces($cell, $radius, $this->category);
				if(!$success){
					return false;
				}
			}
		}
		return true;
	}

	/**
	  * The purpose of this function is to store all the places found by google in the database
	  */
	public function storePlaces(){
		@$dbConn = new mysqli($this->dbHost, $this->dbUsername, $this->dbPassword, $this->dbDatabase);
		if(mysqli_connect_errno()){
			$this->errors[] = "Database error: Connection error";
			return false;
		}
		//Create url logging
		foreach($this->places as $record){
			$sql = "INSERT into data (business_name, street_address, city, state, zip, main_business_phone, category, website)
					values ('%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s')";
			$query = vsprintf($sql, array(
				$dbConn->real_escape_string($record['business_name']),
				$dbConn->real_escape_string($record['street_address']),
				$dbConn->real_escape_string($record['city']),
				$dbConn->real_escape_string($record['state']),
				$dbConn->real_escape_string($record['zip']),
				$dbConn->real_escape_string($record['main_business_phone']),
				$dbConn->real_escape_string($record['category']),
				$dbConn->real_escape_string($record['website']),
				));
			$dbConn->query($query);
		}
		$dbConn->close();
		return true;
	}

	/**
	  * The purpose of this function is to get all records from the database
	  */
	public function getAllRecords(){
		$records = array();
		$dbConn = new mysqli($this->dbHost, $this->dbUsername, $this->dbPassword, $this->dbDatabase);
		if(mysqli_connect_errno()){
			return 'Error';
		}

		if($result = $dbConn->query("select * from data;")){
			while($tmp = $result->fetch_assoc()){
				$records[] = $tmp;
			}
		}
		return $records;
	}

	/**
	  * The purpose of this function is to get all records from the database
	  */
	public function getTodaysRecords(){
		$records = array();
		$dbConn = new mysqli($this->dbHost, $this->dbUsername, $this->dbPassword, $this->dbDatabase);
		if(mysqli_connect_errno()){
			return 'Error';
		}

		if($result = $dbConn->query("select * from data where date_format(created, '%Y-%m-%d') = date_format(CURRENT_TIMESTAMP, '%Y-%m-%d');")){
			while($tmp = $result->fetch_assoc()){
				$records[] = $tmp;
			}
		}
		return $records;
	}



	/**
	  * This should return a success/error response
	  * The purpose of this funciton is to get all the places from a specific zip code and given radius in each grid cell.
	  * It recurses when there are more than one page of results
	  */
	public function findPlaces($location, $radius, $category, $token = false){
		$url = 'https://maps.googleapis.com/maps/api/place/search/json?';
		$params = array(
			'key' => self::API_KEY,
			'location' => $location,
			'radius' => $radius,
			'keyword' => $category
			);
		if($token != false){
			$params['pagetoken'] = $token;
		}
		$response = $this->curlRequest($url . http_build_query($params));
		$decodedPlaces = json_decode($response);
		if(property_exists($decodedPlaces, 'error_message') && (($decodedPlaces->error_message != '') || ($decodedPlaces->error_message != false))){
			$this->errors[] = "Google Api: $decodedPlaces->error_message";
			return false;
		}
		if(!property_exists($decodedPlaces, 'results')){
			error_log($response);
			$this->errors[] = "Google Api Places search error";
			return false;
		}
		foreach($decodedPlaces->results as $record){
			$key = $this->getKey($record);
			if(!array_key_exists($key, $this->places)){
				$row = $this->getRow($record, $category);
				if(!$row){
					return false;
				}
				$this->places[$this->getKey($record)] = $row;
			}
		}
		if(property_exists($decodedPlaces, 'next_page_token')){
			return $this->findPlaces($radius, $category, $decodedPlaces->next_page_token);
		}
		return true;
	}

	/**
	  * The purpose of this function is to fill out all the data from the api requests into rows to store in the database
	  */
	private function getRow($record, $category){
		$url = 'https://maps.googleapis.com/maps/api/place/details/json?';
		$row = array(
			'city' => '',
			'state' => '',
			'zip' => ''
			);
		$params = array(
			'key' => self::API_KEY,
			'placeid' => $record->place_id
			);
		$response = $this->curlRequest($url . http_build_query($params));
		//Do error handling
		$decodedResponse = json_decode($response);
		if(!property_exists($decodedResponse, 'result')){
			error_log($response);
			$this->errors[] = "Detail Request error: " + $response;
			return false;
		}
		if(property_exists($decodedResponse, 'error_message') && (($decodedResponse->error_message != '') || ($decodedResponse->error_message != false))){
			$this->errors[] = "Google Api: $decodedPlaces->error_message";
			return false;
		}
		$details = $decodedResponse->result;
		$street = '';
		foreach($details->address_components as $comp){
			//Check against wrong order
			if(in_array('street_number', $comp->types)){
				$street = $comp->long_name;
			}else if(in_array('route', $comp->types)){
				$street .= ' ' . $comp->short_name;
			}else if(in_array('locality', $comp->types)){
				$row['city'] = $comp->long_name;
			}else if(in_array('administrative_area_level_1', $comp->types)){
				$row['state'] = $comp->long_name;
			}else if(in_array('postal_code', $comp->types)){
				$row['zip'] = $comp->long_name;
			}
		}
		$row['street_address'] = $street;
		$row['business_name'] = $details->name;
		$row['category'] = $category;
		$row['website'] = property_exists($details, 'website') ? $details->website : '';
		$row['main_business_phone'] = property_exists($details, 'formatted_phone_number') ? $details->formatted_phone_number : '';
		return $row;
	}

	/**
	  * The purpose of this function is to get all the headers from the response that should be displayed in the ui
	  */
	private function getHeaders(){
		if(count($this->places) == 0){
			return false;
		}
		$sample = reset($this->places);
		foreach($sample as $key => $value){
			$this->headers[$key] = ucwords(str_replace("_", " ", $key));
		}
	}

	/**
	  * This is for generation of the key for storeage.
	  */
	private function getKey($record){
		return str_replace(" ", "_", strtolower($record->name));
	}

	/**
	  * Curl request
	  */
	public function curlRequest($url){
		$curl = curl_init();
		curl_setopt($curl, CURLOPT_URL, $url);
		curl_setopt($curl, CURLOPT_HTTPGET, 1);
		curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
		curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);

		$response = curl_exec($curl);
		curl_close($curl);
		return $response;
	}
}