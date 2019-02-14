// déclaration d'une variable mydiv qui est relié à la div "mydiv" (html)
// declaration of a variable mydiv which is connected to div "mydiv" (html)
var mydiv = document.querySelector("#mydiv");
// déclaration d'une variable tableau vide qui va acceuillir les données JSON
// declare an empty array variable that will host the JSON data
var listPromo = [];
// déclaration d'une variable addPromo qui correspond au champs input (en html)
// declare a variable add Promo that corresponds to the input field (in html)
var addPromo = document.querySelector("#addPromo");
// déclaration d'une variable qui correspond au bouton Ajouter promo (en html)
// declare a variable that corresponds to the Add promo button (in html)
var btnAddPromo = document.querySelector("#btnAddPromo");
// déclaration d'une variable qui correspond au bouton Modifier (en html)
// declare a variable that corresponds to the Edit button (in html)
var btnEditPromo = document.querySelector("#btnEditPromo");
var myUl = document.querySelector("ul");



function getPromotion(){
    
    // on récupère l'api sur le lien 
    // get the API on the link
    fetch("http://api-students.popschool-lens.fr/api/promotions")
    // api récupéré par la "response" pour être transformer en JSON
    // api recovered by the "answer" to be transformed into JSON
    .then(response => response.json())
    //  on récupère le JSON avec le .then pour en suite le mettre dans la promo
    // we get the JSON with the .then and then put it in the promo
    .then(function(promo) {
        // console.log(promo); permet simplement de récupérer l'intégralité de L'API, alors que ce qui nous intéresse n'est que le tableau HYDRA:MEMBER
        // console.log (promo); simply allows to recover the entirety of the API, while what interests us is only the table HYDRA: MEMBER
        // console.log(promo["hydra:member"]);
        listPromo = promo["hydra:member"];
        mydiv.innerHTML = ''; 
        selectPromo.innerHTML= '';  
        console.log(listPromo);
        listPromo.forEach(function(promotion) {
            //mydiv.innerHTML += promotion.id + ". " + promotion.name + "<br>";
            selectPromo.innerHTML += "<option>" + promotion.id + "> " + promotion.name + "</option>";
        });
    });
}
getPromotion();

// On écoute le bouton "addPromo" et au clic on lance la fonction "createPromo"
btnAddPromo.addEventListener("click", createPromo);


// on cree la fonction "createPromo" qui récupere la valeur du champs input et cree une nouvelle promotion
// We listen to the "addPromo" button and click on the "createPromo" function
function createPromo() {
    fetch("http://api-students.popschool-lens.fr/api/promotions", {
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    },
    method: "POST",
    body: JSON.stringify({
        name: addPromo.value
    })
})
.then(response => response.json())
.then(promo => {
    
    console.log(promo.name + " créé");
    // je vide le champs input après validation de la 
    // I empty the input field after validation of the
    document.querySelector("#addPromo").value = "";
    getPromotion();
    
})
// en cas d'erreur => .catch()
// in case of error => .catch ()
}

// Je déclare la variable du bouton de suppression de promotion
// I declare the promotion delete button variable
var btnDeletePromo = document.querySelector("#btnDeletePromo");
// Je crée un event listener sur mon bouton avec la fonction en parametre
// I create an event listener on my button with the function in parameter
btnDeletePromo.addEventListener('click', function () {
    let selectPromo = document.querySelector('#selectPromo')
    console.log(selectPromo.value)
    // Je demande confirmation à l'utilisateur avant suppression
    // I request confirmation from the user before deletion
    if (confirm("Supprimer la promo : " + selectPromo.value + " ?")) {
        // Utilsateur confirme la suppression
        // User confirms deletion
        deletePromotion(selectPromo.value);
    }
})

// C'est la fonction qui est déclarée pour s'occuper de la suppression
// This is the function that is declared to handle the deletion
function deletePromotion(idPromo)
{
    fetch("http://api-students.popschool-lens.fr/api/promotions/" + idPromo, {
    method: "DELETE"
})
.then(function (response) {
    getPromotion();
});
}

