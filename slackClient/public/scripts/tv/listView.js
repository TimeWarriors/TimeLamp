'use strict';

var client = client || {};

client.listView = function(){
    return new Vue({
        el: '#listView',
        data: {
            items:[],
            warningsItem: null
        },
        methods: {
            updateMessages: function(message){
                if(this.isHashTagWarning(message.hashTags)){
                    client.modalView.openWarningModal(message);
                }else{
                    client.modalView.closeWarningModal();
                }
                message.itemLabel = this.getItemLabelClass(message.hashTags);

                if(this.items.length >= client.nrOfMessagesOnScreen){
                    this.items.push(message);
                    this.items.splice(0, 1);
                }else{
                    this.items.push(message);
                }

            },

            isOverflow: function(el){
                return el.clientWidth < el.scrollWidth ||
                    el.clientHeight < el.scrollHeight;
            },

            isHashTagWarning: function(hashTags){
                return hashTags.includes('#!');
            },

            getItemLabelClass: function(hashTags){
                return this.isHashTagWarning(hashTags) ?
                    'warningLabel':
                    'questionLabel';
            },

            highlightMessage: function(uniqId){
                this.items.filter(function(item){
                    return item.uniqId === uniqId;
                }).forEach(function(item){
                    if(!item.highlight){
                        item.highlight = 'myHighlight';
                    }else{
                        item.highlight = false;
                    }
                });
            },

            removeMessage: function(uniqId){
                this.items.filter(function(item){
                    return item.uniqId === uniqId;
                }).forEach(function(item){
                    var index = this.items.indexOf(item);
                    this.items.splice(index, 1);
                }.bind(this));
            }
        },
        transitions: {
            expandheight: {
                afterEnter: function (el) {
                }
          }
        }
    });
};
