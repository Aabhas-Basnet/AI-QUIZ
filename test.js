<!DOCTYPE html>

<html lang="en">
<head>
<title>Quiz</title>
<link rel="stylesheet" href="game.css">
</head>

<body> 
<form><button class = "button" type ="submit" id="back" formaction="Index.html">BACK</button></form>

<center>
<div class="bg" id="quiz">

<div class="ST_details">

<div class="sec">
<h2>Score</h2>
<h2 id="score"></h2>
</div>

<div class="sec">
<h2>Time</h2>
<h2 id="time"></h2>
</div>

</div>

<canvas id="can" width="900" height="500" style="border:1px solid #000000;" ></canvas>
<button id='answer' class="button" >SPEAK HERE</button>

</div>

</center>

</body>

	
<script>

var can= document.getElementById("can").getContext("2d");
const button = document.getElementById('answer');


right= new Audio("AUDIO/right.mp3");
wrong= new Audio("AUDIO/wrong.mp3");
TimeOut= new Audio("AUDIO/TimeOut.mp3");
Go= new Audio("AUDIO/Go.wav");
clap2= new Audio("AUDIO/clap2.mp3");
clap1= new Audio("AUDIO/clap1.mp3");

var Time = 20;
var RA = false;
var temp = [[],[],[],[],[],[],[],[],[],[]]; 
var missed_word = [];
var score = 0;


var GameOver = false;
var QuestionNum =0;

var frameCount =0;
var WIDTH = 1000;
var HEIGHT = 975;

var Words = [["S","E","N","S","O","R"],
             ["A","C","T","U","A","T","O","R"],
			 ["C","O","N","E","C","T","I","V","I","T","Y"],
			 ["C","L","O","U","D"],
			 ["W","I","N","D","O","W","S"],
			 ["H","U","M","I","D","I","T","Y"],
			 ["R","O","U","T","E","R"],
			 ["I","N","T","E","L","L","I","G","E","N","C","E"],
			 ["Z","W","A","V","E"],
			 ["P","R","O","T","O","C","O","L"]];
	
	
var Hints = [[" A device that detects the change in the environtment and responds to some output in the other system"],
             [" A device or component of machine responsible for moving and controling a mechanism or a system "],
             [" An IoT technology that encourages by bringing together everyday obejects to Iot devices"],
			 [" A huge buffer space where numerous amount of digital data can be stored through internet"],
			 [" What is the operating system that is required for Arduino IDE to function ?"],
			 [" A type of sensor that can detect the amount of water present in air to find the moisture level."],
			 [" A device that receives information from many points on the network and transmits it to another network"],
			 [" Which characteristics involve the facility the thing to respond in an intelligent way to a particular situation?"],
			 [" A wireless communication protocol with the range of 30 to 100m which is especially used in home automation "],
			 [" It is a standard language where two entities can communicate with each other."]];

Copy = function(temp,missed_word){
    
	Math.random();

	var i = 0;
	   
	while (i < Words.length){
	    var Wordnum = (Math.floor(Math.random()*parseInt(Words[i].length)));
		missed_word.push(Words[i][Wordnum]);
		
	    for (j in Words[i]){
     	   
		    if (Words[i][j] == Words[i][Wordnum]){
			    temp[i].push("_");
		    }else{
			    temp[i].push((Words[i][j]));
		    }
	    }

		i++;
    }
}

	
display = function(entity){
    var s =" ";
    
	for (i=0; i < entity.length; i++){
     	s = s + entity[i] + " ";
	}
	can.font = '40px italic';
	can.fillStyle= 'white';
    can.fillText(s,360,200);
	can.fillStyle= 'yellow';
	can.font = '40px italic';
}

displayH = function(entity){
    var s =" ";
    
	for (i=0; i < entity.length; i++){
     	s = s + entity[i] + "\n";
	}
	can.font = '20px italic';
    can.fillText(s,100,300);
	can.font = '40px italic';
}

DisplayAnswer = function(entity){
    var x = 0;
    var y = 0;
	
	for (i=0; i < entity.length; i++){
	    
		var s =" ";
	    
		for (j = 0; j<entity[i].length; j++){
     	   s = s + entity[i][j] + "";
		}
		can.font="20px italic";
		
		if (i%2==0){
		 can.fillText(s,350,250+x);
		 x += 50;
		}else{
		 can.fillText(s,550,250+y);
		 y += 50;
		}
	}

}



