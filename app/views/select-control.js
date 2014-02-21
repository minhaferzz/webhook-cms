export default Ember.Select.extend({

  defaultChanged: function () {
    this.set('value', this.get('defaultValue'));
  }.observes('defaultValue'),

  willInsertElement: function () {
    if (this.get('value') !== undefined && this.get('defaultValue')) {
      this.set('value', this.get('defaultValue'));
    }
  }

});
