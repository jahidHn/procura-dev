<?php

if($_POST["submit"]) {
    $recipient="scooper@procura.ca,park@procura.ca,customerservice@procura.ca,devjahid@gmail.com";
    $subject="Query: parkprocura";
    $sender=$_POST["sender"];
    $senderEmail=$_POST["senderEmail"];
    $message=$_POST["message"];
    $mailBody="Name: $sender\nEmail: $senderEmail\n\n$message";

    $retval = mail($recipient, $subject, $mailBody, "From: $sender <$senderEmail>");
    if( $retval == true ) {
            echo "Message sent successfully...";
         }else {
            echo "Message could not be sent...";
         }
}

?>