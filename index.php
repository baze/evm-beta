<?php

require_once 'bootstrap.php';

$context['title'] = 'evm App';

$context['displayType'] = isset( $_GET['display']) ? $_GET['display'] : null;

echo $twig->render( 'app.twig', $context );