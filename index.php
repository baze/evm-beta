<?php

require_once 'bootstrap.php';

echo( "bootstrap complete" );

$context['title'] = 'evm App';

echo $twig->render( 'app.twig', $context );