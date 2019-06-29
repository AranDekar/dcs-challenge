#!/usr/bin/env ts-node

/**
 * Instrumentation 
 */
require('newrelic');

/**
 * Module dependencies.
 */
import { listen } from '../adapter'

listen();