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