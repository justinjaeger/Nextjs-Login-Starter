import wrapper from 'utils/wrapper';
import emailController from 'controllers/emailController';
import loginController from 'controllers/loginController';

/**
 * When the user submits "forgot password", which sends an email
 */

const handler = async (req, res) => {

  try {
    const { email } = req.body.email;
    res.locals.email = email;

    /* Check if email is valid */
    if (!email.includes('@') || !email.includes('.') ) {
      return res.json({ error : 'this email is not properly formatted' });
    };

    /* Check if email exists -- if no, don't send an email */
    await loginController.ifEmailNoExistDontSend(req, res);
    /* Send password reset email */
    await emailController.sendResetPasswordEmail(req, res);

    res.sendCookies();
    return res.json({ 
      message: `An email was sent to ${req.body.email}.`,
      route: '/blank',
    });
  } 

  catch(e) {
    console.log('error ', e)
    return res.status(500).send(e.message);
  }

};

export default wrapper(handler);
