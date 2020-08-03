<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Headers: Authorization, Content-Type");
header("Access-Control-Allow-Origin: *");
$return = array();

if (isset($_GET['action']) && $_GET['action'] != '') {

  if ($_GET['action'] == "moderatePublish") {
    if (isset($_REQUEST['param1']) && isset($_REQUEST['param2']) && isset($_REQUEST['param3'])) {
      $from = "noreply@cloudidea.es";
      $to = $_REQUEST['param1'];
      $subject = "Cloudidea pending moderation";
      $message = "Hello " . $_REQUEST['param2'] . ",\n\r we are pleased to tell you that your project " . $_REQUEST['param3'] . " has been correctly sended to moderation. \n";
      $headers = "From:" . $from;
      mail($to, $subject, $message, $headers);
    }
  } else if ($_GET['action'] == "acceptedPublish") {
    if (isset($_REQUEST['param1']) && isset($_REQUEST['param2']) && isset($_REQUEST['param3'])) {
      $from = "noreply@cloudidea.es";
      $to = $_REQUEST['param1'];
      $subject = "Cloudidea accepted " . $_REQUEST['param3'];
      $message = "Hello " . $_REQUEST['param2'] . ",\n\r we are pleased to tell you that your project " . $_REQUEST['param3'] . " has been accepted and you'll be able to see
      it on the page in a while. \n";
      $headers = "From:" . $from;
      mail($to, $subject, $message, $headers);
    }
  } else if ($_GET['action'] == "rejectedPublish") {
    if (isset($_REQUEST['param1']) && isset($_REQUEST['param2']) && isset($_REQUEST['param3'])) {
      $from = "noreply@cloudidea.es";
      $to = $_REQUEST['param1'];
      $subject = "Cloudidea rejected " . $_REQUEST['param3'];
      $message = "Hello " . $_REQUEST['param2'] . ",\n\r we are discouraged to tell you that your project " . $_REQUEST['param3'] . " has been rejected, you should read the FAQ and terms of use of Cloudidea in order to republish the project. \n";
      $headers = "From:" . $from;
      mail($to, $subject, $message, $headers);
    }
  }
  
}

?>
