'use strict';

var client = client || {};

client.modalView = function(oldMessageView){
    return new Vue({
        el: '#modalView',
        data: {
            text:'',
            show: false,
            item:null
        },
        methods: {

            openModal: function(item){
                this.$els.modal.classList.toggle('is-active');
                this.$els.modalText.textContent = item.text;
                this.$data.item = item;
            },

            closeModal: function(){
                this.$els.modal.classList.toggle('is-active');
            },

            revertMessage: function(){
                var item = this.$data.item;
                client.emit('revert', {
                    room: client.id,
                    item: item
                });
                this.closeModal();
                oldMessageView.removeMessage(item.uniqId);
            }

        },
        attached: function(){

        }
    });
};
