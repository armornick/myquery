import './style.css'
import $ from './myquery';


$('.hide-me').hide();
$('button').click(() => $('.hide-me').show());
