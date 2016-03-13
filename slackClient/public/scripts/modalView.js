'use strict';

var client = client || {};

client.modalView = function(oldMessageView){
    return new Vue({
        el: '#modalView',
        data: {
            text:'',
            show: false,
            item:null,
            pulseDone: null
        },
        methods: {

            openModal: function(item){
                this.$els.modal.classList.add('is-active');
                this.$els.modalText.textContent = item.text;
                this.$data.item = item;
            },

            closeModal: function(){
                this.$els.modal.classList.remove('is-active');
            },

            closeWarningModal: function(){
                if(this.$data.pulseDone === null){
                    this.$els.modal.classList.remove('is-active');
                }else{
                    this.$data.pulseDone.then(function(){
                        this.$data.pulseDone = null;
                        this.$els.modal.classList.remove('is-active');
                    }.bind(this));
                }
            },

            openWarningModal: function(item){
                this.openModal(item);
                this.$data.pulseDone = this.pulseBackgroundColor('#ed6c63');
            },

            setBackgroundcolor: function(color){
                this.$els.modalBackground.style.backgroundColor = color;
            },

            pulseBackgroundColor: function(color){
                return new Promise(function(resolve, reject) {
                    this.$els.modalBackground.classList.add('pulse');
                    this.$els.modalBackground.addEventListener('animationend', function() {
                            this.setBackgroundcolor(color);
                            this.$els.modalBackground.classList.remove('pulse');
                            resolve(true);
                        }.bind(this));
                }.bind(this));
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
