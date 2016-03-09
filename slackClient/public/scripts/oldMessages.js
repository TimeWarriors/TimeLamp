'use strict';
var client = client || {};

client.oldMessageView = function(items){
    return new Vue({
        el: '#oldItems',
        data: {
            items:[]
        },
        methods: {
            addMessage(message){
                this.items.push(message);
            }
        },
        attached: function(){

        }
    });
};
