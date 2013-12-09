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
  var active_player = 1; // какой игрок в текущий момент активен
  var last_click = null;
  var last_change = null;
  var last_cell_i = -1;
  var last_cell_j = -1;
  var player1; // хранится объект первого игрока
  var player2; // хранится объект второго игрока
  var input_mode = 'input_char';
  var word = "";
  var charList = [];
  var input_char = null;
  var field_size = 0; //размер поля

  //получить очки за букву
  function getLetterPoints(letter){
    return array_letter_points[letter];
  }

  var string = [];// объявляем массив слов
  var bukva = [];//массив букв
  var r;//переменная для выбора случайного слова
  $.ajax({ url:"BALDAD.html", success: foo, dataType: "text" }); // заполняем массив слов
  function foo( text ) {
    string = text.split( /\s+/ );
  }

  //Целочисленный Random (случайное целое число от a до b включительно)
  function Random(a,b) {
    //var r = 0;
    if (!a && !b) return Math.round(Math.random());
    if (a && !b) {
      b=a;
      a=0;
    }
    if (a > b)
    {
      r = Math.floor(b+Math.random()*(a-b+1));
    }
    else
    { r = Math.floor(a+Math.random()*(b-a+1));}
    return r;
  }

  //функция добавления начального слова
  function AddFirstWord(size)
  {
    var word;// слово
    var cc = 0;
    do
    {
      Random(0,5996);
      word = string[r];
      bukva=word.split('');
      //alert(bukva);
      if (bukva.length==size)
      {
        cc=1;
      }
    }while( cc == 0);
    return bukva;
  }

  //поиск слова в словаре
  function Poisk(slovo)
  {
    var str1 = slovo.split('');
    var s =str1.length;
    //alert(str1);
    var str2;
    var i=0;
    // var c=0;
    var ff = false;
    do{
      var c=0;
      str2=string[i].split('');
      //alert(str2);
      if(s==str2.length)
      {
        for(var j=0; j<s; j++)
        {
          if(str1[j]==str2[j])
          {
            c=c+1;
          }
        }
        if(c==s){ ff=true; //alert(c);
        }
        else { i=i+1; }
      }
      else { i=i+1;}
      //alert(c);
    }while((i<5996) && (ff==false));
      return ff;
    /*if(ff==true)
    {
      alert (slovo);
    }*/
  }

    // расскрасить поле в зависимости от блокировки
    function drawBlocked(){
        for (var i = 0; i < field_size; i++) {
            for (var j = 0; j < field_size; j++) {
                if (input_char == null) {
                    // пропускаем не соприкасающиеся с заполнеными
                    if  ((i > 0 && $('#cell-' + (i-1) + '-' + j).text() != '')
                        || (j > 0 && $('#cell-' + i + '-' + (j-1)).text() != '')
                        || (i < field_size-1 && $('#cell-' + (i+1) + '-' + j).text() != '')
                        || (j < field_size-1 && $('#cell-' + i + '-' + (j+1)).text() != '')) {
                        $('#cell-' + i + '-' + j).html('<div style="font-size: 3em; text-align: center; background: #ebdaa3; height: 100%">' + $('#cell-' + i + '-' + j).text() + '</div>');
                    } else {
                        $('#cell-' + i + '-' + j).html('<div style="font-size: 3em; text-align: center; opacity: 0.5; background: #996633; height: 100%">' + $('#cell-' + i + '-' + j).text() + '</div>');
                    }
                }else {
                    if (last_change.attr('id').charAt(5) * 1 == i && last_change.attr('id').charAt(7) * 1 == j) {
                        $('#cell-' + i + '-' + j).html('<div style="font-size: 3em; text-align: center; background: #fba82b; height: 100%">' + $('#cell-' + i + '-' + j).text() + '</div>');
                        continue;
                    }
                    // пропускаем не соприкасающиеся с заполнеными (прошлая введеная не в счет)
                    if  ((i > 0 && $('#cell-' + (i-1) + '-' + j).text() != '' && (last_change.attr('id').charAt(5) * 1 != (i-1) || last_change.attr('id').charAt(7) * 1 != j))
                        || (j > 0 && $('#cell-' + i + '-' + (j-1)).text() != '' && (last_change.attr('id').charAt(5) * 1 != i || last_change.attr('id').charAt(7) * 1 != (j-1)))
                        || (i < field_size-1 && $('#cell-' + (i+1) + '-' + j).text() != '' && (last_change.attr('id').charAt(5) * 1 != (i+1) || last_change.attr('id').charAt(7) * 1 != j))
                        || (j < field_size-1 && $('#cell-' + i + '-' + (j+1)).text() != '' && (last_change.attr('id').charAt(5) * 1 != i || last_change.attr('id').charAt(7) * 1 != (j+1)))) {
                        $('#cell-' + i + '-' + j).html('<div style="font-size: 3em; text-align: center; background: #ebdaa3; height: 100%">' + $('#cell-' + i + '-' + j).text() + '</div>');
                    } else {
                        $('#cell-' + i + '-' + j).html('<div style="font-size: 3em; text-align: center; opacity: 0.5; background: #996633; height: 100%">' + $('#cell-' + i + '-' + j).text() + '</div>');
                    }
                }
            }
        }
    }

  //переход на страницу игрового процесса и генерация поля произвольного размера
  $(document).on({
    click: function() {
      field_size = $('input[name="field-size"]:checked').attr('data-field-size');
      var html       = '';
        $('#word').html("Введите букву");

      AddFirstWord(field_size);
      // var f= "РАНЬ";
      //Poisk(f);
      // alert (string);
      $('#param').slideUp();
      $('#progress').slideDown(500);

      var center = Math.floor(field_size/2);
      for (var i = 0; i < field_size; i++) {
        html += '<tr>';
        for (var j = 0; j < field_size; j++) {
          html += '<td id="cell-' + i + '-' + j + '" class="cell cell-' + field_size + '"><div style="font-size: 3em; text-align: center">' + ( center == i ? bukva[j] : '') + '</div></td>';
        }
        html += '</tr>';
      }

      // инициализируем игроков
      var name = $('#player-1').val();
      player1 = new ClassPlayer(name.length ? name : 'Игрок 1', true, [], 0);
       // player1.list = ["слово"];

      name = $('#player-2').val();
      player2 = new ClassPlayer(name.length ? name : 'Игрок 2', false, [], 0);
      //  player2.list = ["словарик"];

      $('#progress-player-1').html(player1.name).addClass('player-active').removeClass('text-shadow');
      $('#progress-player-2').html(player2.name).addClass('text-disabled');

      $('#game-field').html(html);
        drawBlocked();
    }
  }, '#start-game');

  //переход из меню в окно настройки игры
  $(document).on({
    click: function() {
      $('#menu').slideUp();
      $('#param').slideDown();
    }
  }, '#game-param');

  //переход из меню в справку
  $(document).on({
    click: function() {
      $('#menu').slideUp();
      $('#info').slideDown();
    }
  }, '#reference');

  //переход из справки в меню
  $(document).on({
    click: function() {
      $('#info').slideUp();
      $('#menu').slideDown();
    }
  }, '#backfrominfo');

  //вернуться из настроек игры в меню
  $(document).on({
    click: function() {
      $('#param').slideUp();
      $('#menu').slideDown();
    }
  }, '#to-main');

  //переход из игры в окно параметров игры
  $(document).on({
    click: function() {
      last_click = $(this);
      $('#menu').slideUp();
      $('#setting').slideDown();
    }
  }, '#settings');

  //переход из игры в окно параметров игры
  $(document).on({
    click: function() {
      last_click = $(this);
      $('#progress').slideUp();
      $('#setting').slideDown();
    }
  }, '#setting_game');

  //переход из окна параметров игры в меню (с сохранением параметров)
  $(document).on({
    click: function() {
      $('#setting').slideUp();
      if ( 'settings' == last_click.attr('id') ) {
        $('#menu').slideDown();
      } else {
        $('#progress').slideDown();
      }
    }
  }, '#backfromsettingOK');

  //переход из окна параметров игры в меню (без сохрания параметров)
  $(document).on({
    click: function() {
      $('#setting').slideUp();
      $('#menu').slideDown();
    }
  }, '#backfromsettingNext');

  //переход из игры в окно статитики
  $(document).on({
    click: function() {
        /*var text = document.getElementById("#text1");
        for (var i = 0 ; i < player1.list.length; i++)
        {
            text.innerHTML(player1.list[i]);
        }
        */
        jAlert (player1.name + ": "+ player1.list+ ";"+"<br />"+player2.name + ": "+ player2.list+ ";"+"<br />" ,player1.name + " "+genCount1() + " очков, " +player2.name + " "+genCount2() + " очков");
        //
      $('#statistics').slideUp();
      $('#progress').slideDown();
    }
  }, '#statist');

    //Реализация функции сдаться
    function GameOver () {
        if(player1.state == true)
        {
            genCount2();
            jAlert (player2.name + " победил со счетом " + player2.total, 'ПОБЕДА!!!');
            player1.list=[];
            player1.total=0;

            player2.list=[];
            player2.total=0;
        }
        else
        {
            genCount1();
            jAlert (player1.name + " победил со счетом " + player1.total, 'ПОБЕДА!!!');

            player1.list=[];
            player1.total=0;

            player2.list=[];
            player2.total=0;
        }
    }
  //всплывающее сообщение - сдаться
  $(document).on({
    click: function() {
      jConfirm('Вы уверены, что хотите сдаться ?', 'Сдаться?', function(is_ok) {
          if (is_ok) {
              GameOver();
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
          //ф-я
        }
      });
    }
  }, '#skip');

