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
      this.emailsPath = path.join(path.resolve(__dirname), '..', '..', options.emailsPath);
      this.viewsPath = path.join(path.resolve(__dirname), '..', '..', options.viewsPath);
    } else {
      this.emailsPath = path.join(path.resolve(__dirname), '..', '..', 'emails');
      this.viewsPath = path.join(path.resolve(__dirname), '..', '..', 'emails');
    }
  }

  /** Loads the email json file from the file system and parses it to a javascript object
   * @param {string} name - name of the email json template to load
   */
  loadEmail(name) {
    const email = fs.readFileSync(path.join(this.emailsPath, name + '.json')).toString();
    return JSON.parse(email);
  }

  /** Loads an html file containing the view template of emails. The html templates can contain variables which correspond with either properties in the json email templates or variables that are passed as properties of the context object passed to the body() method. Variables are denoted with the double curly braces handlebars syntax (i.e. {{someVariable}})
   * @param {string} name - name of the email html view to load
   */
  loadView(name) {
    return fs.readFileSync(path.join(this.viewsPath, name + '.html')).toString();
  }

  /** Loads the content of a specific language
   * @param {string} lang - the language to load, needs to correspond to a defined language property in the content object
   * @param {object} content - an object containing all contents, typically retrieved via loadEmail() method from the email template json file
   */
  loadContent(lang, content) {
    return content[lang];
  }

  /** Adds variables contextual variables passed from the code to the rest of the body
   * @param {object} body - object with the content blocks as properties
   * @param {object} context - object with the additional variables as properties
   */
  prepareVars(body, context) {
    if (context === undefined) {
      const context = {};
    }
    return Object.assign(body, context);
  }

  /** Replaces a string encapsulated in double curly braces with the strings defined in the properties of the context object
   * @param {string} string - the string containing the text with defined variables
   * @param {object} context - object with the context variables as properties
   */
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

  /** Compiles the template with handlebars, replacing all variables with the corresponding content
   * @param {string} html - the html view as a string containing variables denoted with the double curly braces syntax (i.e. {{someVariable}})
   * @param {object} vars - object with properties corresponding to the variables defined in the html view
   */
  compileTemplate(html, vars) {
    const template = hbs.compile(html);
    return template(vars)
  }

  /** Returns the compiled email body as a string
   * @param {object} [context] - contextual variables as object properties passed from the code
   * @return {string} The html of the email as a string
   */
  body(context) {
    const email = this.loadEmail(this.name);
    const html = this.loadView(email.view);
    const body = this.loadContent(this.lang, email.content).body;
    const vars = this.prepareVars(body, context);
    const template = this.compileTemplate(html, vars);
    return template;
  }

  /** Returns the compiled subject line as a string
   * @param {object} [context] - contextual variables as object properties passed from the code
   * @return {string} The subject line of the email as a string
   */
  subject(context) {
    const email = this.loadEmail(this.name);
    let subject = this.loadContent(this.lang, email.content).subject;
    subject = this.replaceString(subject, context);
    return subject;
  }

  /** Returns the from field as a string
   * @param {object} [context] - contextual variables as object properties passed from the code
   * @return {string} The from field as a string
   */
  from(context) {
    const email = this.loadEmail(this.name);
    let from = email.from;
    from = this.replaceString(from, context);
    return from;
  }
}

module.exports = HtmlEmail;