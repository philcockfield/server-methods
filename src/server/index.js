import _ from 'lodash';
import Method from './Method';
import state from './state';
import middleware from './middleware';

let isInitialized = false;


/**
* API for registering methods.
*/
export default {
  /**
  * Initializes the server module.
  *
  * @param connect: The connect app to apply the middleware to.
  * @param options:
  *           - path: Optional. The base URL path for AJAX calls.
  *                       Default: /server-methods/
  */
  init(connect, options = {}) {
    if (isInitialized) { throw new Error('Already initialized.'); }
    connect.use(middleware(options.path || '/server-methods/'));
    isInitialized = true;
  },


  /**
  * Registers or retrieves the complete set of methods.
  *
  * @param definition: An object containing the method definitions
  *                    taking the form of:
  *
  *                       { 'name':func(err, result) }
  *
  * @return an object containing the set of method definitions.
  */
  methods(definition) {
    // Write: store method definitions if passed.
    if (definition) {
      _.keys(definition).forEach((key) => {
          let methods = state.methods;
          if (methods.get(key)) { throw new Error(`Method '${ key }' already exists.`); }
          state.methods = methods.set(key, new Method(key, definition[key]));
      });
    }

    // Read.
    return state.methods.toObject();
  }

};
