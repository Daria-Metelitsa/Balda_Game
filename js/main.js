/**
 * Created by Даша on 10.10.13.
 */

/* анонимная функция*/
$(function() {
  $(document).on({
    click: function() {
      var field_size = $('input[name="field-size"]:checked').attr('data-field-size');

      $('body').load('/balda/game_process.html #main', function() {
        var html = '';

        for (var i = 0; i < field_size; i++) {
          html += '<tr>';
          for (var j = 0; j < field_size; j++) {
            html += '<td id="cell-' + i + '-' + j + '" class="cell cell-' + field_size + '">rere</td>';
          }
          html += '</tr>';
        }

        $('#game-field').html(html);
      });
    }
  }, '#start-game');

  $(document).on({
    touchmove: function(event) {
      alert('touch');
    },
    click: function() {
      $('body').load('/balda/game_param.html #main', function() {
      });
    }
  }, '#game-param');

  $(document).on({
    click: function() {
      $('body').load('/balda/game_menu.html #main', function() {
      });
    }
  }, '#to-main');

  $('#to-main').click();

})