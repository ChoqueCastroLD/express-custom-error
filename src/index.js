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
        const Layer = require('express/lib/router/layer');
        const wrapper = (fn) => ((req, res, next) => {
            try {
                Promise.resolve(fn(req, res, next)).catch(err => next(err));
            } catch (error) {
                next(error)
            }
        });
        Object.defineProperty(Layer.prototype, "handle", {
            enumerable: true,
            get: function () {
                return this.__handle;
            },
            set: function (m) {
                if (m.length != 4) this.__handle = wrapper(m);
                else this.__handle = m;
            }
        });
    },
    /** Example Midleware that handle various errors */
    errorHandler: (err, req, res, next) => {
        if (err) {
            let message = 'An error ocurred, try again later';

            if (typeof err === 'string') {
                message = err;
            } else {
                if (err.message) {
                    message = err.message;
                } else {
                    if (err.json) {
                        if (err.json.message) {
                            message = err.json.message;
                        }
                    }
                }
            }

            res.status(err.code || 500)
                .json({
                    status: false,
                    message
                });
        } else {
            next();
        }
    }
}