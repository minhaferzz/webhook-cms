export default Ember.ArrayController.extend({
  newTypeName     : null,
  newTypeType     : null,

  reset: function () {
    this.setProperties({
      newTypeName: null,
      newTypeType: null
    });
  },

  isDisabled: function () {
    return this.get('isDuplicate') || this.get('newTypeType') === null;
  }.property('isDuplicate', 'newTypeType'),

  isDuplicate: function () {
    return this.get('model').isAny('id', this.get('newTypeId'));
  }.property('newTypeId'),

  newTypeId: function () {
    var name = this.get('newTypeName');

    return name ? name.replace(/\s+|\W/g, '').toLowerCase() : '';

  }.property('newTypeName'),

  actions: {
    createType: function () {

      if (this.get('isDuplicate')) {
        return;
      }

      this.store.find('control-type', 'textfield').then(function (controlType) {

        // controls that are locked
        var controls = [
          this.store.createRecord('control', {
            controlType: controlType,
            name       : 'name',
            label      : 'Name',
            locked     : true,
            showInCms  : true,
            required   : true
          })
        ];

        // creating a new content-type
        // a textcontrol (name) is required
        var type = this.store.createRecord('content-type', {
          id    : this.get('newTypeId'),
          name  : this.get('newTypeName')
        });

        if (this.get('newTypeType') === 'single') {
          type.set('oneOff', true);
        }

        type.get('controls').pushObjects(controls);

        type.save().then(function (type) {
          this.send('notify', 'success', 'Type created!', {
            icon: 'ok-sign',
            className: 'wh-tray-wide'
          });
          this.transitionToRoute('form', type);
          this.reset();
        }.bind(this));

      }.bind(this));

    }
  }
});
