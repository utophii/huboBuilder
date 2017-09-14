var avenues = 10, streets = 6;
var x = 1, y = 1;

createWorld(avenues, streets);

$('#crwd').on('click', function () {
  avenues = parseInt('0' + $('#inav').val()); if (avenues == 0) avenues = 10;
  streets = parseInt('0' + $('#inst').val()); if (streets == 0) streets = 10;
  createWorld(avenues, streets);
});

function goHubo(x, y) {
  var newX = 23 + (x - 1) * 50;
  var newY = 23 + (streets - y) * 50;
  $('#hubo').css("left", newX + "px");
  $('#hubo').css("top", newY + "px");
}

function createWorld(avenues, streets) {
  x = 1, y = 1;
  goHubo(x, y);
  $('#room').empty();
  for (var i = streets; i > 0; i--) {
    var big = "<div class='row'>";
    var sml = big;
    for (var j = 1; j < avenues; j++) {
      big += "<div class='cell' data-cell='" + j + ", " + i + "'>"
             + "<div class='incl'>"
               + "<div class='minus'>-</div>"
               + "<div class='plus'>+</div></div>"
             + "<div class='beep'></div></div>"
           + "<div class='wall vert' data-wall='" + (2*j) + ", " + (2*i - 1) + "'></div>";
      sml += "<div class='wall hori' data-wall='" + (2*j - 1) + ", " + (2*i) + "'></div>"
           + "<div class='wall none'></div>";
    }
    big += "<div class='cell' data-cell='" + j + ", " + i + "'>"
           + "<div class='incl'>"
             + "<div class='minus'>-</div>"
             + "<div class='plus'>+</div></div>"
         + "<div class='beep'></div></div></div>";
    sml += "<div class='wall hori' data-wall='" + (2*j - 1) + ", " + (2*i) + "'></div>";
    if (i == 1) sml = '';
    $('#room').append(big + sml);
  }
}

$('body').on('click', '.wall', function() {
  if($(this).hasClass('sel')) {
    $(this).removeClass('sel');
  } else {
    $(this).addClass('sel');
  }
});

$('body').on('click', '.plus', function() {
  var cell = $(this).closest('.cell').attr('data-cell');
  var beep = $('div[data-cell="' + cell + '"] > .beep');
  var string = beep.html();
  if (string == '') string = '0';
  var value = parseInt(string);
  value += 1;
  beep.html(value.toString());
});
$('body').on('click', '.minus', function() {
  var cell = $(this).closest('.cell').attr('data-cell');
  var beep = $('div[data-cell="' + cell + '"] > .beep');
  var string = beep.html();
  if (string == '') return;
  var value = parseInt(string);
  value -= 1;
  var append = '';
  if (value > 0) append = value.toString();
  beep.html(append);
});

function CCW(dir) {
  switch (dir) {
    case 'E': dir = 'N'; break;
    case 'N': dir = 'W'; break;
    case 'W': dir = 'S'; break;
    case 'S': dir = 'E'; break;
  }
  return dir;
}
function CW(dir) {
  switch (dir) {
    case 'E': dir = 'S'; break;
    case 'N': dir = 'E'; break;
    case 'W': dir = 'N'; break;
    case 'S': dir = 'W'; break;
  }
  return dir;
}

document.onkeydown = function() {
  if (!($('#inrb').is(':checked'))) {
    switch (event.keyCode) {
      case 90:
      dir = CCW($('#data').text());
      $('#data').text(dir);
      $("#hubo > img").attr('src', './icon/' + dir.toLowerCase() + '.png');
      break;
      case 67:
      dir = CW($('#data').text());
      $('#data').text(dir);
      $("#hubo > img").attr('src', './icon/' + dir.toLowerCase() + '.png');
      break;
      case 37: if (x > 1) x -= 1; goHubo(x, y); break;
      case 38: if (y < streets) y += 1; goHubo(x, y); break;
      case 39: if (x < avenues) x += 1; goHubo(x, y); break;
      case 40: if (y > 1) y -= 1; goHubo(x, y); break;
    }
  }
}

$('#inrb').change(function() {
  if($('#inrb').is(':checked')) {
    $('#hubo').css('display', 'none');
    $('.robot').slideUp();
  } else {
    $('#hubo').css('display', 'block');
    $('.robot').slideDown();
  }
});

$('#save').on('click', function () {
  var cont = '';
  cont += 'avenues = ' + avenues + '\n';
  cont += 'streets = ' + streets + '\n';

  if (!($('#inrb').is(':checked'))) {
    var beeper = $('#inbp').val();
    if (beeper == '') beeper = '1000';
    cont += 'robot = (' + x + ', ' + y + ', '
          + "'" + $('#data').text() + "', " + beeper + ')\n';
  }

  cont += 'walls = [';
  var p = false;
  $('.wall.sel').each(function(index) {
    p = true;
    if(index != 0) cont += ',';
    cont += '\n    (' + $(this).attr('data-wall') + ')';
  });
  if (p) cont += '\n]\n'; else cont += ']\n';

  cont += 'beepers = {'
  p = false;
  var index = 0;
  $('.cell').each(function() {
    var beep = $(this).find('.beep').html();
    if (beep != '') {
      p = true;
      if (index != 0) cont += ',';
      index += 1;
      cont += '\n    (' + $(this).attr('data-cell') + '): ' + beep;
    }
  });
  if (p) cont += '\n}\n'; else cont += '}\n';

  var fs = require('fs');
  var direc = $('#indr').text();
  if (direc == '') direc = 'myWorld';
  try {
    fs.writeFileSync('./' + direc + '.wld', cont, 'utf-8');
  } catch (e) {
    alert('Failed to save the file!');
  }
});

/* https://jsfiddle.net/587aapc2/ */
$.fn.textWidth = function(_text, _font){
    var fakeEl = $('<span>').hide().appendTo(document.body).text(_text || this.val() || this.text()).css('font', _font || this.css('font')),
      width = fakeEl.width();
    fakeEl.remove();
    return width;
  };
$.fn.autoresize = function(options) {
  options = $.extend({padding: 5, minWidth: 18, maxWidth: 10000}, options||{});
  $(this).on('input', function () {
    $(this).css('width', Math.min(options.maxWidth, Math.max(options.minWidth, $(this).textWidth() + options.padding)));
  }).trigger('input');
  return this;
}
$("input[type=text]").autoresize({padding: 5, minWidth: 18, maxWidth: 10000});
$("#inbp").autoresize({padding: 5, minWidth: 30, maxWidth: 10000});
$("#indr").autoresize({padding: 5, minWidth: 150, maxWidth: 10000});
