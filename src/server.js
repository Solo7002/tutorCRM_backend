require('dotenv').config();
const http = require('http');
const app = require('./app');

const PORT = process.env.PORT;

const server = http.createServer(app);

const { sendEmail } = require('./services/emailService');

sendEmail(
    'nikitasiskov737@gmail.com',
    'My Brevo Test Email',
    'This is a test email sent via Brevo. SDAOIPkjfpsdfmockvnpsdojn psidjvn psdikjnvc psdkjnfv pksdjnf piksdjnvg psekdfjnvb pskefjvn pskfdjvn pdskfjvn pdsfkjv nspdfj vnsdfpj vn',
    '<strong>    This is a test email sent via Brevo. SDAOIPkjfpsdfmockvnpsdojn psidjvn psdikjnvc psdkjnfv pksdjnf piksdjnvg psekdfjnvb pskefjvn pskfdjvn pdskfjvn pdsfkjv nspdfj vnsdfpj vn</strong>'
  ).catch(console.error);


server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});