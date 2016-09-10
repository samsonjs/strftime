Package.describe({
  name: 'kalarani:strftime',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: 'strftime for JavaScript',
  // URL to the Git repository containing the source code for this package.
  git: 'git://github.com/samsonjs/strftime.git',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.1.0.2');
  api.addFiles('strftime.js');
});

Package.onTest(function(api) {
  api.use('peerlibrary:assert');
  api.use('kalarani:strftime');
  api.addFiles('strftime-tests.js');
});
