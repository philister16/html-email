const path = require('path');
const fs = require('fs');
const hbs = require('handlebars');

/** Global class from which a new HtmlEmail object is created */
class HtmlEmail {

  /** Class constructor for HtmlEmail class. Takes 3 arguments.
   * @constructor
   * @param {string} name - Name of the email json template to be used
   * @param {string} lang - The language to be used. This must match the notation used in the json template. A common pattern is to follow the 2 char shorthand, i.e. 'en' for English or 'de' for German.
   * @param {object} [options] - A configuration object
   * @param {string} [options.emailsPath=emails] - The path leading to the folder where the email json teamplates live. Defaults to an 'emails' folder at the root of the project.
   * @param {string} [options.viewsPath=views] - The path leading to the folder where the html views of the emails live. Defaults to an 'views' folder at the root of the project.
   */
  constructor(name, lang, options) {
    this.name = name;
    this.lang = lang;
    if (options !== undefined) {
      this.emailsPath = path.join(path.resolve(__dirname), options.emailsPath);
      this.viewsPath = path.join(path.resolve(__dirname), options.viewsPath);
    } else {
      this.emailsPath = path.join(path.resolve(__dirname), 'emails');
      this.viewsPath = path.join(path.resolve(__dirname), 'views');
    }
  }

  /** Loads the email json file from the file system and parses it to a javascript object
   * @param {string} name - name of the email json template to load
   */
  loadEmail(name) {
    const email = fs.readFileSync(path.join(this.emailsPath, name + '.json')).toString();
    return JSON.parse(email);
  }

  loadView(name) {
    return fs.readFileSync(path.join(this.viewsPath, name + '.html')).toString();
  }

  loadContent(lang, content) {
    return content[lang];
  }

  prepareVars(body, context) {
    if (context === undefined) {
      const context = {};
    }
    return Object.assign(body, context);
  }

  replaceString(string, context) {
    if (context === undefined) {
      return string;
    } else {
      for (var key in context) {
        if (context.hasOwnProperty(key)) {
          string = string.replace('{{' + key + '}}', context[key]);
        }
      }
      return string;
    }
  }

  compileTemplate(html, vars) {
    const template = hbs.compile(html);
    return template(vars)
  }

  body(context) {
    const email = this.loadEmail(this.name);
    const html = this.loadView(email.view);
    const body = this.loadContent(this.lang, email.content).body;
    const vars = this.prepareVars(body, context);
    const template = this.compileTemplate(html, vars);
    console.log(template);
    return template;
  }

  subject(context) {
    const email = this.loadEmail(this.name);
    let subject = this.loadContent(this.lang, email.content).subject;
    subject = this.replaceString(subject, context);
    console.log(subject);
    return subject;
  }

  from(context) {
    const email = this.loadEmail(this.name);
    let from = email.from;
    from = this.replaceString(from, context);
    console.log(from);
    return from;
  }
}

module.exports = HtmlEmail;