'use strict';
var express = require('express');
const path = require('path');
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('cartas');


module.exports = db;

var urlimagencarta;

async function buscarcarta() {
    const idcarta = document.querySelector("#idcarta").value;

    let llamada = new XMLHttpRequest();

    let url = 'https://yugipedia.com/index.php?title='+idcarta+'';

    llamada.onreadystatechange = function (){
        if(this.readyState == 4 && this.status == 200) {

            $('#errorcarta').html('');
            $('#idcarta').val(idcarta);

            var imagen = $(this.responseText).find('.image img');
            urlimagencarta = imagen[0].src;
            $("#imagen-carta").html('<a href="'+url+'" target="_blank" rel="noopener noreferrer"><img src='+urlimagencarta+'></img></a>');
            var nombre = $(this.responseText).find('.heading div').text();
            $("#nombre-carta").val(String(nombre));

            /* Si es monstruo */
            var tipo = $(this.responseText).find('a[href$="/wiki/Type"]').parent().parent();
            if(tipo.length >= 1) {
                var tipo2 = $(tipo).find('td a');
                $("#tipo-monstruo").val($(tipo2[0]).text());
                $("#tipocarta").val($(tipo2[1]).text());
            }
            else {
                tipo = $(this.responseText).find('a[href$="/wiki/Card_type"]').parent().parent();
                var tipo2 = $(tipo).find('td a');
                $("#tipocarta").val($(tipo2[0]).text());

                tipo = $(this.responseText).find('a[href$="/wiki/Property"]').parent().parent();
                tipo2 = $(tipo).find('td a');
                $("#tipo-monstruo").val($(tipo2[0]).text());
            }
        } else {
            $("#imagen-carta").html('');
            return 1;
        } 
    }

    llamada.open("GET", url, true);

    llamada.send();
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

function agregarcarta(){
    if($("#idcarta").val() == "" || $("#imagen-carta").html() == "") return $("#idcarta").css("background-color", "#fcc").focus();
    if($("#idexpansion").val() == "") return $("#idexpansion").css("background-color", "#fcc").focus(); 
    if($("#edicion").val() == "") return $("#edicion").css("background-color", "#fcc").focus(); 
    if($("#nombre").val() == "") return $("#nombre").css("background-color", "#fcc").focus(); 
    if($("#tipocarta").val() == "") return $("#tipocarta").css("background-color", "#fcc").focus(); 
    if($("#tipo-monstruo").val() == "") return $("#tipo-monstruo").css("background-color", "#fcc").focus(); 
    if($("#carpeta").val() == "") return $("#carpeta").css("background-color", "#fcc").focus(); 
    if($("#folio").val() == "") return $("#folio").css("background-color", "#fcc").focus(); 
    if($("#vendida").val() != "") {
        if($("#aquien").val() == "") return $("#aquien").css("background-color", "#fcc").focus(); 
        if($("#preciovendida").val() == "") return $("#preciovendida").css("background-color", "#fcc").focus(); 
    }

    sqlite3 = require('sqlite3').verbose();
    db = new sqlite3.Database('cartas');

    db.run("INSERT INTO `Cartas` (`IDCarta`,`Imagen`,`IDexpansion`,`Edicion`,`Nombre`,`Tipocarta`,`Tipo`,`Carpeta`,`Folio`,`Vendida`,`Aquien`,`Precio`) \
        VALUES ($idcarta, $imagen, $expansion, $edicion, $nombre, $tipocarta, $tipo, $carpeta, $folio, $vendida, $aquien, $precio)", {
           $idcarta: $("#idcarta").val(),
           $imagen: urlimagencarta,
           $expansion: $("#expansion").val(),
           $edicion: $("#edicion").val(),
           $nombre: $("#nombre").val(),
           $tipocarta: $("#tipocarta").val(),
           $tipo: $("#tipo-monstruo").val(),
           $carpeta: $("#carpeta").val(),
           $folio: $("#folio").val(),
           $vendida: $("#vendida").val(),
           $aquien: $("#aquien").val(),
           $precio: $("#precio").val()
    });

    alert("Carta agregada con éxito");
}

function iniciarbase() {
    db.run("CREATE TABLE IF NOT EXISTS `Cartas` \
        (ID INTEGER PRIMARY KEY AUTOINCREMENT, \
        IDcarta INTEGER, \
        Imagen TEXT, \
        IDexpansion TEXT, \
        Edicion TEXT, \
        Nombre TEXT, \
        Tipocarta TEXT, \
        Tipo TEXT, \
        Carpeta TEXT, \
        Folio TEXT, \
        Vendida TEXT, \
        Aquien TEXT, \
        Precio TEXT)");
}

iniciarbase();