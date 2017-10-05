<?php

die("dd");

require_once 'vendor/autoload.php';

$loader = new Twig_Loader_Filesystem( 'views' );
$twig   = new Twig_Environment( $loader );

$manifest = json_decode( file_get_contents( __DIR__ .'/dist/manifest.json' ), true );

$context['manifest'] = $manifest;
