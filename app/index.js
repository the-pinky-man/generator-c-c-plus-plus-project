var chalk = require('chalk'),
    generators = require('yeoman-generator'),
    us = require('underscore.string');
    upperCamelCase = require('uppercamelcase'),
    upperCase = require('upper-case');

exports = module.exports = generators.Base.extend({
  _makeDestDir: function(dir) {
    var newDir = this.destinationPath(dir);
    if (!this.fs.exists(newDir)) {
      this.mkdir(newDir);
    }
  },
  _copyToDestWithTemplate: function (from, to, template) {
    this.fs.copyTpl(
      this.templatePath(from),
      this.destinationPath(to),
      template);
  },
  prompting: function () {
    var done = this.async();

    var prompts = [{
      name: 'generatorServiceName',
      message: 'What is your service\'s name ?',
      default : upperCamelCase(this.determineAppname()),
      desc: 'Name of your service. We will create a service with this name in the current directory'
    },
     {
        name: 'generatorNamespace',
        message: 'What is your Namespace ?',
        default : "lasagne",
        desc: 'Name of your namespace.'
      },
      {
      name: 'generatorActiveService',
      message: 'Will the service be an Active or Passive Service ?',
      default : 'active',
      type: 'list',
      desc: 'TODO',
        choices: [
          {
            name: 'Active',
            value: 'active'
          },
          {
            name: 'Passive',
            value: 'passive'
          }
        ]
    }];


    this.prompt(prompts, function (answers) {
      this.answers = answers;
      done();
    }.bind(this));
  },

  processActivePassive: function() {

    if(this.answers.generatorActiveService === 'active' ) {
      var done = this.async();

      var prompts = [{
        name: 'generatorNumberThreads',
        message: 'How many threads does your active service require ?',
        default : 1,
        desc: 'TODO'
      }];

      this.prompt(prompts, function (answers) {
        var propNames = Object.getOwnPropertyNames(answers);
        for (var i = 0; i < propNames.length; i++) {
          this.answers[propNames[i]] = answers[propNames[i]];
        }
        done();
      }.bind(this));
    }
  },

  processDDS_Support: function() {
    var done = this.async();

    var prompts = [{
      name: 'generatorDDS_Support',
      message: 'Does your service require DDS Support [Y/n]?',
      default : 'Y',
      desc: 'TODO'
    }];

    this.prompt(prompts, function (answers) {
      var propNames = Object.getOwnPropertyNames(answers);
      for (var i = 0; i < propNames.length; i++) {
        this.answers[propNames[i]] = answers[propNames[i]].toUpperCase();
      }
      done();
    }.bind(this));

  },

  processDDS_Vendors : function() {

    if(this.answers.generatorDDS_Support === 'Y' ) {
      var done = this.async();

      var prompts = [
        {
          name: 'generatorOpenDDS_Vendors',
          message: 'What DDS Vendors do you wish to support ?',
          //default : 'generatorDDS_VendorODDS',
          type: 'checkbox',
          desc: 'TODO',
          choices: [
            {
              name: 'Use OpenDDS?',
              value: 'generatorDDS_VendorODDS',
              checked: true
            },
            {
              name: 'Use NDDS?',
              value: 'generatorDDS_VendorNDDS',
              checked: true
            },
            {
              name: 'Use Cordex DDS?',
              value: 'generatorDDS_VendorCDDS',
              checked: true
            }
          ]
        }];

      this.prompt(prompts, function (answers) {
        var propNames = Object.getOwnPropertyNames(answers);
        for (var i = 0; i < propNames.length; i++) {
          this.answers[propNames[i]] = answers[propNames[i]];
        }
        done();
      }.bind(this));
    }
  },

  processCORBA_Support: function() {
    var done = this.async();

    var prompts = [{
      name: 'generatorCORBA_Support',
      message: 'Does your service require CORBA Support [Y/n]?',
      default : 'Y',
      desc: 'TODO'
    }];

    this.prompt(prompts, function (answers) {
      var propNames = Object.getOwnPropertyNames(answers);
      for (var i = 0; i < propNames.length; i++) {
        this.answers[propNames[i]] = answers[propNames[i]].toUpperCase();
      }
      done();
    }.bind(this));

  },

  processExtra: function() {
    var done = this.async();

    var prompts = [
      {
      name: 'generatorServiceDescription',
      message: 'What is your Service\'s description ?',
      default : upperCamelCase(this.determineAppname()) + " description",
      desc: 'Description of your Service.'
    }, {
      name: 'generatorUserEmail',
      message: 'What is your email ?',
      default : this.user.git.email(),
      desc: 'Your email, goes into package.json'
    }, {
      name: 'generatorUserName',
      message: 'What is your name ?',
      default : this.user.git.name(),
      desc: 'Your name, goes into package.json'
    }];
    this.prompt(prompts, function (answers) {
      var propNames = Object.getOwnPropertyNames(answers);
      for (var i = 0; i < propNames.length; i++) {
        this.answers[propNames[i]] = answers[propNames[i]];
      }
      done();
    }.bind(this));
  },
  fixUsername: function() {
    this.answers['generatorUserName'] = us.titleize(this.answers['generatorUserName']);
  },
  tellUserOurTemplate: function(){
    this.log('\nThe following settings will be used to generate the service project:');
    this.log('----------------------------------------------------------------------');
    this.log(this.answers);
    this.log('----------------------------------------------------------------------');
  },

  scaffoldFolders: function(){
    this._makeDestDir('src');
  },

  generateGlobals: function() {
    this.answers['generatorServiceNameUpper'] = upperCase(this.answers.generatorServiceName);
    this.answers['generatorNamespaceUpper'] = upperCamelCase(this.answers.generatorNamespace);
    this.answers['generatorDateGenerated'] = new Date().toLocaleDateString();;
  },

  generateHeader: function(){

    // Construct the guard
    this.answers['generatorHeaderGuard'] = "_" + upperCase(this.answers['generatorServiceName']) + "_" + (new Date).getTime() + "_H_";

    this.answers['generatorNumThreadsVar'] = "";

    if(this.answers.generatorActiveService === 'active' ) {
      this.answers['generatorNumThreadsVar'] = "int NUM_SVC_THREADS = " + this.answers.generatorNumberThreads ;
    }

    this.template('_src/_service.h',   'src/' + this.answers['generatorServiceName'] + '.h',   this.answers);
  },

  generateBody: function(){
    this.template('_src/_service.cpp',   'src/' + this.answers['generatorServiceName'] + '.cpp',   this.answers);
  },

  generateMpc: function(){

    if(this.answers.generatorDDS_Support === 'Y' ) {

      this.answers['generatorUseODDS'] = false;
      this.answers['generatorUseNDDS'] = false;
      this.answers['generatorUseCDDS'] = false;

      // Lets work what DDS vendors we need.
      if(this.answers['generatorOpenDDS_Vendors'].indexOf('generatorDDS_VendorODDS') != -1) {
        this.answers['generatorUseODDS'] = true;
      }
      if(this.answers['generatorOpenDDS_Vendors'].indexOf('generatorDDS_VendorNDDS') != -1) {
        this.answers['generatorUseNDDS'] = true;
      }
      if(this.answers['generatorOpenDDS_Vendors'].indexOf('generatorDDS_VendorCDDS') != -1) {
        this.answers['generatorUseCDDS'] = true;
      }

      // We need a mpb + mpc in this case
      this.template('_src/_service.mpb', './' + this.answers['generatorServiceName'] + '.mpb', this.answers);
      this.template('_src/_service.mpc', './' + this.answers['generatorServiceName'] + '.mpc', this.answers);
    } else {
      // Our mpb becomes our mpc.
      this.template('_src/_service.mpb', './' + this.answers['generatorServiceName'] + '.mpc', this.answers);
    }
  },


  finalRound: function() {
    console.log(chalk.yellow('\nService project has been generated.!\n'));
    console.log(chalk.yellow('You will now need to build your project files using MPC.'));
  }
});
