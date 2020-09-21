
let quoteHtml = document.getElementById(`quote`);
let authorHtml = document.getElementById(`author`);
let fav = document.querySelector("input");                  //Bouton favori
let fav2 = document.querySelector("label");                 //Bouton favori
let stockage = localStorage;
let whatDelete = document.querySelector("#favinsert");
let buttonDeleteFavs = document.querySelector("#deleteAllFavs");        //Bouton de suppression de tous les favoris 


let currentQuote;           //Quote affichée à l'écran
let currentAuthor;              //Et son auteur

let favQuotes = [];         //Array contenant toutes les quotes en favori
let favAuthors = [];            //Et les auteurs


/* --------------------------------------------------------------------------------------------------------------------------------------- */
/*                                                        INITIALISATION                                                                   */
/* --------------------------------------------------------------------------------------------------------------------------------------- */


fav2.classList.add("hidden");                           //Cache le bouton favori avant le lancement
fav.checked=false;                                      //Réinitialise le bouton fav

/* --------------------------------------------------------------------------------------------------------------------------------------- */
/*                                                      GENERATION D'UNE QUOTE                                                             */
/* --------------------------------------------------------------------------------------------------------------------------------------- */


//Clic sur le bouton Generate
document.getElementById("generate").addEventListener("click", function() 
{
    fetch('https://api.quotable.io/random')         //Liaison avec l'API
        .then(response => response.json())
        .then(data => 
        {
            quoteHtml.innerHTML = data.content;          //Affiche la quote
            authorHtml.innerHTML = data.author;          //Affiche l'auteur
            fav2.classList.remove("hidden");            //Affiche le bouton favori
            currentQuote = data.content;                       //Stocke la quote dans une variable
            currentAuthor = data.author;                       //Stocke l'auteur dans une variable
        })

        .catch(err => 
        {
            console.log(err);
        });
        fav.checked=false;                              //Réinitialise le bouton fav à chaque nouvelle quote

});



/* --------------------------------------------------------------------------------------------------------------------------------------- */
/*                                                        AJOUT EN FAVORI                                                                  */
/* --------------------------------------------------------------------------------------------------------------------------------------- */


//-------- Clic sur le bouton favori--------
fav.addEventListener("click",function(){                        
    if (fav.checked == true)                                    // Si le bouton favori n'était pas coché avant le clic
    {
        if(favQuotes.indexOf(currentQuote) == -1)
        {
            addFavorite(currentQuote, currentAuthor);                   //Ajoute la Quote en favori
            buttonDeleteFavs.classList.remove("hidden");                //Affiche le bouton "Supprimer tous les favoris"
        }

    } else if(fav.checked == false)                            // Si le bouton favori était déjà coché avant le clic
    {
        whatDelete.lastChild.remove();                                //Supprime la div du dernier favori ajouté
        favQuotes.shift();                                            //Supprime le 1er élément du tableau quotes (le + récent)
        favAuthors.shift();                                           //Supprime le 1er élément du tableau author (le + récent)
        stockage.setItem("quotes",JSON.stringify(favQuotes));                                //Ecrase la sauvegarde existante des éléments
        stockage.setItem("authors",JSON.stringify(favAuthors));                               //Ecrase la sauvegarde existante des éléments

        if(!whatDelete.firstChild || whatDelete.childElementCount == 0)                      //Si aucun élément en favori 
        {
            buttonDeleteFavs.classList.add("hidden");                   //Cache le bouton "Supprimer tous les favoris"
        }
        
    }

})


//-------- Fonction permettant l'ajout en favori de la quote passée en paramètre ----------
function addFavorite(quote, author)         
{
    favQuotes.unshift(quote);                             //Ajoute la quote au début du tableau des favoris(tableau permettant la sauvegarde)
    favAuthors.unshift(author);                           //Ajoute l'auteur au début du tableau des favoris(tableau permettant la sauvegarde)
    createDivFavorite(quote, author);                     //Appelle la fonction permettant de créer la div du favori
    stockage.setItem("quotes",JSON.stringify(favQuotes));              //Ecrase la sauvegarde existante des éléments
    stockage.setItem("authors",JSON.stringify(favAuthors));            //Ecrase la sauvegarde existante des éléments
}



/* --------------------------------------------------------------------------------------------------------------------------------------- */
/*                                              CREATION DES DIVS CONTENANT LES QUOTES EN FAVORI                                           */
/* --------------------------------------------------------------------------------------------------------------------------------------- */

