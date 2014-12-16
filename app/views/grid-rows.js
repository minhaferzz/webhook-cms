export default Ember.CollectionView.extend({

  content: function () {
    return this.get('gridControl.value');
  }.property(),

  itemViewClass: Ember.View.extend({
    templateName: 'grid-row',

    firstControl: function () {
      // {{#each rowControl in view.parentView.gridControl.controls}}

      var control = this.get('parentView.gridControl.controls.firstObject');
      var store = control.get('store');

      // fighting with Ember to copy control
      var controlData = control.serialize();
      delete controlData.controls;
      controlData.controlType = control.get('controlType');

      var clone = store.createRecord('control', controlData);

      clone.set('value', this.get('content').get(control.get('name')));

      return clone;
    }.property('parentView.gridControl.controls.firstObject'),

    isActive: function () {
      return this.get('parentView.context.activeRows').indexOf(this.get('rowIndex')) >= 0;
    }.property('parentView.context.activeRows.length', 'rowIndex'),

    rowIndex: function () {
      return this.get('parentView.gridControl.value').indexOf(this.get('content'));
    }.property('parentView.gridControl.value.length'),

    rowIndex1: function () {
      return this.get('rowIndex') + 1;
    }.property('rowIndex')

  })

});