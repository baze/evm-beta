<?php

require_once 'bootstrap.php';

$context['title'] = 'evm App';

die( "d" );

echo $twig->render( 'app.twig', $context );