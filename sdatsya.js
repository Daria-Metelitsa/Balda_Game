function Player (name, count, state, word, list, total) {
	this.name = name; // им€ игрока
	this.count = count; // счет за текущее слово
	this.state = true; // переменна€ отвечает за активность игрока
	this.word = word; // текущее слово
	this.list = list; // весь массив слов
	this.total = total; // обща€ сумма баллов
}


// создать игроков
var Player1 = new Player (name1, 0, true, "", [], 0);
var Player2 = new Player (name2, 0, false, "", [], 0);


// функци€ сдатьс€
function sdatsya (Player1, Player2) {
if(Player.state == true)
{
alert(Player2.Name +" победил со счетом "+ Player2.ochki);
Player1.name = "";
Player1.count=0; 
Player1.state = true;
Player1.word="";
Player1.list=[];
Player1.total=0;

Player2.name = "";
Player2.count=0; 
Player2.state = true;
Player2.word="";
Player2.list=[];
Player2.total=0;
}
if(Player1.state== true)
{
alert(Player1.Name +" победил со счетом "+ Player1.ochki);
Player1.name = "";
Player1.count=0; 
Player1.state = true;
Player1.word="";
Player1.list=[];
Player1.total=0;

Player2.name = "";
Player2.count=0; 
Player2.state = true;
Player2.word="";
Player2.list=[];
Player2.total=0;
}
}

//функци€ подсчета статистики игрока
function statistic (Player1, Player2)
{
var statistic=;
 for(int i=0; i<list.length(); i++)
{
	statistic+= word.length; 
}
}


