const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('cartas');

async function buscarcarta() {
    const idcarta = document.querySelector("#idcarta").value;

    let llamada = new XMLHttpRequest();

    let url = 'https://yugipedia.com/index.php?title='+idcarta+'';

    llamada.onreadystatechange = function (){
        if(this.readyState == 4 && this.status == 200) {

            $('#idcarta').val(idcarta);

            var imagen = $(this.responseText).find('.image img');
            $("#imagen-carta").html('<a href="'+url+'" target="_blank" rel="noopener noreferrer"><img src='+imagen[0].src+'></img></a>');
            var nombre = $(this.responseText).find('.heading div').text();
            $("#nombre-carta").val(String(nombre));

            /* Si es monstruo */
            var tipo = $(this.responseText).find('a[href$="/wiki/Type"]').parent().parent();
            if(tipo.length >= 1) {
                var tipo2 = $(tipo).find('td a');
                $("#tipo-monstruo").val($(tipo2[0]).text());
                $("#tipocarta").val($(tipo2[1]).text());
            }
            /* Si es otro tipo */
        } else {
            $("#imagen-carta").html('');
            reset();
        } 
    }

    console.log("Se envia la petición");

    llamada.open("GET", url, true);

    llamada.send();

    /*
    $.get(, function(data) {
        var imgs = $('<div/>').html(data).find('img');
        imgs.each(function(i, img) {
            alert(img.src); // show a dialog containing the url of image
        });
    });*/
}

function agregarcarta(){
    alert("Carta agregada con éxito");
    reset();
}

async function reset(){
    var inputs = document.querySelectorAll('input');
    inputs.forEach(element => {
        element.value = "";
    });
    var select = document.querySelectorAll('select');
    select.forEach(element => {
        element.value = "";
    });
    $('#imagen-carta').html("");
}

window.onload() = function(){
    db.run("CREATE TABLE `Cartas` \
        (ID INTEGER PRIMARY KEY NOT NULL AUTO_INCREMENT, \
        IDcarta INTEGER, \
        IDexpansion TEXT, \
        Edicion TEXT, \
        Nombre TEXT, \
        Cantidad INTEGER, \
        Tipocarta TEXT, \
        Tipo TEXT, \
        Carpeta TEXT, \
        Folio TEXT, \
        Vendida TEXT, \
        Aquien TEXT, \
        Precio TEXT, \
    ");
}