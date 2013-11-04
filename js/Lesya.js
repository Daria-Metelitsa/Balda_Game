function Player (name, count, state, word, list, total) {
	this.name = name; // имя игрока
	this.count = count; // счет за текущее слово
	this.state = true; // переменная отвечает за активность игрока
	this.word = word; // текущее слово
	this.list = list; // весь массив слов
	this.total = total; // общая сумма баллов
}


// создать игроков
var Player1 = new Player (name1, 0, true, "", [], 0);
var Player2 = new Player (name2, 0, false, "", [], 0);

// функция пропуска хода
function Pass (state1, state2) {
	if(state1 == true)
	{
		state1 = false;
		state2 = true;
	}
	if(state2 == true)
	{
		state2 = false;
		state1 = true;
	}
}

// функция смены игрока
function Change (player1, player2) {
		//проверяем не занято ли слово 
		
		//высчитываем count

	if(player1.state == true)
	{
		//добавить слово в общий массив слов
		player1.list[list.length] = player1.word;
		//подсчитать сумму очков
		player1.total = player1.total + count; 
		//сменить игрока
		player1.state = false;
		player2.state = true;
	}
	if(player2.state == true)
	
		player2.list[list.length] = player2.word;
		player2.total = player2.total + count; 
		player2.state = false;
		player1.state = true;
	}
}
// функция поиска, будем использовать как для поиска слова в массиве уже существующих слов
// так и для поиска слова в словаре

function find(array, value) 
{
	for(var i=0; i<array.length; i++) 
	{
		if (array[i] == value) return i;
	}
	return -1;
}
