export default Ember.View.extend({

  templateName: 'components/formbuilder-widget',

  classNames: ['wy-control-group'],

  classNameBindings: [
    'content.required:wy-control-group-required',
    'content.hidden:wy-control-group-hidden',
    'content.widgetIsValid::wy-control-group-error',
    'controlClass',
    'content.disabled:wy-control-group-disabled',
    'content.isPlaceholder:wy-control-group-placeholder'
  ],

  controlClass: function () {
    return 'wy-control-group-' + this.get('content.controlType.widget');
  }.property(),

  didInsertElement: function () {
    if (this.get('content.name') === 'name') {
      this.$().hide();
    }
  },

  templateVar: function () {
    return '{{ item.%@ }}'.fmt(this.get('content.name'));
  }.property('content.name'),

  setIsWidget: function () {
    var widgetVar = 'is_%@_widget'.fmt(this.get('content.controlType.widget')).camelize();
    this.set(widgetVar, true);
  }.on('init'),

  useDefaultLayout: function () {

    var widget = this.get('content.controlType.widget');

    if (widget === 'instruction') {
      return false;
    }

    return true;

  }.property()

});
