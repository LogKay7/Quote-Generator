let favContainer = document.getElementById("favorites");
let quotereq = document.getElementById(`quote`);
let authorreq = document.getElementById(`author`);
let fav = document.querySelector("input");
let fav2 = document.querySelector("label");
let stockage = localStorage;
let whatDelete = document.querySelector("#favinsert");
let buttonDeleteFavs = document.querySelector("#deleteAllFavs");


var quote;
var author;

let quotes;
let authors;


//Initialisation 

getFavorites();                                         //Récupère les quotes enregistrées
fav2.classList.add("hidden");                           //Cache le bouton favori avant le lancement

//Clic sur le bouton Generate
document.getElementById("generate").addEventListener("click", function() 
{
    fetch('https://api.quotable.io/random')
        .then(response => response.json())
        .then(data => 
        {
            quotereq.innerHTML = data.content;          //Affiche la quote
            authorreq.innerHTML = data.author;          //Affiche l'auteur
            fav2.classList.remove("hidden");            //Affiche le bouton favori
            quote = data.content;                       //Stocke la quote dans une variable
            author = data.author;                       //Stocke l'auteur dans une variable
        })

        .catch(err => 
        {
            console.log(err);
        });
        fav.checked=false;                              //Réinitialise le bouton fav à chaque nouvelle quote

});


//Clic sur le bouton favori
fav.addEventListener("click",function(){
    if (fav.checked == true)
    {
        addFavorite(quote, author);
        buttonDeleteFavs.classList.remove("hidden");

    } else if(fav.checked == false)
    {
        whatDelete.removeChild(whatDelete.firstChild);
        stockage.removeItem("quote");
        stockage.removeItem("author");

        if(!whatDelete.firstChild)
        {
            buttonDeleteFavs.classList.add("hidden");
        }
        
    }

})


buttonDeleteFavs.addEventListener("click",function(){
    stockage.clear();
    
    while (whatDelete.firstChild) {
        whatDelete.removeChild(whatDelete.firstChild);
    }
    fav.checked=false;
    buttonDeleteFavs.classList.add("hidden");

})


function addFavorite(quote, author)
{
    createDivFavorite(quote, author);
    stockage.setItem("quote",quote);
    stockage.setItem("author",author);
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
        buttonDeleteFavs.classList.remove("hidden");

    } else
    {
        buttonDeleteFavs.classList.add("hidden");
    }
}

function createDivFavorite(quote, author)
{
    let newDiv = document.createElement("div");
    let bgColor = convertHex(getRandomColor(),30);
    let newButton = document.createElement("button");

    newDiv.style.position = "relative"

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
    newDiv.innerHTML = `</br>${quote} </br>~ ${author}`;

    newButton.innerHTML = "X";
    newButton.style.position = "absolute"
    newButton.style.right = "15px";
    newButton.style.top = "4px";
    newButton.style.background = "none";
    newButton.style.border = "none";
    newButton.style.fontFamily = "Arial";

    

    let position = document.getElementById("favinsert");
    position.appendChild(newDiv);
    position.lastChild.appendChild(newButton);

    newButton.addEventListener("click", function()
    {
        position.removeChild(newDiv);
        stockage.removeItem("quote");
        stockage.removeItem("author");

        if(whatDelete.childElementCount == 0)
        {
            buttonDeleteFavs.classList.add("hidden");
        }
    });
}

