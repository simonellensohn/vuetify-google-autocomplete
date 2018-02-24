export default {
  name: 'vuetify-google-autocomplete',
  props: {
    appendIcon: {
      type: String,
      default: undefined,
    },
    appendIconCb: {
      type: Function,
      default: null,
    },
    autoGrow: {
      type: Boolean,
      default: false,
    },
    autofocus: {
      type: Boolean,
      default: false,
    },
    box: {
      type: Boolean,
      default: false,
    },
    clearable: {
      type: Boolean,
      default: false,
    },
    color: {
      type: String,
      default: 'primary',
    },
    counter: {
      type: [Boolean, Number],
      default: undefined,
    },
    country: {
      type: [String, Array],
      default: null,
    },
    classname: {
      type: String,
      default: '',
    },
    dark: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    dontFillMaskBlanks: {
      type: Boolean,
      default: false,
    },
    enableGeolocation: {
      type: Boolean,
      default: false,
    },
    error: {
      type: Boolean,
      default: false,
    },
    errorMessages: {
      type: Array,
      default: () => [],
    },
    flat: {
      type: Boolean,
      default: false,
    },
    fullWidth: {
      type: Boolean,
      default: false,
    },
    hideDetails: {
      type: Boolean,
      default: true,
    },
    hint: {
      type: String,
      default: undefined,
    },
    id: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      default: undefined,
    },
    light: {
      type: Boolean,
      default: false,
    },
    loadGoogleApi: {
      type: Boolean,
      default: true,
      required: false,
    },
    loading: {
      type: [Boolean, String],
      default: false,
    },
    mask: {
      type: String,
      default: undefined,
    },
    multiLine: {
      type: Boolean,
      default: false,
    },
    noResize: {
      type: Boolean,
      default: false,
    },
    persistentHint: {
      type: Boolean,
      default: false,
    },
    placeholder: {
      type: String,
      default: undefined,
    },
    prefix: {
      type: String,
      default: undefined,
    },
    prependIcon: {
      type: String,
      default: undefined,
    },
    prependIconCb: {
      type: Function,
      default: null,
    },
    readonly: {
      type: Boolean,
      default: false,
    },
    required: {
      type: Boolean,
      default: false,
    },
    returnMaskedValue: {
      type: Boolean,
      default: false,
    },
    rowHeight: {
      type: [Number, String],
      deffault: 24,
    },
    rows: {
      type: [Number, String],
      default: 5,
    },
    rules: {
      type: Array,
      default: () => [],
    },
    singleLine: {
      type: Boolean,
      default: false,
    },
    solo: {
      type: Boolean,
      default: false,
    },
    soloInverted: {
      type: Boolean,
      default: false,
    },
    suffix: {
      type: String,
      default: undefined,
    },
    tabindex: {
      default: 0,
    },
    textarea: {
      type: Boolean,
      default: false,
    },
    toggleKeys: {
      type: Array,
      default: () => [13, 32],
    },
    type: {
      type: String,
      default: 'text',
    },
    types: {
      type: String,
      default: 'address',
    },
    validateOnBlur: {
      type: Boolean,
      default: false,
    },
    value: {
      default: undefined,
      required: true,
    },
  },
  // eslint-disable-next-line
  data: () => {
    return {
      /**
       * The Autocomplete object.
       *
       * @type {Autocomplete}
       * @link https://developers.google.com/maps/documentation/javascript/reference#Autocomplete
       */
      autocomplete: null,

      /**
       * Autocomplete input text
       * @type {String}
       */
      autocompleteText: '',

      /**
       * Indicates if the Geolocate has already been set.
       */
      geolocateSet: false,

      /**
       * Interval for loading Google Maps.
       */
      loadInterval: null,

      /**
       * Global Google Maps State Watcher.
       */
      googeMapState: window.googeMapState,
    };
  },
  methods: {
    /**
     * When the input gets focus
     */
    onFocus() {
      this.geolocate();
      this.$emit('focus');
    },

    /**
     * When the input loses focus
     */
    onBlur() {
      this.$emit('blur');
    },

    /**
     * When the input got changed
     */
    onChange() {
      this.$emit('change', this.autocompleteText);
    },

    /**
     * When a key gets pressed
     * @param  {Event} event A keypress event
     */
    onKeyPress(event) {
      this.$emit('keypress', event);
    },

    /**
     * Clear the input
     */
    clear() {
      this.autocompleteText = '';
    },

    /**
     * Focus the input
     */
    focus() {
      this.$refs.autocomplete.focus();
    },

    /**
     * Blur the input
     */
    blur() {
      this.$refs.autocomplete.blur();
    },

    /**
     * Update the value of the input
     * @param  {String} value
     */
    update(value) {
      this.autocompleteText = value;
    },

    // Bias the autocomplete object to the user's geographical location,
    // as supplied by the browser's 'navigator.geolocation' object.
    geolocate() {
      if (this.enableGeolocation && !this.geolocateSet) {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition((position) => {
            const geolocation = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };
            const circle = new window.google.maps.Circle({
              center: geolocation,
              radius: position.coords.accuracy,
            });
            this.autocomplete.setBounds(circle.getBounds());
            this.geolocateSet = true;
          });
        }
      }
    },

    setupGoogle() {
      const options = {};

      if (this.types) {
        options.types = [this.types];
      }

      if (this.country) {
        options.componentRestrictions = {
          country: this.country,
        };
      }

      this.autocomplete = new window.google.maps.places.Autocomplete(
        document.getElementById(this.id),
        options,
      );

      // Override the default placeholder
      // text set by Google with the
      // placeholder prop value.
      document.getElementById(this.id).setAttribute('placeholder', this.placeholder);

      this.autocomplete.addListener('place_changed', () => {
        const place = this.autocomplete.getPlace();

        if (!place.geometry) {
          // User entered the name of a Place that was not suggested and
          // pressed the Enter key, or the Place Details request failed.
          this.$emit('no-results-found', place);
          return;
        }

        const addressComponents = {
          street_number: 'short_name',
          route: 'long_name',
          locality: 'long_name',
          administrative_area_level_1: 'short_name',
          country: 'long_name',
          postal_code: 'short_name',
        };

        const returnData = {};

        if (place.address_components !== undefined) {
          // Get each component of the address from the place details
          for (let i = 0; i < place.address_components.length; i += 1) {
            const addressType = place.address_components[i].types[0];

            if (addressComponents[addressType]) {
              const val = place.address_components[i][addressComponents[addressType]];
              returnData[addressType] = val;
            }
          }

          returnData.latitude = place.geometry.location.lat();
          returnData.longitude = place.geometry.location.lng();

          // return returnData object and PlaceResult object
          this.$emit('placechanged', returnData, place, this.id);

          // update autocompleteText then emit change event
          this.autocompleteText = document.getElementById(this.id).value;
          this.onChange();
        }
      });
    },
  },
  created() {
    // Set the default model if provided.
    this.autocompleteText = this.value ? this.value : '';
  },
  render(createElement) {
    return createElement('v-text-field', {
      attrs: {
        id: this.id,
        name: this.id,
      },
      props: {
        'append-icon': this.appendIcon,
        'append-icon-cb': this.appendIconCb,
        'auto-grow': this.autoGrow,
        autofocus: this.autofocus,
        box: this.box,
        clearable: this.clearable,
        color: this.color,
        counter: this.counter,
        class: this.classname,
        dark: this.dark,
        disabled: this.disabled,
        'dont-fill-mask-blanks': this.dontFillMaskBlanks,
        error: this.error,
        'error-messages': this.errorMessages,
        'full-width': this.fullWidth,
        'hide-details': this.hideDetails,
        hint: this.hint,
        label: this.label,
        light: this.light,
        loading: this.loading,
        mask: this.mask,
        'multi-line': this.multiLine,
        'no-resize': this.noResize,
        'persistent-hint': this.persistentHint,
        placeholder: this.placeholder,
        prefix: this.prefix,
        'prepend-icon': this.prependIcon,
        'prepend-icon-cb': this.prependIconCb,
        readonly: this.readonly,
        required: this.required,
        'return-masked-value': this.returnMaskedValue,
        'row-height': this.rowHeight,
        rows: this.rows,
        rules: this.rules,
        ref: 'autocomplete',
        'single-line': this.singleLine,
        solo: this.solo,
        'solo-inverted': this.soloInverted,
        suffix: this.suffix,
        tabindex: this.tabindex,
        textarea: this.textarea,
        'toggle-keys': this.toggleKeys,
        type: this.type,
        'validate-on-blur': this.validateOnBlur,
        '@focus': this.onFocus(),
        '@blur': this.onFocus(),
        '@change': this.onChange(),
        '@keypress': this.onKeyPress(),
      },
      domProps: {
        value: this.autocompleteText,
      },
      on: {
        focus: () => {
          this.onFocus();
        },
        blur: () => {
          this.onBlur();
        },
        change: () => {
          this.onChange();
        },
        keypress: (e) => {
          this.onKeyPress(e.target.value);
        },
      },
    }, []);
  },
  watch: {
    /**
    * Emit the new autocomplete text whenever it changes.
    */
    autocompleteText: function autocompleteText(newVal) {
      this.$emit('input', newVal || '');
    },

    /**
    * Update the SDK country option whenever it changes from the parent.
    */
    country: function country(newVal) {
      if (newVal) {
        this.autocomplete.componentRestrictions.country = newVal;
      }
    },

    /**
    * Watches for changes on the Geolocation option.
    */
    enableGeolocation: function enableGeolocation(newVal) {
      if (!newVal) {
        this.geolocateSet = false;
      }

      this.enableGeolocation = newVal;
    },

    'googeMapState.initMap': function googeMapStateInitMap(value) {
      if (value) {
        this.setupGoogle();
      }
    },

    /**
    * Update the SDK types option whenever it changes from the parent.
    */
    types: function types(newVal) {
      if (newVal) {
        this.autocomplete.setTypes([this.types]);
      }
    },
  },
};
