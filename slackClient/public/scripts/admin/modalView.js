'use strict';

var client = client || {};

client.ModalTemplate = Vue.extend({
  template: document.querySelector('#modalViewTemp').cloneNode(true)
});

client.openModalComponent = null;
client.modalView = function(item, oldMessageView){

    var modalComponet = new client.ModalTemplate({
        replace: false,
        data: {
            text: '',
            item: item,
        },
        methods: {
            closeSelf: function(){
                this.$destroy(this);
            },

            revertMessage: function(){
                var item = this.$data.item;
                client.emit('revert', {
                    room: client.id,
                    item: item
                });
                oldMessageView.removeMessage(item.uniqId);
                this.closeSelf();
            }

        },
        attached: function(){
            this.$els.modalText.textContent = item.text;
            this.$data.item = item;
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
