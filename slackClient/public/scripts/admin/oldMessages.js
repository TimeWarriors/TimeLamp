'use strict';
var client = client || {};

client.oldMessageView = function(){
    return new Vue({
        el: '#oldItems',
        data: {
            items:[],
            showOpenMenu: true,
            show: false
        },
        methods: {
            addMessage: function(message){
                message.modal = false;
                this.items.push(message);
            },

            removeMessage: function(uniqId){
                this.items.filter(function(item){
                    return item.uniqId === uniqId;
                }).forEach(function(item){
                    var index = this.items.indexOf(item);
                    this.items.splice(index, 1);
                }.bind(this));
            },

            toggleMessage: function(item){
                client.modalView.openModal(item);
            },

            toggleList: function(){
                if(this.$data.show){
                    this.$data.show = false;
                    this.$data.showOpenMenu = true;
                }else{
                    this.$data.show = true;
                    this.$data.showOpenMenu = false;
                }
            },
        },
        attached: function(){

        }
    });
};
