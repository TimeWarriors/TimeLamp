"use strict";

window.onload = function onLoad()
{

    var buttonForTV = document.getElementById("buttonForTV");
    var buttonForPC = document.getElementById("buttonForPC");

    buttonForTV.addEventListener("click", function()
    {
        tvView.LoadTVView();
    })

    buttonForPC.addEventListener("click", function()
    {
        let a = new pcView();
        a.addMessage("Hello World");
        //console.log(pcView.addMessage("Hello World"));
        //pcView.addMessage("Hello world");
    })
}
