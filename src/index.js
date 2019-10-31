module.exports = {
    /**
     * Injects the custom error handler in the express module before importing / requiring it
     * 
     * @description
     * **IMPORTANT**
     * Must require this module and call the *inject* method **before** requiring/using express!
     * 
     * @example
     * // index.js
     * require('express-custom-error').inject();
     * // You only do this in the main file and once!
     * // Then you do your code same as usual
     * const express = require('express');
     * const app = express();
     * // .... lots of code and routes
     * app.get('/dog/:id', async (req, res) => {
     *      
     *      if (!req.params.id)
     *          throw {code: 400, message: 'You must specify id in the url params'}; // This is how you throw errors
     * 
     *      let dog = dogModel.getById(req.params.id);
     * 
     *      res.json({status: true, data: dog});
     * })
     * // ..... another lots of code and routes
     * // In order to handle errors do like this
     * // Make sure to put this error handler after every other route
     * app.use((err, req, res, next) => {
     *      // Check if there's an error! (it might not be one)
     *      if(err){
     *          // Check if its NOT a custom error
     *          if(err instanceof Error){
     *              res.status(500).json({
     *                  status: false,
     *                  message: 'Something went wrong, blame the programmer'
     *              });
     *          } else { //otherwise it IS a custom error
     *              res.status(err.code).json({
     *                  status: false,
     *                  message: err.message
     *              })
     *          }
     *      }
     * })
     * // Then you might want to handle not found routes
     * app.use('*', (req, res) => {
     *  res.status(404).json({
     *      status: false,
     *      message: 'Route not found'
     *  })
     * })
     * 
     * app.listen(3000);
     * // the rest of your code
     */
    inject: () => {
        const wrapper = (fn) => ((req, res, next) => Promise.resolve(fn(req,res,next)).catch(err => next(err)));
        Object.defineProperty(require('express/lib/router/layer').prototype, "handle", {
            enumerable: true,
            get: function () {
                return this.__handle;
            },
            set: function (m) {
                if (m.length != 4) this.__handle = wrapper(m);
                else this.__handle = m;
            }
        });
    }
}