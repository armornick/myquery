import './style.css'
import $ from './myquery';

$('.hide-me').hide();

$('#hack-button').click(() => $('.hide-me').toggle());
$('#fade-button').click(() => $('.fade-me').fadeOut());
$('#get-text-button').click(() => alert($('h1').text()))
$('#fix-button').click(() => $('h1').html('Lorem Ipsum'));

