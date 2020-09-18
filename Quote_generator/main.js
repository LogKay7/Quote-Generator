let quotereq = document.getElementById(`quote`);
let authorreq = document.getElementById(`author`);
let fav = document.querySelector("input");
let fav2 = document.querySelector("label");
let stockage = localStorage;
let isGenerate = false;
let favInsert = document.querySelector("#favinsert");


var quote;
var author;

var quotes = [];
var authors = [];



getFavorites();
fav2.classList.add("hidden");



//Clic sur le bouton Generate
document.getElementById("generate").addEventListener("click", function() 
{
    fetch('https://api.quotable.io/random')
        .then(response => response.json())
        .then(data => {
            quotereq.innerHTML = data.content;
            authorreq.innerHTML = data.author;
            fav2.classList.remove("hidden");
            quote = data.content;
            author = data.author;
        })

        .catch(err => 
        {
            console.log(err);
        });
});


//Clic sur le bouton favori
fav.addEventListener("click",function(){
    if (fav.checked == true)
    {
        stockage.setItem("quote",quote);
        stockage.setItem("author",author);
        addFavorite(quote, author);
    } else
    {
        //stockage.removeItem("quote");
        //stockage.removeItem("author");
    }

})


function addFavorite(quote, author)
{
    let newDiv = document.createElement("div");
    let bgColor = convertHex(getRandomColor(),30);
    newDiv.style.width = "96%";
    newDiv.style.height = "fit-content";
    newDiv.style.background = `${bgColor}`;
    newDiv.style.border = "0.1px solid black";
    newDiv.style.color = "black";
    newDiv.style.marginLeft = "auto";
    newDiv.style.marginRight = "auto";
    newDiv.style.marginBottom = "10px";
    newDiv.style.padding = "7px";
    newDiv.style.fontSize = "15px";
    newDiv.style.borderRadius = "25px";
    newDiv.innerHTML = `${quote} </br>~ ${author}`;
    document.getElementById("favinsert").appendChild(newDiv);
}


function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }


  function convertHex(hexCode,opacity){
    var hex = hexCode.replace('#','');

    if (hex.length === 3) {
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }

    var r = parseInt(hex.substring(0,2), 16),
        g = parseInt(hex.substring(2,4), 16),
        b = parseInt(hex.substring(4,6), 16);

    return 'rgba('+r+','+g+','+b+','+opacity/100+')';
}

function getFavorites()
{
    if(window.localStorage.length)
    {
        let favquote = stockage.getItem("quote");
        let favauthor = stockage.getItem("author");

        addFavorite(favquote,favauthor);        
    }
}