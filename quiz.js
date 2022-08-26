const button = document.getElementById('answer');

time = document.getElementById("time");
Score = document.getElementById("score")

right= new Audio("AUDIO/right.mp3");
wrong= new Audio("AUDIO/wrong.mp3");
TimeOut= new Audio("AUDIO/TimeOut.mp3");
Go= new Audio("AUDIO/Go.wav");
clap2= new Audio("AUDIO/clap2.mp3");
clap1= new Audio("AUDIO/clap1.mp3");

var Time = 20;
var score = 0;

var RA = false;
var GameOver = false;
var QuestionNum =0;

var frameCount =0;
var WIDTH = 900;
var HEIGHT = 500;

var Play = false;

var Words = ["SINGAPORE","GREENLAND","ARABIAN","CANBERRA","NEPAL","AMAZON","RUSSIA","EVEREST","PACIFIC","SAHARA"];
	
	
var Hints = ["What is the Capital of Singapore ?",
            "Which is the largest island in the world ?",
            "What is the name of the largest peninsula of the world ?",
            "What is the capital city of Australia ?",
            "In which modern day country was lord Buddha born ?",
            "Which is the largest river in the world ?",
            "Which is the largest country in the world ?",
            "What is the English name of the tallest mountain of the world ?",
            "What is the name of the deepest occean in the world ?",
            "Which is the hotest dessert in the world ?"]


display = function(entity){
    document.getElementById("question").innerHTML = entity;
}

PlayCheck = function(){
	 if ( score>= 90 ){
	   clap1.play();
	  }
	
	 if ( score< 90 && score>=60){
	   clap2.play()
	  }
	
	 if ( score< 60 && score>=40){
	   clap2.play()
	  }
	
	 if ( score< 40 && score>=30 ){
	   Go.play();
	  }
	
	 if ( score< 30){
	   Go.play();
	  }
	 
	Play = true;
	  
}


Update = function(){
   if (GameOver){
      var Rating = "";
	  button.remove();
	  
	 if ( score>= 90 ){
	   Rating = " amazing ";
	  }
	
	 if ( score< 90 && score>=60){
	   Rating ="  good  ";
	  }
	
	 if ( score< 60 && score>=40){
	   Rating = "  average ";
	  }
	
	 if ( score< 40 && score>=30 ){
	   Rating = "  poor  ";
	  }
	
	 if ( score< 30){
	   Rating = " very poor ";
	  }
	  
	  if (Play == false){
	    PlayCheck();
	  }
	  
	  document.getElementById('sec2').setAttribute('class','none');
	  document.getElementById('sec1').setAttribute('class','change');
	  document.getElementById("ANS").innerHTML = "What is the Capital of Singapore ? <br> SINGAPORE <br> Which is the largest island in the world ? <br> GREENLAND <br> What is the name of the largest peninsula of the world ? <br> ARABIAN <br> What is the capital city of Australia ? <br> CANBERRA <br> In which modern day country was lord Buddha born ? <br> NEPAL <br> Which is the largest river in the world ? <br> AMAZON <br> Which is the largest country in the world ? <br> RUSSIA <br> What is the English name of the tallest mountain of the world ? <br> EVEREST <br> What is the name of the deepest occean in the world ? <br> PACIFIC <br>  Which is the hotest dessert in the world ? <br> SAHARA <br>"

	  document.getElementById("question").innerHTML = "Your score is " + Rating;
	  
	  return;
   }else{

   UpdateQuestion();

   
   if(frameCount%25 ==0){
      Time--;
   }
   
   if (frameCount%500 == 0){
          TimeOut.play();
		  QuestionNum++;
		  Time = 20;	  
	}
	
	if (RA){
	   right.play();
	   score += 10;
	   QuestionNum++;
	   Time = 20;
	   frameCount = 0;
	   RA = false; 
	}
	
	if (QuestionNum >= Words.length){
	   GameOver = !GameOver;
	}
	
	time.innerHTML = Time;
	Score.innerHTML = score;

}}

UpdateQuestion = function(){
	display(Hints[QuestionNum]);
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
		Answer = command.toUpperCase();
		TakeAnswer(Answer);
    };
	
	recognition.onerror = function(event) {
	  	document.getElementById('indicator').innerHTML="Off";
		document.getElementById('indicator').setAttribute('style','background:yellow');
	}    

    recognition.onspeechend = function() {
     	recognition.stop();
		document.getElementById('indicator').innerHTML="Off";
		document.getElementById('indicator').setAttribute('style','background:red');
		button.disabled = false;
    };      

    document.querySelector('#answer').addEventListener('click', function(){
        recognition.start();		
	   	document.getElementById('indicator').innerHTML="On";
	   	document.getElementById('indicator').setAttribute('style','background:green');
		button.disabled = true;
    });
	
	console.log(button);
	
}

TakeAnswer = function(Ans){
	RA = check(Ans,Words[QuestionNum]);
}


check = function(ans,word){
    
	if (word == ans){
	   return true;
	}else{
	  wrong.play();
	  return false;
	}
}



Start = function() {
   QuestionNum =0;   
   score = 0;
   Time = 20;
}


Start();
setInterval(Update,40);
setInterval(TakingInput,25);
