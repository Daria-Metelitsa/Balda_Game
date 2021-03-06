/**
 * Created by Даша on 10.10.13.
 */

/* анонимная функция*/
$(function() {

  var firstAudio= new Audio();
  var secondAudio = new Audio();
  var thirdAudio = new Audio();
  //флаги для определения номера композиции
  var st1=false;
  var st2=false;
  var st3=false;
  firstAudio.src = "Sound1.ogg";
  secondAudio.src = "Sound2.ogg";
  thirdAudio.src = "Sound3.ogg";

//Загрузка сохраненных настроек при запуске игры
    if (isLocalStorageAvailable()) {
        if (localStorage.getItem('background') != null) {
            $('body').attr('style', localStorage.getItem('background'));
        }
      if (localStorage.getItem('sound') == 'on') {
          $('#soundON').attr("checked", "checked");
          var soundNumber = localStorage.getItem('audio');
          var st = localStorage.getItem('st');
          switch (soundNumber) {
              case 'first_audio':
                if (st = 'st2') st2=false;
                if (st = 'st3') st3=false;
                st1=true;
                firstAudio.play();
                $('#sound1').attr("checked", "checked");
              break;
              case 'second_audio':
                if (st = 'st1') st1=false;
                if (st = 'st3') st3=false;
                st2=true;
                secondAudio.play();
                $('#sound2').attr("checked", "checked");
              break;
              case 'third_audio':
                if (st = 'st1') st1=false;
                if (st = 'st2') st2=false;
                st3=true;
                thirdAudio.play();
                $('#sound3').attr("checked", "checked");
              break;
          }
      } else {
          $('#soundOFF').attr("checked", "checked");
      }
  }

    var array_letter_points = {
        'А': 1, 'Б': 2, 'В': 1, 'Г': 2,
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
    var player1; // хранится объект первого игрока
    var player2; // хранится объект второго игрока
    var input_mode = 'input_char';
    var word = "";
    var wordd = [];
    var charList = [];
    var input_char = null;
    var field_size = 0; //размер поля
	  var fields_chars_arr = []; //массив букв игрового поля
    var point_player1=0;
    var point_player2=0;
    var tur1=0;
    var tur2=0;
    var m=0;

    //получить очки за букву
    function getLetterPoints(letter){
        return array_letter_points[letter];
    }

    var string = [];// объявляем массив слов
    var bukva = [];//массив букв

    $.ajax({ url:"BALDAD.html", success: foo, dataType: "text" }); // заполняем массив слов
    function foo( text ) {
        string = text.split( /\s+/ );
    }

    //Целочисленный Random (случайное целое число от a до b включительно)
    function Random(a, b) {
        if ( !a && !b ) {
            return Math.round(Math.random());
        }

        if (a && !b) {
            b = a;
            a = 0;
        }

        if (a > b) {
            return Math.floor(b+Math.random()*(a-b+1));
        }
        else
        { return Math.floor(a+Math.random()*(b-a+1));}
    }

    //функция добавления начального слова
    function AddFirstWord(size)
    {
        var word;// слово
        var cc = 0;
        do
        {
            word = string[Random(0, 5996)];
            bukva=word.split('');
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
        var str2;
        var i=0;
        var ff = false;
        do{
            var c=0;
            str2=string[i].split('');
            if(s==str2.length)
            {
                for(var j=0; j<s; j++)
                {
                    if(str1[j]==str2[j])
                    {
                        c=c+1;
                    }
                }
                if(c==s){ ff=true;
                }
                else { i=i+1; }
            }
            else { i=i+1;}
        }while((i<5996) && (ff==false));
        return ff;
    }

  //функция создания слов дня
  function SlovoDnya()
  {
    for( var i=0;i<500; i++)
    {
      var r = Random(0,5996);
      wordd[i]= string[r];
    }
  }

  //проверка слова на слово дня
  //если SD=true, то увеличиваем кол-во очков
  function PoiskSD(slovo)
  {
    var st1 = slovo.split('');
    var s =st1.length;
    //alert(str1);
    var st2;
    var i=0;
    // var c=0;
    var SD = false;
    do{
      var c=0;
      st2=wordd[i].split('');
      //alert(st2);
      if(s==st2.length)
      {
        for(var j=0; j<s; j++)
        {
          if(st1[j]==st2[j])
          {
            c=c+1;
          }
        }
        if(c==s){ SD=true; //alert(c);
        }
        else { i=i+1; }
      }
      else { i=i+1;}
      //alert(c);
    }while((i<500) && (SD==false));
    // alert(SD);
    return SD;
  }

    // раскрасить поле в зависимости от блокировки
    function drawBlocked(){
        for (var i = 0; i < field_size; i++) {
            for (var j = 0; j < field_size; j++) {
                var $cell = $('#cell-' + i + '-' + j);

                if (input_char == null) {
                    // пропускаем не соприкасающиеся с заполнеными
                    if  ((i > 0 && $('#cell-' + (i-1) + '-' + j).text() != '')
                        || (j > 0 && $('#cell-' + i + '-' + (j-1)).text() != '')
                        || (i < field_size-1 && $('#cell-' + (i+1) + '-' + j).text() != '')
                        || (j < field_size-1 && $('#cell-' + i + '-' + (j+1)).text() != '')) {
                        $cell.html('<div style="font-size: 2.2em; text-align: center; background: #ebdaa3; height: 100%">' + $cell.text() + '</div>');
                    } else {
                        $cell.html('<div style="font-size: 2.2em; text-align: center; opacity: 0.5; background: #996633; height: 100%">' + $cell.text() + '</div>');
                    }
                }else {
                    var at5 = parseInt(last_change.attr('id').charAt(5));
                    var at7 = parseInt(last_change.attr('id').charAt(7));
                    if (at5 == i && at7 == j) {
                        $cell.html('<div style="font-size: 2.2em; text-align: center; background: #fba82b; height: 100%">' + $cell.text() + '</div>');
                        continue;
                    }
                    // пропускаем не соприкасающиеся с заполнеными (прошлая введеная не в счет)
                    if  ((i > 0 && $('#cell-' + (i-1) + '-' + j).text() != '' && (at5 != (i-1) || at7 != j))
                        || (j > 0 && $('#cell-' + i + '-' + (j-1)).text() != '' && (at5 != i || at7 != (j-1)))
                        || (i < field_size-1 && $('#cell-' + (i+1) + '-' + j).text() != '' && (at5 != (i+1) || at7 != j))
                        || (j < field_size-1 && $('#cell-' + i + '-' + (j+1)).text() != '' && (at5 != i || at7 != (j+1)))) {
                        $cell.html('<div style="font-size: 2.2em; text-align: center; background: #ebdaa3; height: 100%">' + $cell.text() + '</div>');
                    } else {
                        $cell.html('<div style="font-size: 2.2em; text-align: center; opacity: 0.5; background: #996633; height: 100%">' + $cell.text() + '</div>');
                    }
                }
            }
        }
    }

    function Start_Game(){
        field_size = $('input[name="field-size"]:checked').attr('data-field-size');
        var html = '';
        $('#word').html("Введите букву");
        AddFirstWord(field_size);
        $('#param').slideUp();
        $('#progress').slideDown(500);

        var center = Math.floor(field_size/2);
        for (var i = 0; i < field_size; i++) {
            html += '<tr>';
            for (var j = 0; j < field_size; j++) {

                html += '<td id="cell-' + i + '-' + j + '" class="cell cell-' + field_size + '"><div style="font-size: 2.2em; text-align: center">'+( center == i ? bukva[j] : '') + '</div></td>';
            }
            html += '</tr>';

            // инициализируем игроков
            var name = $('#player-1').val();
            player1 = new ClassPlayer(name.length ? name : 'Игрок 1', true, [], 0);

            name = $('#player-2').val();
            player2 = new ClassPlayer(name.length ? name : 'Игрок 2', false, [], 0);

            $('#progress-player-1').html(player1.name).addClass('player-active').removeClass('text-shadow');
            $('#progress-player-2').html(player2.name).addClass('text-disabled');

            $('#game-field').html(html);
            drawBlocked();
        }

    }

    //переход на страницу игрового процесса и генерация поля произвольного размера
    $(document).on({
        click: function() {
            field_size = $('input[name="field-size"]:checked').attr('data-field-size');

            $('#word').html("Введите букву");

            AddFirstWord(field_size);
            SlovoDnya();
            $('#param').slideUp();
            $('#progress').slideDown(500);

            var center = Math.floor(field_size/2);
            var html   = '';
            for (var i = 0; i < field_size; i++) {
                html += '<tr>';
                for (var j = 0; j < field_size; j++) {
                      html += '<td id="cell-' + i + '-' + j + '" class="cell cell-' + field_size + '"><div style="font-size: 2.2em; text-align: center">' + ( center == i ? bukva[j] : '') + '</div></td>';
                }
                html += '</tr>';
            }

            // инициализируем игроков
            var name = $('#player-1').val();
            player1 = new ClassPlayer(name.length ? name : 'Игрок 1', true, [], 0);

            name = $('#player-2').val();
            player2 = new ClassPlayer(name.length ? name : 'Игрок 2', false, [], 0);

            $('#progress-player-1').html(player1.name).addClass('player-active').removeClass('text-shadow');
            $('#progress-player-2').html(player2.name).addClass('text-disabled');

            $('#game-field').html(html);
            drawBlocked();
        }
    }, '#start-game');

    //переход на страницу игрового процесса сохраненной игры
    $(document).on({
        click: function() {
            if (isLocalStorageAvailable() && localStorage.getItem("save") == "yes") {
                field_size = localStorage.getItem("field_size");
                fields_chars_arr = JSON.parse(localStorage.getItem("fields_chars"));
                var html       = '';
                $('#word').html("Введите букву");

                $('#menu').slideUp();
                $('#progress').slideDown(500);

                for (var i = 0; i < field_size; i++) {
                    html += '<tr>';
                    for (var j = 0; j < field_size; j++) {
                        html += '<td id="cell-' + i + '-' + j + '" class="cell cell-' + field_size + '"><div style="font-size: 2.2em; text-align: center">' + fields_chars_arr[i][j] + '</div></td>';
                    }
                    html += '</tr>';
                }

                // инициализируем игроков
                player1 = JSON.parse(localStorage.getItem('player1'));
                player2 = JSON.parse(localStorage.getItem('player2'));

                if (player1.state == true) {
                    $('#progress-player-1').html(player1.name).addClass('player-active').removeClass('text-shadow');
                    $('#progress-player-2').html(player2.name).addClass('text-disabled');
                } else {
                    $('#progress-player-1').html(player1.name).addClass('text-disabled');
                    $('#progress-player-2').html(player2.name).addClass('player-active').removeClass('text-shadow');
                }
                $('#game-field').html(html);
                drawBlocked();
            }
        }
    }, '#continue');

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
        var ch1 = $('input[name="sound"]:checked').attr('id');
        var ch2 = $('input[name="soundcheck"]:checked').attr('id');
          if(ch1=="soundON"){
            if(ch2=="sound1")
            {
              if (st2==true)
              {
                secondAudio.pause();
                secondAudio.currentTime = 0;
                st2=false;
              }
              if(st3==true)
              {
                thirdAudio.pause();
                thirdAudio.currentTime = 0;
                st3=false;
              }

              firstAudio.play();
              st1=true;
            }
            else if(ch2=="sound2")
            {
              if(st1==true)
              {
                firstAudio.pause();
                firstAudio.currentTime = 0;
                st1=false;
              }
              if(st3==true)
              {
                thirdAudio.pause();
                thirdAudio.currentTime = 0;
                st3=false;
              }

              secondAudio.play();
              st2=true;
            }
            else
            {
              if(st1==true)
              {
                firstAudio.pause();
                firstAudio.currentTime = 0;
                st1=false;
              }
              if(st2==true)
              {
                secondAudio.pause();
                secondAudio.currentTime = 0;
                st2=false;
              }

              thirdAudio.play();
              st3=true;
            }
          }
          else{
            if(st1==true)
            {
              firstAudio.pause();
              firstAudio.currentTime = 0;
              st1=false;
            }
            else if(st2==true)
            {
              secondAudio.pause();
              secondAudio.currentTime = 0;
              st2=false;
            }
            else
            {
              thirdAudio.pause();
              thirdAudio.currentTime = 0;
              st3=false;
            }
          }
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
          $('#play1').html(player1.name);
          $('#play2').html(player2.name);
          $('#text1').val(player1.list.join('\n')+'\nОчки - '+genCount1());
          $('#text2').val(player2.list.join('\n')+'\nОчки - '+genCount2());
          $('#progress').slideUp();
          $('#statistics').slideDown();
        }
    }, '#statist');

    //вернуться из статистики игры в меню
    $(document).on({
        click: function() {
            $('#statistics').slideUp();
            $('#progress').slideDown();
        }
    }, '#return');

//Вывод очков одиночной игры //и поединка
    function Game_Over(){
        if(player1.total>player2.total){
            point_player1=point_player1+player1.total;
            point_player2=point_player2+player2.total;
            jConfirm (player1.name + " победил со счетом " + point_player1, 'ИГРА'+(tur1+tur2+1));
            player1.list=[];
            player1.total=0;
            player2.list=[];
            player2.total=0;
            tur1++;

            player1.state= true;
            player2.state=false;
            $('#progress-player-1').html(player1.name).addClass('player-active').removeClass('text-disabled');
            $('#progress-player-2').html(player2.name).addClass('text-disabled');
        } else {
            point_player1=point_player1+player1.total;
            point_player2=point_player2+player2.total;
            jConfirm (player2.name + " победил со счетом " + point_player2, 'ИГРА'+(tur1+tur2+1));
            point_player1=point_player1+player1.total;
            point_player2=point_player2+player2.total;
            player1.list=[];
            player1.total=0;
            player2.list=[];
            player2.total=0;
            tur2++;

            player2.state= true;
            player1.state=false;
            $('#progress-player-2').html(player2.name).addClass('player-active').removeClass('text-disabled');
            $('#progress-player-1').html(player1.name).addClass('text-disabled');

        }

    }

    //определение победителя
    //сообщения
    function Winner1() {
        jAlert(player1.name + ' выиграл со счетом - '+ point_player1, 'Игра окончена!', function(is_ok) {
            if (is_ok) {
                $('#progress').slideUp();
                $('#menu').slideDown();
                tur1=0;
                tur2=0;
                point_player1=0;
                point_player2=0;

            }
        });
    }

    function Winner2() {
        jAlert(player2.name + 'выиграл со счетом - '+ point_player2, 'Игра окончена!', function(is_ok) {
            if (is_ok) {
                $('#progress').slideUp();
                $('#menu').slideDown();
                tur1=0;
                tur2=0;
                point_player1=0;
                point_player2=0;
            }
        });
    }

    //Реализация функции сдаться
    function GameOver () {
        if(player1.state == true)
        {
            genCount2();
            jAlert (player2.name + " победил со счетом " + player2.total, 'ПОБЕДА!!!');
        }
        else
        {
            genCount1();
            jAlert (player1.name + " победил со счетом " + player1.total, 'ПОБЕДА!!!');
        }
        player1.list=[];
        player1.total=0;

        player2.list=[];
        player2.total=0;

        player1.list=[];
        player1.total=0;

        player2.list=[];
        player2.total=0;
        $('#word').html("Слово");
    }
    //всплывающее сообщение - сдаться
    $(document).on({
        click: function() {
      if($('#surrender').html() == 'Новое слово')
      {
        field_size = $('input[name="field-size"]:checked').attr('data-field-size');
        var html   = '';
        $('#word').html("Введите букву");

        AddFirstWord(field_size);
        SlovoDnya();

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

        $('#game-field').html(html);
        drawBlocked();
      }
      else
      {
        jConfirm('Вы уверены, что хотите сдаться ?', 'Сдаться?', function(is_ok) {
          if (is_ok) {
            GameOver();
            $('#surrender').text('Новое слово');
            $('#progress').slideUp();
            $('#menu').slideDown();
          }
        });
      }
    }
  }, '#surrender');

    // функция пропуска хода
    function Pass () {
        if(player1.state == true)
        {
            player1.state = false;
            player2.state = true;
            $('#progress-player-2').html(player2.name).addClass('player-active').removeClass('text-disabled');
            $('#progress-player-1').html(player1.name).addClass('text-disabled');
        }
        else
        {
            player2.state = false;
            player1.state = true;
            $('#progress-player-1').html(player1.name).addClass('player-active').removeClass('text-disabled');
            $('#progress-player-2').html(player2.name).addClass('text-disabled');
        }
    }

    //всплывающее сообщение - пропустить ход
    $(document).on({
        click: function() {
            jConfirm('Вы уверены, что хотите пропустить ход ?', 'Пропустить ход?', function(is_ok) {
                if (is_ok) {
                    Pass();
                }
            });
        }
    }, '#skip');

    //всплывающее сообщение - сохранить игру
    $(document).on({
        click: function() {
            jConfirm('Вы уверены, что хотите сохранить игру? (предыдущая сохраненная игра будет перезаписана)', 'Сохранить игру', function(is_ok) {
                if (is_ok) {
                    for (var i = 0; i < field_size; i++) {
                        fields_chars_arr[i] = [];
                        for (var j = 0; j < field_size; j++) {
                            fields_chars_arr[i][j] = $('#cell-' + i + '-' + j).text();
                        }
                    }
                    if (isLocalStorageAvailable()) {
                        localStorage.setItem('save', 'yes');
                        localStorage.setItem('player1', JSON.stringify(player1));
                        localStorage.setItem('player2', JSON.stringify(player2));
                        localStorage.setItem('fields_chars', JSON.stringify(fields_chars_arr));
                        localStorage.setItem('field_size', field_size);
                    }
                  $('#progress').slideUp();
                  $('#menu').slideDown();
                }
            });
        }
    }, '#save');

    //если есть сохраненная игра - делаем кнопку продолжить активной
    if (isLocalStorageAvailable() && localStorage.getItem("save") == 'yes') {
        $('#continue').prop('disabled', false);
    }

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
            isLocalStorageAvailable()? localStorage.setItem('background', $(this).attr('style')) : '';
        }
    }, '.picture');

    //переход на форму выбора буквы
    $(document).on({
        click: function() {
            var $this = $(this);
            var i = parseInt($this.attr('id').charAt(5));
            var j = parseInt($this.attr('id').charAt(7));
            if (input_mode == 'input_char') {
                // пропускаем заполненые
                if ($this.text() != '' && this != input_char) {
                    return;
                }

                if (input_char == null) {
                    // пропускаем не соприкасающиеся с заполнеными
                    if  ((i > 0 && $('#cell-' + (i-1) + '-' + j).text() != '')
                        || (j > 0 && $('#cell-' + i + '-' + (j-1)).text() != '')
                        || (i < field_size-1 && $('#cell-' + (i+1) + '-' + j).text() != '')
                        || (j < field_size-1 && $('#cell-' + i + '-' + (j+1)).text() != '')) {
                        last_click = $this;
                        input_char = this;
                        $('#progress').slideUp();
                        $('#letter').slideDown();
                    }
                } else {
                  var at5 = parseInt(last_change.attr('id').charAt(5));
                  var at7 = parseInt(last_change.attr('id').charAt(7));
                    // пропускаем не соприкасающиеся с заполнеными (прошлая введеная не в счет)
                    if  ((i > 0 && $('#cell-' + (i-1) + '-' + j).text() != '' && (at5 != (i-1) || at7 != j))
                        || (j > 0 && $('#cell-' + i + '-' + (j-1)).text() != '' && (at5 != i || at7 != (j-1)))
                        || (i < field_size-1 && $('#cell-' + (i+1) + '-' + j).text() != '' && (at5 != (i+1) || at7 != j))
                        || (j < field_size-1 && $('#cell-' + i + '-' + (j+1)).text() != '' && (at5 != i || at7 != (j+1)))) {
                        last_click = $this;
                        input_char = this;
                        $('#progress').slideUp();
                        $('#letter').slideDown();
                    }
                }

                //  input_mode = 'input_word';
            } else if (input_mode == 'input_word'){
                    if($this.text() != '') {
                    var i = parseInt($this.attr('id').charAt(5));
                    var j = parseInt($this.attr('id').charAt(7));
                    if (last_cell_i >= 0 && last_cell_j >=0) {
                        if (charList.length > 0 && charList[charList.length-1] == this) {
                            charList.pop();
                            if (charList.length == 0) {
                                last_cell_i = -1;
                                last_cell_j = -1;
                            } else {
                                last_cell_i = parseInt($(charList[charList.length-1]).attr('id').charAt(5));
                                last_cell_j = parseInt($(charList[charList.length-1]).attr('id').charAt(7));
                            }
                            word = word.substring(0, word.length - 1);
                            $('#word').html(word);
                            $this.html('<div style="font-size: 3em; text-align: center; background:#ebdaa3">' + $this.text() + '</div>');
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
                            word += $this.text();
                            last_cell_i = i;
                            last_cell_j = j;
                            charList.push(this);
                            if(this != input_char)
                            {   $this.html('<div style="font-size: 2.2em; text-align: center; background: #fbd252; height: 100%">' + $this.text() + '</div>');}
                        }

                        // лежат на одной строке
                        if(((j+1 == last_cell_j) || (j-1 == last_cell_j)) &&(i == last_cell_i)){
                            word += $this.text();
                            last_cell_i = i;
                            last_cell_j = j;
                            charList.push(this);
                            if(this != input_char)
                            {   $this.html('<div style="font-size: 2.2em; text-align: center; background: #fbd252; height: 100%">' + $this.text() + '</div>');}
                        }
                    }
                    else {
                        word += $this.text();
                        last_cell_i = i;
                        last_cell_j = j;
                        charList.push(this);
                        if(this != input_char)
                        {   $this.html('<div style="font-size: 2.2em; text-align: center; background: #fbd252; height: 100%">' + $this.text() + '</div>');}
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
            last_click.html('<div style="font-size: 2.2em; text-align: center;  background: #fba82b; height: 100%">' + obj.find('span').html() + '</div>');
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

    function isMiniGame() {
        var chance = 5 == field_size ? 20 : (6 == field_size ? 25 : 30),
            rand   = Random(0, 100),
            start  = Random(0, 100 - chance);

        return rand > start && rand <= start + chance;
    }

    function startMiniGame(is_player1) {
        var i = Random(0, riddle.length);
        jPrompt(riddle[i].text, '', 'Ура! Мини игра!', function(s_answer) {
            if ( null === s_answer ) {
                alert('Мини игра отменена!');
            } else if ( s_answer.toString().trim() == riddle[i].answer ) {
                alert('Ответ верный!');
                if ( is_player1 ) {
                    player1.list.push('bonus');
                } else {
                    player2.list.push('bonus');
                }
            } else {
                alert('Ответ не верный');
            }
        });
    }

    // нажатие на кнопку "OK"
    $(document).on({
        click: function() {
            var $surrender = $('#surrender');

            if( $surrender.html() == 'Новое слово' ) {
              $surrender.html('Сдаться');
            }

            $('#send-word').addClass('text-disabled ');

            if (input_mode == 'input_char') {
                input_mode = 'input_word';
                $('#word').html("Ваше слово");
            } else {
                if (charList.length <= 1) {
                    jConfirm('Размер слова должен быть минимум 2 буквы!', 'Недопустимый размер слова!');
                    return;
                }
                if (!checkInputCharInWord()) {
                    jConfirm('Выберите слово с учетом добавленной буквы!', 'Слово не содержит добавленную букву!');
                    return;
                }
                if (SearchRepeat(word)==true) {
                  jConfirm('Повтор слова', 'Слово уже существует!');
                  return;
                }
                // добавить проверку на наличие слова в словаре
                if(Poisk(word)==true){

                    if ( isMiniGame() || $(this).attr('data-mini-game') ) {
                        startMiniGame(player1.state);
                    }
                    win();
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
                    $('#word').html("Введите букву");
                }
                else {
                    jConfirm('Добавить слово в словарь', 'Слова нет в словаре', function(is_ok) {
                        if (is_ok) {
                            string.push(word);
                            nextPlayer();
                            word="";

                            input_char = null;
                            last_change = null;
                            last_cell_i = -1;
                            last_cell_j = -1;
                            input_mode = 'input_char';
                            $('#word').html("Введите букву");
                            for (var i = 0; i < charList.length; i++) {
                                $(charList[i]).html('<div style="font-size: 2.2em; text-align: center; background:#ebdaa3">' + $(charList[i]).text() + '</div>');
                            }
                            charList = [];
                            win();
                        }
                        else{
                            for (var i = 0; i < charList.length; i++) {
                                $(charList[i]).html('<div style="font-size: 2.2em; text-align: center; background:#ebdaa3">' + $(charList[i]).text() + '</div>');
                            }
                            last_change.html ('');
                            word="";
                            charList = [];
                            input_char = null;
                            last_change = null;
                            last_cell_i = -1;
                            last_cell_j = -1;
                            input_mode = 'input_char';
                            $('#word').html("Введите букву");
                        }
                    });
                }
                drawBlocked();
            }
        }
    }, '#send-word');

    function win(){
        var h=0;
        for (var i = 0; i < field_size; i++) {
            for (var j = 0; j < field_size; j++) {
                if  ( $('#cell-' + i + '-' + j).text() != ''){
                    h++;
                }
                else{
                }
            }
        }
        if(h/field_size==field_size)
        {
            genCount1();
            genCount2();

            if( ! $('input[name="battle"]:checked')){
                Game_Over();
                if(tur1>1 && (tur1-tur2)!=0)
                {
                    Winner1();
                }
                else{
                    Start_Game();
                }
                if(tur2>1&&(tur2-tur1)!=0)
                {
                    Winner2();
                }
                else{
                    Start_Game();
                }
            }
           else{
                Game_Over();
                $('#progress').slideUp();
                $('#menu').slideDown();
            }
        }
    }

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
        player1.total = 0;
        for (var i = 0; i < player1.list.length; i++)
        {
            if ( 'bonus' == player1.list[i] ) {
                player1.total++;
            }
            else {
                var word = player1.list[i];
                for (var j =0; j<word.length; j++)
                {
                    player1.total += getLetterPoints(word[j]);
                }
            }
        }
        return player1.total;
    }

    function genCount2 (){
        player2.total = 0;
        for (var i = 0; i < player2.list.length; i++)
        {
            if ( 'bonus' == player2.list[i] ) {
                player2.total++;
            } else {
                var word = player2.list[i];
                for (var j =0; j<word.length; j++)
                {
                    player2.total += getLetterPoints(word[j]);
                }
            }
        }
        return player2.total;
    }

    function SearchRepeat(slovo)
    {
        var ff = false;
        for (var i=0; i<player1.list.length; i++)
        {
            if (slovo == player1.list[i])
            {
                ff=true;
            }
        }
        for (var i=0; i<player2.list.length; i++)
        {
            if (slovo == player2.list[i])
            {
                ff=true;
            }
        }
        return ff;
    }

    //проверка на наличие локального хранилища в браузере
    function isLocalStorageAvailable() {
        try {
            return 'localStorage' in window && window['localStorage'] !== null;
        } catch (e) {
            return false;
        }
    }
});