<?php

require_once 'bootstrap.php';

$context['title'] = 'evm App';

echo $twig->render( 'app.twig', $context );