Update = function(){
   
   if (GameOver){
      DisplayAnswer(Words);
	  
      can.fillStyle= 'yellow';
	  can.font = '50px Italic'
	  can.fillText('GAME OVER',350,150);
	  button.remove();
	  checkScore(score);
	  
	  frameCount++;
	  
	  if(frameCount%200==0){
	    location.reload();
	  }
	  
	  return;
   }else{

   UpdateQuestion();

   
   if(frameCount%25 ==0){
      can.clearRect(950,10,1000,50)
      Time--;
   }
   if (frameCount%500 == 0){
          TimeOut.play();
		  can.clearRect(0,0,WIDTH,HEIGHT);
		  QuestionNum++;
		  Time = 20;	  
	}
	
	if (RA){
	   right.play();
	   can.clearRect(0,0,WIDTH,HEIGHT);
	   score += 10;
	   QuestionNum++;
	   Time = 20;
	   frameCount = 0;
	   RA = false;
	   
	}
	
	if (QuestionNum >= temp.length){
	   GameOver = !GameOver;
	}
	
	document.getElementById("time").innerHTML = Time;
	document.getElementById("score").innerHTML = score;

}}

UpdateQuestion = function(){

    display(temp[QuestionNum]);
	displayH(Hints[QuestionNum]);
	frameCount++;	  
}

TakingInput = function(){
	
    if(GameOver){
	 return;
	}

    var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
    var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList;

    var grammar = '#JSGF V1.0;'

    var recognition = new SpeechRecognition();
	var speechRecognitionList = new SpeechGrammarList();
	speechRecognitionList.addFromString(grammar, 1);
	recognition.grammars = speechRecognitionList;
	recognition.lang = 'en-US';
	recognition.interimResults = false;

	recognition.onresult = function(event) {
        var last = event.results.length - 1;
		var command = event.results[last][0].transcript;
		console.log(command);
		Answer = command.charAt(0).toLowerCase();
		TakeAnswer(Answer);
    };

    recognition.onspeechend = function() {
     	recognition.stop();
    };

    recognition.onerror = function(event) {
		can.font = "20px Italic";
        can.fillText( 'ERROR OCCURED IN RECOGNITION: ' + event.error,300,900);
		can.font= '40px Italic';
	}        

    document.querySelector('#answer').addEventListener('click', function(){
        recognition.start();	
		can.clearRect(298,780,434,790);		
    });
	
	
}

TakeAnswer = function(Ans){
   
    var Ans1 = Ans.toUpperCase();
	RA = checkAnswer(Ans1,missed_word[QuestionNum]);
	
}

check = function(a,m){

	if (a == m){
	   return true;
	}else{
	 return false;
	}
}

checkScore = function(sc){
    
	if ( sc >= 90 ){
	   can.fillText(" BRAVO !!!",370,800);
	   clap1.play();
	}
	
	if ( sc < 90 && sc >=60){
	   can.fillText("  GOOD !!!",370,800);
	   clap2.play()
	}
	
	if ( sc < 60 && sc >=40){
	   can.fillText("  Average !!",370,800);
	   clap2.play()
	}
	
	if ( sc < 40 && sc >=30 ){
	   can.fillText("  Poor !!!",370,800);
	   Go.play();
	}
	
	if ( sc < 30){
	   can.fillText (" Very Poor !",370,800);
	   Go.play();
	}

}

checkAnswer = function(Ans,Mw){
    var RightAnswer = check(Ans,Mw);

	
	if(!RightAnswer){
	    wrong.play();
        can.font = "20px Italic";
		can.fillText(Ans.toUpperCase() + " IS WRONG ANSWER ",400,900);
		can.font= '40px Italic';
   } 
	
	if (RightAnswer){

		return true;
	}

}


Start = function() {


   temp = [[],[],[],[],[],[],[],[],[],[]]; 
   missed_word = [];

   Copy(temp,missed_word);
   QuestionNum =0;
   
   score = 0;
   Time = 20;
   
}


Start();
setInterval(Update,40);
setInterval(TakingInput,25);
</script>
</html>