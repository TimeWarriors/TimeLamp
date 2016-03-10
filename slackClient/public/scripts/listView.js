'use strict';
var client = client || {};

client.listView = function(oldMessageView){
    return new Vue({
        el: '#listView',
        data: {
            items:[]
        },
        methods: {
            updateMessages: function(message){
                message.itemLabel = this.setItemLabelClass(message.hashTags);
                message.buttonOutline = this.setButtonOutlineClass(message.hashTags);
                
                if(this.items.length >= 4){
                    this.items.push(message);
                    oldMessageView.addMessage(this.items[0]);
                    this.items.splice(0, 1);
                }else{
                    this.items.push(message);
                }
            },

            isHashTagWarning: function(hashTags){
                if(hashTags.includes('#!')){
                    return true;
                }
                return false;
            },

            setItemLabelClass: function(hashTags){
                return this.isHashTagWarning(hashTags) ?
                    'warningLabel':
                    'questionLabel';
            },

            setButtonOutlineClass: function(hashTags){
                return this.isHashTagWarning(hashTags) ?
                    'is-danger':
                    'is-info';
            },

            highlightMessage: function(uniqId){
                this.items.filter(function(item){
                    return item.uniqId === uniqId;
                }).forEach(function(item){
                    if(item.highlight === false){
                        item.highlight = 'myHighlight';
                    }else{
                        item.highlight = false;
                    }
                });
            },

            highlightMessageClick: function(item){
                client.emit('highlight', {
                    room: client.id, uniqId: item.uniqId
                });
            },

            removeMessage: function(uniqId){
                this.items.filter(function(item){
                    return item.uniqId === uniqId;
                }).forEach(function(item){
                    var index = this.items.indexOf(item);
                    oldMessageView.addMessage(this.items[index]);
                    this.items.splice(index, 1);
                }.bind(this));
            },

            removeMessageClick: function(item){
                client.emit('remove', {
                    room: client.id, uniqId: item.uniqId
                });
            }
        },
        attached: function(){

        }
    });
};
