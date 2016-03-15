'use strict';

var client = client || {};

client.ModalTemplate = Vue.extend({
  template: document.querySelector('#modalViewTemp').cloneNode(true)
});

client.openModalComponent = null;
client.modalView = function(item, styles){
    var modalComponet = new client.ModalTemplate({
        replace: false,
        data: {
            text: '',
            show: false,
            item: item,
            canClose: true,
            pulseDone: null
        },
        methods: {
            closeSelf: function(){
                this.$destroy(this);
            },

            isWarning: function(){
                return styles.isWarning;
            },

            setStyles: function(){
                if(styles.pulse){
                    this.$data.pulseDone = this.pulseBackgroundColor(styles.backgroundColor);
                }
                if(styles.maxContent){
                    this.setMaxContent();
                }
            },

            setMaxContent: function(){
                this.$els.modalBox.classList.add('largeBox');
            },

            getPulse: function(){
                return this.$data.pulseDone;
            },

            pulseBackgroundColor: function(color){
                return new Promise(function(resolve, reject) {
                    this.$els.modalBackground.classList.add('pulse');
                    this.$els.modalBackground.addEventListener('animationend', function() {
                            this.setBackgroundColor(color);
                            this.$els.modalBackground.classList.remove('pulse');
                            resolve(true);
                        }.bind(this));
                }.bind(this));
            },

            setBackgroundColor: function(color){
                this.$els.modalBackground.style.backgroundColor = color;
            }
        },
        attached: function(){
            this.$els.modalText.textContent = item.text;
            this.$data.item = item;
            this.setStyles();
        }
    });
    client.closeOpenModal();
    modalComponet.$mount().$appendTo('#modalPresentation');
    client.openModalComponent = modalComponet;
};

client.closeOpenModal = function(){
    if(client.openModalComponent !== null){
        client.openModalComponent.closeSelf();
    }

};
client.closeWarningModal = function(){
    if(client.openModalComponent !== null){
        if(client.openModalComponent.isWarning() && client.openModalComponent.getPulse() !== null){
            client.openModalComponent.getPulse()
                .then(function(){
                    client.closeOpenModal();
                }.bind(this));
        }else{
            client.closeOpenModal();
        }
    }

};


/*
client.modalView = function(oldMessageView){
    return new Vue({
        el: '#modalView',
        data: {
            text: '',
            show: false,
            item: null,
            pulseDone: null
        },
        methods: {

            openModal: function(item){
                this.$els.modal.classList.add('is-active');
                this.$els.modalText.textContent = item.text;
                this.setBackgroundcolor('rgba(0,0,0,0.86)');
                this.$data.item = item;
            },

            closeModal: function(){
                this.$els.modal.classList.remove('is-active');
            },

            openHiglightModal: function(item){
                this.openModal(item);
                this.$data.highlightOpen = true;
            },

            closeHiglightModal: function(item){
                console.log(item);
                this.$data.highlightOpen = false;
                this.$els.modal.classList.remove('is-active');
            },

            closeWarningModal: function(){
                if(this.$data.pulseDone === null && !this.$data.highlightOpen){
                    this.$els.modal.classList.remove('is-active');
                }else if(this.$data.pulseDone !== null && this.$data.warningOpen){
                    this.$data.pulseDone.then(function(){
                        this.$data.warningOpen = false;
                        this.$data.pulseDone = null;
                        this.$els.modal.classList.remove('is-active');
                    }.bind(this));
                }
            },

            openWarningModal: function(item){
                this.$data.warningOpen = true;
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
*/
