const ConsoleReporter = require('jasmine-console-reporter');
const Jasmine = require('jasmine');

const SCHEMA_SPEC = 'packages/jsdoc/test/specs/jsdoc/schema.js';
const SPEC_FILES = [
  `!${SCHEMA_SPEC}`,
  '!node_modules',
  'packages/**/test/specs/**/*.js',
  SCHEMA_SPEC,
];

module.exports = (deps) => {
  const jasmine = new Jasmine();
  const matcher = deps.get('options').matcher;
  const reporter = new ConsoleReporter({
    beep: false,
    verbosity: {
      disabled: false,
      pending: false,
      specs: false,
      summary: true,
    },
  });

  // Treat an unhandled promise rejection as an error.
  process.on('unhandledRejection', (e) => {
    throw e;
  });

  jasmine.clearReporters();
  jasmine.addReporter(reporter);
  jasmine.exitOnCompletion = false;
  jasmine.loadConfig({
    helpers: [
      'node_modules/jasmine-expect/index.js',
      'node_modules/@jsdoc/test-matchers/index.js',
      'packages/jsdoc/test/helpers/**/*.js',
    ],
    random: false,
    stopSpecOnExpectationFailure: false,
  });

  // Make dependencies available to all tests.
  if (!global.jsdoc) {
    global.jsdoc = {};
  }
  global.jsdoc.deps = deps;

  return jasmine.execute(SPEC_FILES, matcher);
};
