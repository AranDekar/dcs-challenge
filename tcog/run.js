/**
 * Instrumentation.
 */
require('newrelic');

/**
 * Module dependencies.
 */
require('./service').run(3000);
