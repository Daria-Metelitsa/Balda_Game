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
  var last_change = null;
  var last_cell_i = -1;
  var last_cell_j = -1;
  var input_mode = 'input_char';
  var word = "";
  var charList = [];

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
            //пока нет слова из словаря для примера
            var c='';
            if(i==2){
                if(j==0) c='С';
                if(j==1) c='Л';
                if(j==2) c='О';
                if(j==3) c='В';
                if(j==4) c='О';
            }
           // html += '<td id="cell-' + i + '-' + j + '" class="cell cell-' + field_size + '"> <div style="font-size: 3em; text-align: center;">' + c + '</div> </td>';
            html += '<td id="cell-' + i + '-' + j + '" class="cell cell-' + field_size + '"><div style="font-size: 3em; text-align: center">' + c + '</div></td>';
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

  //вернуться из настроек игры в меню
  $(document).on({
    click: function() {
      $('#param').slideUp();
      $('#menu').slideDown();
    }
  }, '#to-main');

  //переход из игры в окно статитики
  $(document).on({
    click: function() {
      $('#progress').slideUp();
      $('#statistics').slideDown();
    }
  }, '#statist');

  //переход из статистики в окно игры
  $(document).on({
    click: function() {
      $('#statistics').slideUp();
      $('#progress').slideDown();
    }
  }, '#return');

  //всплывающее сообщение - сдаться
  $(document).on({
    click: function() {
      jConfirm('Вы уверены, что хотите сдаться ?', 'Сдаться?', function(is_ok) {
        if (is_ok) {
          $('#progress').slideUp();
          $('#menu').slideDown();
        }
      });
    }
  }, '#surrender');

//всплывающее сообщение - пропустить ход
  $(document).on({
    click: function() {
      jConfirm('Вы уверены, что хотите пропустить ход ?', 'Пропустить ход?', function(is_ok) {
        if (is_ok) {
          $('#progress').slideUp();
          $('#progress').slideDown();
        }
      });
    }
  }, '#skip');

    //переход на форму выбора буквы
    $(document).on({
        click: function() {
            if (input_mode == 'input_char') {
                last_click = $(this);
                $('#progress').slideUp();
                $('#letter').slideDown();
                input_mode = 'input_word';
            } else if (input_mode == 'input_word'){
                if($(this).text() != '') {
                    var i = $(this).attr('id').charAt(5) * 1;
                    var j = $(this).attr('id').charAt(7) * 1;
                    if (last_cell_i >= 0 && last_cell_j >=0) {
                        if (charList.length > 0 && charList[charList.length-1] == this) {
                            charList.pop();
                            if (charList.length == 0) {
                                last_cell_i = -1;
                                last_cell_j = -1;
                            } else {
                                last_cell_i = $(charList[charList.length-1]).attr('id').charAt(5) * 1;
                                last_cell_j = $(charList[charList.length-1]).attr('id').charAt(7) * 1;
                            }
                            word = word.substring(0, word.length - 1);
                            $('#word').html(word);
                            $(this).html('<div style="font-size: 3em; text-align: center; background:#ebdaa3">' + $(this).text() + '</div>');
                            return;
                        } else {
                        //буква входит в слово
                        for (var k=0; k < charList.length; k++){
                            if (charList[k] == this) {
                                return;
                            }
                        }
                        }
                        //лежат на одном столбце
                        if(((i+1 == last_cell_i) || (i-1 == last_cell_i)) &&(j == last_cell_j)){
                            word += $(this).text();
                            last_cell_i = i;
                            last_cell_j = j;
                            charList.push(this);
                            $(this).html('<div style="font-size: 3em; text-align: center; background: #fbd252">' + $(this).text() + '</div>');
                        }

                        // лежат на одной строке
                        if(((j+1 == last_cell_j) || (j-1 == last_cell_j)) &&(i == last_cell_i)){
                            word += $(this).text();
                            last_cell_i = i;
                            last_cell_j = j;
                            charList.push(this);
                            $(this).html('<div style="font-size: 3em; text-align: center; background: #fbd252">' + $(this).text() + '</div>');
                        }
                    }
                    else {
                        word += $(this).text();
                        last_cell_i = i;
                        last_cell_j = j;
                        charList.push(this);
                        $(this).html('<div style="font-size: 3em; text-align: center; background: #fbd252">' + $(this).text() + '</div>');
                    }
                }
                $('#word').html(word);
            }
        }
    }, '.cell');

  //переход обратно на форму с игрой (из формы выбора буквы)
  $(document).on({
    click: function() {
      var obj = $(this);
        if(last_change != null) {
            last_change.html ('');
        }
      last_click.html('<div style="font-size: 3em; text-align: center; background: #f8ac1f">' + obj.find('span').html() + '</div>');
      last_click.addClass('');
        last_change = last_click;
      $('#letter').slideUp();
      $('#progress').slideDown();
    }
  }, '.letter');
})