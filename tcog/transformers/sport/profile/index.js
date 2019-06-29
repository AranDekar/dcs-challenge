'use strict';

// The Player Profile endpoint takes one path parameter and an optional query parameter.
//  * A :player_id param that represents the call into the Foxsports sports endpoint for the player profile
//    For example: /cricket/series/26/players/601079/stats.json
//  * A t_player_full_name query param that represents the players name to use in a Match Search in CAPI v3
//
// The endpoint then queries Foxsports and CAPI v3 and wraps their responses into a JSON result for a template

const middleware = require('../../../lib/middleware'),
    foxsports = require('./foxsports'),
    capi = require('./capi'),
    agent = require('../../agent');

module.exports = [foxsports(agent), capi(agent), middleware.templateHandler('default')];
