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
                    console.log(message);
                    client.modalView(message,  { pulse:true, backgroundColor: '#ed6c63', isWarning: true, maxContent: false});
                }else{
                    client.closeWarningModal();
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
                        client.modalView(item, { pulse:false, maxContent: true});
                    }else{
                        client.closeOpenModal();
                        item.highlight = false;
                    }
                }.bind(this));
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
