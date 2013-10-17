/**
 * Created by Даша on 10.10.13.
 */

/* анонимная функция*/
$(function() {

  var array_letter_points = {
    'A': 1, 'Б': 2, 'В': 1, 'Г': 2,
    'Д': 1, 'Е': 1, 'Ж': 3, 'З': 3,
    'И': 1, 'Й': 3, 'К': 1, 'Л': 1,
    'М': 1, 'Н': 1, 'О': 1, 'П': 1,
    'Р': 1, 'С': 1, 'Т': 1, 'У': 2,
    'Ф': 4, 'Х': 3, 'Ц': 4, 'Ч': 3,
    'Ш': 4, 'Щ': 4, 'Ъ': 5, 'Ы': 3,
    'Ь': 3, 'Э': 5, 'Ю': 3, 'Я': 2
  };

  //последний объект, на котором был произведен клик
  var last_click = null;

  //получить очки за букву
  function getLetterPoints(letter){
    return array_letter_points[letter];
  }

  //переход на страницу игрового процесса и генерация поля произвольного размера
  $(document).on({
    click: function() {
      var field_size = $('input[name="field-size"]:checked').attr('data-field-size');
      var html       = '';

      $('#param').slideUp();
      $('#progress').slideDown(500);

      for (var i = 0; i < field_size; i++) {
        html += '<tr>';
        for (var j = 0; j < field_size; j++) {
          html += '<td id="cell-' + i + '-' + j + '" class="cell cell-' + field_size + '"> ' + i + '-' + j + ' </td>';
        }
        html += '</tr>';
      }

      $('#game-field').html(html);
    }
  }, '#start-game');

  //переход из меню в окно настройки игры
  $(document).on({
    click: function() {
      $('#menu').slideUp();
      $('#param').slideDown();
    }
  }, '#game-param');

  //вернуться из настроек игры в главное меню
  $(document).on({
    click: function() {
      alert(1);
      $('#menu').slideUp();
      $('#param').slideDown();
    }
  }, '#to-main');

  //переход на форму выбора буквы
  $(document).on({
    click: function() {
      last_click = $(this);
      $('#progress').slideUp();
      $('#letter').slideDown();
    }
  }, '.cell');

  //переход обратно на форму с игрой (из формы выбора буквы)
  $(document).on({
    click: function() {
      var obj = $(this);
      last_click.html(obj.find('span').html());
      last_click.addClass('');
      $('#letter').slideUp();
      $('#progress').slideDown();
    }
  }, '.letter');
})