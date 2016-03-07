"use strict";

let pcView = function()
{
    this.list = document.getElementById("list");
    //this.messageStorage = [];

    let self = this;

    Array.observe(this.messageStorage, function(changes){
        console.log(self.messageStorage);
        if(changes[0].addedCount >= 1)
        {

            if(list.getElementsByTagName("li").length >= 4)
            {
                //TODO Store message.
            }
            else
            {
                //TODO Add li tag.
            }
            //TODO add message.
        }

        else if(changes[0].removed.length > 0)
        {
            //TODO Replace message.
        }
    });
}


pcView.prototype.messageStorage = [];

pcView.prototype.addListTag = function(message)
{
    let li = document.createElement("li");
    let a = document.createElement("a");
    let remove = document.createElement("img");

    remove.src = "exit.png"
    a.href = "#";
    li.id = "message_";

    li.appendChild(a);
    li.appendChild(remove);
    list.appendChild(li);

    remove.addEventListener("click", function(index)
    {
        // TODO: Empty html and add a new question
        //     //Remove value from storage

    })
}

pcView.prototype.addMessage = function(message)
{
    this.messageStorage.push(message);
}
