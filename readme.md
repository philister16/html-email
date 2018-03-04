# HtmlEmail

## About

This module exposes a simple class to make it easy to generate html emails from node applications. It lets you define emails as json objects with any number of languages and variable content blocks and match these to independent html views. View and content remain separated and will be compiled at runtime with a little help of handlebars.

## Quick guide

Install the node module with npm.

```bash
$ npm install html-email --save
```

Create the email content template json file.

```json
{
  "name": "welcome",
  "view": "main",
  "from": "Team {{country}}",
  "content": {
    "en": {
      "subject": "Welcome, {{firstname}} {{lastname}}!",
      "body": {
        "heading": "Nice to meet you!",
        "main": "Great to have you onboard. This is an email to just say Hi! Let us know if there is anything we can do for you and ask our lovely community for help, too. Now enjoy the ride.",
        "footer": "See you around - the team"
      }
    },
    "de": {
      "subject": "Willkommen, {{firstname}} {{lastname}}",
      "body": {
        "heading": "Herzlich willkommen!",
        "main": "Wir freuen uns dich bei uns begrüssen zu dürfen. Mit dieser Email wollen wir nur mal kurz Hallo sagen. Lass uns wissen wenn du fragen hast und unsere aktive Community hilft auch immer gern weiter. Viel Spass!",
        "footer": "Bis bald - dein Team"
      }
    }
  }
}
```

Create an html view that uses the contents of the template json. As many content blocks can be defined as variables in the json as needed. The content is dynamically placed in the document using the double curly braces handlebars syntax. The variables correspond with properties on the json's body object as well as with variables passed dynamically from the code (in this example only the 'link' variable).

```html
<!--Beginning of html document with head and start of body-->
<h1>{{heading}}</h1>
<p>{{main}}</p>
<img src="{{link}}">
<footer>{{footer}}</footer>
<!--Rest of the html document>
```

In the node app require the module and use its 3 main methods: body(), subject() and from().

```javascript
const HtmlEmail = require('../index');

const email = new HtmlEmail('welcome', 'en', {
  emailsPath: 'testing/emails',
  viewsPath: 'testing/views'
});
email.body({
  link: 'http://www.rhinerock.com'
});
email.subject({
  firstname: 'Phil',
  lastname: 'Nash'
});
email.from({
  country: 'Switzerland'
});
```

## License

Copyright 2018 Philipp S. Nueesch

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.