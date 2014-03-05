export default Ember.Component.extend({

  // map action to formbuilder-widget action...
  notify: 'notify',

  control: Ember.Object.create(),

  successMsg    : ' File upload complete.',
  defaultClasses: 'icon-paper-clip',

  didInsertElement: function () {

    var self = this;

    this.$container = this.$('.wy-form-upload-container');
    this.$upload    = this.$('.wy-form-upload');
    this.$url       = this.$('.wy-form-upload-url');
    this.$loading   = this.$('.wy-form-upload .image-loading');
    this.$uploadBtn = this.$('.wy-form-upload-content button');

    this.set('defaultText', this.$uploadBtn.text());

    // create uploader with required params
    this.uploader = new Webhook.Uploader(window.ENV.uploadUrl, this.get('session.site.name'), this.get('session.site.token'));

    // when a file is selected, upload
    this.$uploadBtn.selectFile({
      accept: this.get('selectAccept'),
      multiple: this.get('selectMultiple')
    }).on('selectedFile', function (event, file) {

      self.beforeUpload.call(self, file);

      // upload returns promise
      var uploading = self.uploader.upload(file);

      uploading.progress(function (event) {
        self.progressUpload.call(self, file, Math.ceil((event.loaded * 100) / event.total));
      });

      uploading.done(function (response) {
        self.doneUpload.call(self, file, response.url);
      });

      uploading.always(function () {
        self.afterUpload.call(self, file);
      });

    });

    this.$('.wy-form-upload-url .upload-url').on('click', function () {
      this.$uploadBtn.upload('upload', this.$('.wy-form-upload-url input').val());
      this.$('.wy-form-upload-url input').val('');
    }.bind(this));

    this.$('.upload-method-toggle').on('click', function () {
      this.$('.wy-form-upload-container, .wy-form-upload-url').toggle();
    }.bind(this));

    var resetButton = function () {
      this.$('.wy-form-upload-content button')
        .removeClass('icon-desktop icon-arrow-down btn-success')
        .addClass(this.get('defaultClasses'))
        .text(this.get('defaultText'));
    }.bind(this);

    // Dropzone behavior
    this.$uploadBtn.dropzone().on({
      dropzonewindowenter: function () {
        $(this)
          .removeClass('icon-image icon-desktop btn-neutral')
          .addClass('icon-arrow-down btn-success')
          .text(' Drop files here');
      },
      dropzonewindowdrop: resetButton,
      dropzonewindowleave: resetButton,
      drop: function (event) {
        Ember.$.each(event.originalEvent.dataTransfer.files, function (index, file) {
          $(this).trigger('selectedFile', file);
        }.bind(this));
        resetButton();
      }
    });

    // Just some additional styles
    this.$uploadBtn.on({
      mouseenter: function () {
        $(this)
          .removeClass(self.get('defaultClasses'))
          .addClass('icon-desktop btn-neutral')
          .text(' Select from desktop');
      },
      mouseleave: resetButton
    });
  },

  beforeUpload: function (file) {
    this.$container.show();
    this.$url.hide();
    this.$uploadBtn.hide();
    this.$loading.css('display', 'inline-block');
  },

  progressUpload: function (file, percentage) {
    if (percentage < 100) {
      this.$loading.find('span').html('Uploading <span>' + percentage + '%</span>');
    } else {
      this.$loading.find('span').text('Finishing up...');
    }
  },

  doneUpload: function (file, url) {
    this.set('control.value', url);
    this.sendAction('notify', 'success', this.get('successMsg'));
  },

  afterUpload: function () {
    this.$loading.hide();
    this.$uploadBtn.show();
  },

  actions: {
    clear: function () {
      this.set('control.value', null);
    }
  }
});