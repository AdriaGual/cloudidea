<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Headers: Authorization, Content-Type");
header("Access-Control-Allow-Origin: *");
$return = array();

if (isset($_GET['action']) && $_GET['action'] != '') {

  if ($_GET['action'] == "moderatePublish") {
    if (isset($_REQUEST['param1']) && isset($_REQUEST['param2']) && isset($_REQUEST['param3']) && isset($_REQUEST['param4'])) {
      $from = "support@cloudidea.es";
      $to = $_REQUEST['param1'];

      if ($_REQUEST['param4'] == "es") {
        $subject = "Cloudidea '" . $_REQUEST['param3'] . "' pendiente de moderación";
        $message = "Buenas " . $_REQUEST['param2'] . ",\n\r tu proyecto '" . $_REQUEST['param3'] . "'' se ha enviado correctamente a moderación. \n";
      } else {
        $subject = "Cloudidea '" . $_REQUEST['param3'] . "' pending moderation";
        $message = "Hello " . $_REQUEST['param2'] . ",\n\r we are pleased to tell you that your project '" . $_REQUEST['param3'] . "' has been correctly sended to moderation. \n";
      }
      $headers = "From:" . $from;
      mail($to, $subject, $message, $headers);
    }
  } else if ($_GET['action'] == "acceptedPublish") {
    if (isset($_REQUEST['param1']) && isset($_REQUEST['param2']) && isset($_REQUEST['param3']) && isset($_REQUEST['param4'])) {
      $from = "support@cloudidea.es";
      $to = $_REQUEST['param1'];
      if ($_REQUEST['param4'] == "es") {
        $subject = "Cloudidea '" . $_REQUEST['param3'] . "' aceptado";
        $message = "Buenas " . $_REQUEST['param2'] . ",\n\r tu proyecto '" . $_REQUEST['param3'] . " se ha aceptado y lo podrás ver en la página en breve.\n";
      } else {
        $subject = "Cloudidea '" . $_REQUEST['param3'] . "' accepted";
        $message = "Hello " . $_REQUEST['param2'] . ",\n\r we are pleased to tell you that your project " . $_REQUEST['param3'] . " has been accepted and you'll be able to see
      it on the page in a while. \n";
      }

      $headers = "From:" . $from;
      mail($to, $subject, $message, $headers);
    }
  } else if ($_GET['action'] == "rejectedPublish") {
    if (isset($_REQUEST['param1']) && isset($_REQUEST['param2']) && isset($_REQUEST['param3']) && isset($_REQUEST['param4'])) {
      $from = "support@cloudidea.es";
      $to = $_REQUEST['param1'];
      if ($_REQUEST['param4'] == "es") {
        $subject = "Cloudidea '" . $_REQUEST['param3'] . "' rechazado";
        $message = "Buenas " . $_REQUEST['param2'] . ",\n\r tu proyecto '" . $_REQUEST['param3'] . " no se ha aceptado, puedes leerte el FAQ y los términos de uso de Cloudidea para volver a publicar el proyecto.\n";
      } else {
        $subject = "Cloudidea '" . $_REQUEST['param3'] . "' rejected";
        $message = "Hello " . $_REQUEST['param2'] . ",\n\r we are discouraged to tell you that your project " . $_REQUEST['param3'] . " has been rejected, you should read the FAQ and terms of use of Cloudidea in order to republish the project. \n";
      }
      $headers = "From:" . $from;
      mail($to, $subject, $message, $headers);
    }
  } else if ($_GET['action'] == "sendEmail") {
    if (isset($_REQUEST['param1']) && isset($_REQUEST['param2']) && isset($_REQUEST['param3']) && isset($_REQUEST['param4'])) {
      $from = $_REQUEST['param1'];
      $to = $_REQUEST['param2'];
      $subject = $_REQUEST['param3'];
      $message = $_REQUEST['param4'];
      $headers = "From:" . $from;
      mail($to, $subject, $message, $headers);
    }
  }

}

?>