//всплывающее сообщение - пауза
  $(document).on({
    click: function() {
      jAlert('Передохнем?', 'Пауза');
    }
  }, '#pause');

  //смена фона
  $(document).on({
    click: function() {
      console.log($(this));
      $('body').attr('style', $(this).attr('style'));
    }
  }, '.picture');

    //переход на форму выбора буквы
    $(document).on({
        click: function() {
            var i = $(this).attr('id').charAt(5) * 1;
            var j = $(this).attr('id').charAt(7) * 1;
            if (input_mode == 'input_char') {
                // пропускаем заполненые
                if ($(this).text() != '' && this != input_char) {
                    return;
                }

                if (input_char == null) {
                    // пропускаем не соприкасающиеся с заполнеными
                    if  ((i > 0 && $('#cell-' + (i-1) + '-' + j).text() != '')
                        || (j > 0 && $('#cell-' + i + '-' + (j-1)).text() != '')
                        || (i < field_size-1 && $('#cell-' + (i+1) + '-' + j).text() != '')
                        || (j < field_size-1 && $('#cell-' + i + '-' + (j+1)).text() != '')) {
                        last_click = $(this);
                        input_char = this;
                        $('#progress').slideUp();
                        $('#letter').slideDown();
                    }
                } else {
                    // пропускаем не соприкасающиеся с заполнеными (прошлая введеная не в счет)
                    if  ((i > 0 && $('#cell-' + (i-1) + '-' + j).text() != '' && (last_change.attr('id').charAt(5) * 1 != (i-1) || last_change.attr('id').charAt(7) * 1 != j))
                        || (j > 0 && $('#cell-' + i + '-' + (j-1)).text() != '' && (last_change.attr('id').charAt(5) * 1 != i || last_change.attr('id').charAt(7) * 1 != (j-1)))
                        || (i < field_size-1 && $('#cell-' + (i+1) + '-' + j).text() != '' && (last_change.attr('id').charAt(5) * 1 != (i+1) || last_change.attr('id').charAt(7) * 1 != j))
                        || (j < field_size-1 && $('#cell-' + i + '-' + (j+1)).text() != '' && (last_change.attr('id').charAt(5) * 1 != i || last_change.attr('id').charAt(7) * 1 != (j+1)))) {
                        last_click = $(this);
                        input_char = this;
                        $('#progress').slideUp();
                        $('#letter').slideDown();
                    }
                }

              //  input_mode = 'input_word';
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
                            if(this != input_char)
                            {   $(this).html('<div style="font-size: 3em; text-align: center; background: #fbd252; height: 100%">' + $(this).text() + '</div>');}
                        }

                        // лежат на одной строке
                        if(((j+1 == last_cell_j) || (j-1 == last_cell_j)) &&(i == last_cell_i)){
                            word += $(this).text();
                            last_cell_i = i;
                            last_cell_j = j;
                            charList.push(this);
                            if(this != input_char)
                            {   $(this).html('<div style="font-size: 3em; text-align: center; background: #fbd252; height: 100%">' + $(this).text() + '</div>');}
                        }
                    }
                    else {
                        word += $(this).text();
                        last_cell_i = i;
                        last_cell_j = j;
                        charList.push(this);
                        if(this != input_char)
                        {   $(this).html('<div style="font-size: 3em; text-align: center; background: #fbd252; height: 100%">' + $(this).text() + '</div>');}
                    }
                }
                $('#word').html(word);
                $('#send-word').removeClass('text-disabled ');
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
            last_click.html('<div style="font-size: 3em; text-align: center;  background: #fba82b; height: 100%">' + obj.find('span').html() + '</div>');
            last_click.addClass('');
            last_change = last_click;
            $('#send-word').removeClass('text-disabled ');
            $('#letter').slideUp();
            $('#progress').slideDown();
        }
    }, '.letter');

    // проверить вхождение добавленной буквы в слово
    function checkInputCharInWord() {
        for (var i = 0; i < charList.length; i++) {
            if (charList[i] == input_char) {
                return true;
            }
        }
        return false;
    }

    // нажатие на кнопку "OK"
    $(document).on({
        click: function() {
            $('#send-word').addClass('text-disabled ');
            if (input_mode == 'input_char') {
                input_mode = 'input_word';
                $('#word').html("Ваше слово");
            } else {
                if (charList.length <= 1) {
                   // alert("Размер слова должен быть минимум 2 буквы!");
                    jConfirm('Размер слова должен быть минимум 2 буквы!', 'Недопустимый размер слова!');
                    return;
                }
                // добавить проверку на наличие слова в словаре
                if(Poisk(word)==true){
                    if (!checkInputCharInWord()) {
                   // alert("Слово не содержит добавленную букву!");
                        jConfirm('Выберите слово с учетом добавленной буквы!', 'Слово не содержит добавленную букву!');
                    return;
                }
                nextPlayer();
                word = "";
                for (var i = 0; i < charList.length; i++) {
                    $(charList[i]).html('<div style="font-size: 3em; text-align: center; background:#ebdaa3">' + $(charList[i]).text() + '</div>');
                }
                charList = [];
                input_char = null;
                last_change = null;
                last_cell_i = -1;
                last_cell_j = -1;
                input_mode = 'input_char';
                $('#word').html(word);
                $('#word').html("Введите букву");}
                else {
                  //alert("Слово не содержится в словаре!");
                    jAlert('Проверьте правильность выбранного слова!', 'Слово не содержится в словаре!');
                    return;}
            }
            drawBlocked();
        }
    }, '#send-word');

    function nextPlayer() {
        if(player1.state==true){
        player2.state= true;
        player1.state=false;
            player1.list.push(word);
            $('#progress-player-2').html(player2.name).addClass('player-active').removeClass('text-disabled');
            $('#progress-player-1').html(player1.name).addClass('text-disabled');
        } else {
        player1.state= true;
        player2.state=false;
            player2.list.push(word);
            $('#progress-player-1').html(player1.name).addClass('player-active').removeClass('text-disabled');
            $('#progress-player-2').html(player2.name).addClass('text-disabled');
        }
    }

    //функция подсчета общего количества букв
    function genCount1 (){
        for (var i =0; i<player1.list.length; i++)
        {
            player1.total =player1.total + player1.list[i].length;
        }
        return player1.total;
    }
    function genCount2 (){
        for (var i =0; i< player2.list.length; i++)
        {
            player2.total =player2.total + player2.list[i].length;
        }
        return player2.total;
    }

})