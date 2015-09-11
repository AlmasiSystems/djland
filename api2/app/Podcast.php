<?php

namespace App;

define('PODCAST_LIMIT_HOURS',8);

use Illuminate\Database\Eloquent\Model;

class Podcast extends Model
{
    protected $table = 'podcast_episodes';
    const CREATED_AT = null;
    const UPDATED_AT = null;
    protected $fillable = array('playsheet_id', 'title', 'subtitle', 'summary', 'date', 'channel_id', 'url', 'length', 'author', 'active', 'duration', 'edit_date');

    public function playsheet(){
    	return $this->belongsTo('App\Playsheet');
    }
    public function channel(){
    	return $this->belongsTo('App\Channel');
    }
    public function make_podcast(){
    	$response = $this->make_audio();
    	
    	return $response;
    }
    private function make_audio(){
		include($_SERVER['DOCUMENT_ROOT'].'/config.php');
		date_default_timezone_set('America/Vancouver');
		if($this->duration > 8 * 60 * 60 || $this->duration < 0){
			return "Duration Wrong";
		}
		//Date Initialization
		$start = strtotime($this->playsheet->start_time);
		$end = $start + $this->duration;
	    $start_date =  date('d-m-Y+G%3\Ai%3\As', $start);
	    $end_date =  date('d-m-Y+G%3\Ai%3\As', $end);
	    $file_date = date('F-d-H-m-s',$start);
	    $year = date('Y',$start);

	    $date = date('M, d Y H:m:s O',$start);

	    //Archiver URL to download from
		$archive_access_url = "http://archive.citr.ca/py-test/archbrad/download?archive=%2Fmnt%2Faudio-stor%2Flog";
	    $archive_url = $archive_access_url."&startTime=".$start_date."&endTime=".$end_date;

	    //Set File Name
	    $file_name = html_entity_decode(str_replace(array("'", '"',' '),'-',$this->playsheet->show->name),ENT_QUOTES).'-'.$file_date.'.mp3';

		//Set ID3 Tags
    	$tags = array(
	        'title'         => array($this->title),
	        'artist'        => array($this->playsheet->show->name),
	        'album'         => array('CiTR Radio Podcasts'),
	        'year'          => array(date('Y', strtotime($this->date))),
	        'genre'         => array($this->playsheet->show->primary_genre_tags),
	        'comment'       => array('This podcast was created in part by CiTR Radio')
    	);
    	
    	$target_dir = '/home/podcast/audio/'.$year.'/'; 	
    	$target_file_name = $target_dir.$file_name;
		
    	$target_url = 'http://playlist.citr.ca/podcasting/audio/'.$year.'/'.$file_name;

    	$file_from_archive = fopen($archive_url,'r');
    	echo "Writing ".$target_file_name;
		if($file_from_archive){
			echo "Successfully opened ".$file_from_archive;
			//print_r(scandir($target_dir));
			$target_file = fopen($target_file_name,'wb');
			$num_bytes = 0;
			if($target_file){
				echo "Successfully opened ".$target_file_name;
				//Attempt to add ID3 Tags
				//if($tags && $error == '') {
		        //    rewind($target_file);
		        //    write_tags($tags,$info['uri']);
		        //    rewind($target_file);

				while (!feof($file_from_archive)) {
				   $buffer = fread($file_from_archive, 1024*8);  // use a buffer of 1024 bytes
				   $num_bytes += fwrite($target_file, $buffer);
				}

		        

				$this->url = $target_url;
				$this->length = $num_bytes;
				$this->date = $date;
				$this->save();
				$response['audio'] = array('url' => $target_url	);
				$response['xml'] = $this->channel->make_xml();
			}	
		}
	
		if($file_from_archive){
			fclose($file_from_archive);
		}
		if($target_file){
			fclose($target_file);
		}
  
	    return $response;

	}
	



	private function write_tags($tags,$file){
	    global $error;
	    $TextEncoding = 'UTF-8';
	    //require_once($_SERVER['CONTEXT_DOCUMENT_ROOT'].'/headers/getid3/getid3/getid3.php');
	    // Initialize getID3 engine


	    $getID3 = new getID3;
	    $getID3->setOption(array('encoding'=>$TextEncoding));

	    //require_once($_SERVER['CONTEXT_DOCUMENT_ROOT'].'/headers/getid3/getid3/write.php');
	    // Initialize getID3 tag-writing module
	    $tagwriter = new getid3_writetags;
	    $tagwriter->filename = $file;
	    $tagwriter->tagformats = array('id3v2.4');

	    // set various options (optional)
	    $tagwriter->overwrite_tags = true;
	    $tagwriter->tag_encoding = $TextEncoding;
	    $tagwriter->remove_other_tags = true;

	    // populate data array
	    $TagData = $tags;
	    $tagwriter->tag_data = $TagData;

	    // write tags
	    if ($tagwriter->WriteTags()) {

	        if (!empty($tagwriter->warnings)) {
	            $error .= 'There were some warnings:<br>'.implode('<br><br>', $tagwriter->warnings);
	        }
	    } else {
	        $error .= 'Failed to write tags!<br>'.implode('<br><br>', $tagwriter->errors);
	    }
	}

}