function createDivFavorite(quote, author)                   //Fonction permettant la création des divs contenant les quotes favorites
{
    let newDiv = document.createElement("div");
    let bgColor = convertHex(getRandomColor(),30);
    let newButton = document.createElement("button");

            //Style et remplissage de la div en favori

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

            //Style et ajout du bouton de suppression dans la div

    newButton.innerHTML = "X";
    newButton.style.position = "absolute"
    newButton.style.right = "15px";
    newButton.style.top = "4px";
    newButton.style.background = "none";
    newButton.style.border = "none";
    newButton.style.fontFamily = "Arial";

            //Ajout de la div et du bouton dans le conteneur des favoris        

    let position = document.getElementById("favinsert");
    position.appendChild(newDiv);    
    position.lastChild.appendChild(newButton);
    

//Ajout d'un évènement "clic" sur le bouton de chaque quote en favori
    newButton.addEventListener("click", function()       
    {
        position.removeChild(newDiv);                       //Supprime l'élément cliqué du con
        favQuotes.splice(favQuotes.indexOf(quote),1)        //Supprime l'élément des tableaux 
        favAuthors.splice(favQuotes.indexOf(quote),1)
        stockage.setItem("quotes",JSON.stringify(favQuotes));               //Ecrase le contenu des tableaux dans le localStorage
        stockage.setItem("authors", JSON.stringify(favAuthors));

        if(quote==currentQuote)                         //Permet de réinitialiser le bouton favori si la quote active est supprimée         
        {                                                  //manuellement
            fav.checked=false;                                             

        }

        if(whatDelete.childElementCount == 0)           //Si tous les favoris ont été supprimés manuellement
        {
            buttonDeleteFavs.classList.add("hidden");          //Cache le bouton "supprimer tous les favoris"
            fav.checked=false;                                 //Réinitialise le bouton favori      
        }
    });
}

// Permet de remonter automatiquement le container des favoris lorsque la souris n'est plus au dessus

document.getElementById('containerfav').addEventListener('mouseleave', () => {
    let fav = document.getElementById('favorites');
    fav.scrollTo({top: 0, behavior: 'smooth'})
})
/* --------------------------------------------------------------------------------------------------------------------------------------- */
/*                                                      RECUPERATION DES FAVORIS                                                           */
/* --------------------------------------------------------------------------------------------------------------------------------------- */

    window.addEventListener('DOMContentLoaded', () => {

        if(window.localStorage.length)                                  //Si des quotes sont disponibles dans le localStorage
        {
            favAuthors = localStorage.getItem('authors') ? JSON.parse(localStorage.getItem('authors')) : [];
            favQuotes = localStorage.getItem('quotes') ? JSON.parse(localStorage.getItem('quotes')) : [];
            
            if(favQuotes.length && favAuthors.length){
                for(let i = 0; i < favQuotes.length; i++){
                    createDivFavorite(favQuotes[i], favAuthors[i])
                }
            }

            buttonDeleteFavs.classList.remove("hidden");                //Affiche le bouton de suppression des favoris 

        } else                                                          //Si aucune quote n'est disponible dans le localStorage
        {
            favQuotes = [];                                         
            favAuthors = [];  
            buttonDeleteFavs.classList.add("hidden");
            fav.checked=false;                                             
        }
    })  




/* --------------------------------------------------------------------------------------------------------------------------------------- */
/*                                                  SUPPRESSION DE TOUS LES FAVORIS                                                        */
/* --------------------------------------------------------------------------------------------------------------------------------------- */


//Clic sur le bouton "Supprimer tous les favoris"
buttonDeleteFavs.addEventListener("click",function(){
    stockage.clear();                                       //Vide le Local Storage
    favQuotes = [];                                         //Vide les tableaux 
    favAuthors = [];    

    while (whatDelete.childElementCount) {                         //Tant qu'il y a des quotes (divs) dans les favoris
        whatDelete.removeChild(whatDelete.firstChild);                  //Supprime le premier élément à chaque passage de boucle
    }
    fav.checked=false;                                             //Réinitialise le visuel du bouton favori
    buttonDeleteFavs.classList.add("hidden");                      //Cache le bouton "Supprimer tous les favoris"

})


/* --------------------------------------------------------------------------------------------------------------------------------------- */
/*                                                      COULEURS BACKGROUND                                                                */
/* --------------------------------------------------------------------------------------------------------------------------------------- */


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