// Je déclare la variable du bouton de modification de promotion
// I declare the promotion modifier button variable
var btnEditPromo = document.querySelector("#btnEditPromo");

// Je crée un event listener sur le bouton avec une fonction anonyme
// I create an event listener on the button with an anonymous function
btnEditPromo.addEventListener('click', function () {
    let SelectProm = document.querySelector('#selectPromo')
    
    // La fonction anonyme demande dabord confirmation à l'utilisateur avant modification
    // Anonymous function first asks the user for confirmation 
    if (confirm("Remplacer la promo : " + selectPromo.value + " ?")) {
        // Ensuite elle appelle la fonction modifyPromotion pour réaliser la modification en remplaçant le texte
        // Then she calls the modifyPromotion function to make the change by replacing the text
        EditPromotion(selectPromo.value);
    }
})

    // fonction pour reprendre la valeur du champs input
    // function to use input field value
function EditPromotion(idPromo) {
    fetch("http://api-students.popschool-lens.fr/api/promotions/"+ idPromo ,{
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    },
    // on utilise la méthode put sur le fetch pour modifier la chaine existante
    // use the put method on the fetch to modify the existing string
    method: "PUT",
    // on transforme la valeur du champs input newPromo en chaine Json via stringify
    // change the value of the input newPromo field to Json string via stringify
    body: JSON.stringify({
        name: addPromo.value
    })
})
.then(response => response.json())
.then(promo => {
    console.log(promo.name + "modifié")
    getPromotion();
})
.catch()
}

var showPromo = document.querySelector("#btnShowPromo")
showPromo.addEventListener('click', getStudent);

function getStudent() {
    fetch(
        "http://api-students.popschool-lens.fr/api/promotions/" + selectPromo.value
        )
        .then(response => response.json())
        .then(promo => {
            promoTitle.innerHTML = promo.name;
            myUl.innerHTML = "";
            promo.students.forEach(studentURL => {
                fetch("http://api-students.popschool-lens.fr" + studentURL)
                .then(response => response.json())
                .then(student => {
                    var myLi = document.createElement("li");
                    myUl.appendChild(myLi);
                    myLi.id = "student" + student.id;
                    
                    myLi.innerHTML = 
                    `<div class="card" style="width: 15rem;">
                    <div class="card-body">
                    <h5 class="card-title"> ${student.firstname}</h5>
                    <p class="card-text">Nom : ${student.lastname} </br>
                    Sexe : ${student.sex}</p>
                    </div>
                    </div>`
                    
                    var btnDeleteStudent = document.createElement("button");
                    btnDeleteStudent.innerHTML = "Effacer";
                    btnDeleteStudent.value = student.id;
                    btnDeleteStudent.id = "btnDel";
                    var btnModifyStudent = document.createElement("button");
                    btnModifyStudent.innerHTML = "Modifier";
                    btnModifyStudent.value = student.id;
                    // dataset permet de stocker les infos
                    btnDeleteStudent.dataset.firstname = student.firstname;
                    btnDeleteStudent.dataset.lastname = student.lastname;
                    btnDeleteStudent.dataset.path = student["@id"];
                    btnDeleteStudent.addEventListener("click", deleteStudent);
                    btnModifyStudent.addEventListener("click", modifyStudent);
                    myLi.appendChild(btnDeleteStudent);
                    myLi.appendChild(btnModifyStudent);
                });
            });
        });
    }
    
    function deleteStudent(event) {
        var btnDeleteStudent = event.target;
        // console.log("ca marche?");
        // console.log ("does it work?");
        if (confirm("do you really want to delete " + btnDeleteStudent.dataset.firstname + " " + btnDeleteStudent.dataset.lastname)) {
            fetch(
                "http://api-students.popschool-lens.fr" + btnDeleteStudent.dataset.path,
                {
                    method: "DELETE"
                }
                )
                var studentLi = document.querySelector("#student" + btnDeleteStudent.value);
                studentLi.remove();
            }
            
        }
        
        function modifyStudent(event) {
            console.log("test");
        }