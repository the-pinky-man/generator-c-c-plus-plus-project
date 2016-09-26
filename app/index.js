var chalk = require('chalk'),
    generators = require('yeoman-generator'),
    us = require('underscore.string');
    upperCamelCase = require('uppercamelcase')

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
    }, {
      name: 'generatorActiveService',
      message: 'Will the service be an Active or Passive Service ?',
      default : 'true',
      desc: 'TODO'
    }];


    this.prompt(prompts, function (answers) {
      this.answers = answers;
      done();
    }.bind(this));
  },

  processActivePassive: function() {

    if(this.answers.generatorActiveService === 'true' ) {
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
      message: 'Does your service require DDS Support ?',
      default : 'true',
      desc: 'TODO'
    }];

    this.prompt(prompts, function (answers) {
      var propNames = Object.getOwnPropertyNames(answers);
      for (var i = 0; i < propNames.length; i++) {
        this.answers[propNames[i]] = answers[propNames[i]];
      }
      done();
    }.bind(this));

  },

  processDDS_Vendors : function() {

    if(this.answers.generatorDDS_Support === 'true' ) {
      var done = this.async();

      var prompts = [{
        name: 'generatorDDS_VendorODDS',
        message: 'Do you wish to support OpenDDS ?',
        default : 'true',
        desc: 'TODO'
      }, {
        name: 'generatorDDS_VendorNDDS',
        message: 'Do you wish to support NDDS ?',
        default : 'true',
        desc: 'TODO'
      },{
        name: 'generatorDDS_VendorCDDS',
        message: 'Do you wish to support Cordex DDS ?',
        default : 'true',
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

  processCORBA_Support: function() {
    var done = this.async();

    var prompts = [{
      name: 'generatorCORBA_Support',
      message: 'Does your service require CORBA Support ?',
      default : 'true',
      desc: 'TODO'
    }];

    this.prompt(prompts, function (answers) {
      var propNames = Object.getOwnPropertyNames(answers);
      for (var i = 0; i < propNames.length; i++) {
        this.answers[propNames[i]] = answers[propNames[i]];
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
  copyFiles: function(){
    //this.copy('_gitignore', '.gitignore');
    //this.template('_AUTHORS', 'AUTHORS', this.answers);
    //this.template('_LICENCE.md', 'LICENCE.md', this.answers);
    //this.template('_README.md', 'README.md', this.answers);

    // src dir
    this.template('_src/_service.h',   'src/' + this.answers['generatorServiceName'] + '.h',   this.answers);
    this.template('_src/_service.cpp', 'src/' + this.answers['generatorServiceName'] + '.cpp', this.answers);
  },
  finalRound: function() {
    console.log(chalk.yellow('\nService project has been generated.!\n'));
    console.log(chalk.yellow('You will now need to build your project files using MPC.'));
  }
});
