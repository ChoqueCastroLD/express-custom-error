module.exports = {
    /**
     * Injects the custom error handler in the express module before importing / requiring it
     * 
     * @example
     * // You only do this in the main file and once!
     * require('express-custom-error').inject();
     * // Then you do your code same as usual
     * const express = require('express');
     */
    inject: () => {
        const wrapper = (fn) => ((req, res, next) => {
            try {
                Promise.resolve(fn(req,res,next)).catch(err => next(err));
            } catch (error) {
                next(error)
            }
        });
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