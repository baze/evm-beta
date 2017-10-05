<?php

echo("before autoload");

require_once 'vendor/autoload.php';

echo( "after autoload" );

$loader = new Twig_Loader_Filesystem( 'views' );
$twig   = new Twig_Environment( $loader );

echo( "got twig" );

$manifest = json_decode( file_get_contents( __DIR__ .'/dist/manifest.json' ), true );

echo( "got manifest" );

$context['manifest'] = $manifest;
