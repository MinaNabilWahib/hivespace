const jwt = require('jsonwebtoken')
const User = require('../Models/UserSchema')
const sendEmail = require('../Service/emailTransporter')
const { generateError } = require('../Utils/handleErrors.utils')

exports.register_post = async (req, res, next) => {
  try {
    //get data from body
    const { first_name, last_name, email, password, passwordConfirm, country, phone_number } = req.body
    let user = {}
    console.log(phone_number, req.phoneNumber + '')
    user = User({
      first_name,
      last_name,
      email,
      password,
      passwordConfirm,
      country,
      phone_number: req.phoneNumber + '',
      image: '',
    })
    //save data
    await user.save()
    req.user = user.userData()
    next()
  } catch (error) {
    next(error)
  }
} //registration for users

exports.login_post = async (req, res, next) => {
  try {
    const { user, password } = req.body
    if (!user.verified) {
      generateError(400, 'Your account not verified , please verify it')
    } if (!user.password_hash) {
      generateError(403, 'you registered by social media , please, login with google or facebook account or reset your password')
    }
    if (!(await user.comparePassword(password))) generateError(403, 'Invalid Password')
    req.token = jwt.sign(user.userData(), process.env.secret_key, { expiresIn: '3d' });
    req.user = user;
    next();
    // res.status(201).json({ status: 'login successful', data: user.userData(), token })
  } catch (error) {
    next(error)
  }
} //user login

exports.me_get = async (req, res, next) => {
  try {
    const user = req.user;
    res.status(200).json({ data: user });
  } catch (error) {
    next(error);
  }
}//get me refer to JWT

exports.sendVerificationEmail = async (req, res, next) => {
  try {
    const infoHash = {}
    const user = req.user
    infoHash.user = user
    infoHash.id = user._id
    console.log(user)
    const key = eval(process.env.mail_key)
    const token = jwt.sign(infoHash, key, { expiresIn: '24h' })
    const link = `${process.env.BASE_URL}/user/verify/${user._id}/${token}`
    //generate html code
    const html = `<h3 style="color:blue;">Hello, ${user.fullName}</h3>
    <p>E-mail verification was requested for this email address ${user.email}. If you requested this verification, click the link below :</p>
    <p>
    <p style="color:red;">This link is expired with in 24 hrs</p>
      <a style="background-color:blue; color:white;padding:10px 20px;text-decoration:none; font-weight:bold;border-radius:7px" href="${link}">Verify Your Email</a>
    </p>`
    await sendEmail(user.email, 'Verify Email', html)
    res.status(201).json({ data: 'Registration successful ,An Email sent to your account please verify', token })
  } catch (error) {
    next(error)
  }
} //send email verification

exports.emailVerify = async (req, res, next) => {
  try {
    const key = process.env.mail_key
    const user = await userVerify(req, key)
    await user.update({ verified: true })
    res.status(200).json('mail verified success')
  } catch (error) {
    next(error)
  }
} //verify email on link sent

exports.sendResetPassword = async (req, res, next) => {
  try {
    const infoHash = {}
    const user = req.user
    infoHash.user = user
    infoHash.id = user._id
    const key = eval(process.env.reset_key)
    const token = jwt.sign(infoHash, key, { expiresIn: '1h' })
    const link = `${process.env.BASE_URL}/password/reset/${user._id}/${token}`
    const html = `<h3 style="color:blue;">Hello, ${user.fullName}</h3>
      <p>A password reset was requested for this email address ${user.email}. If you requested this reset, click the link below to reset your password:</p>
      <p>
      <p style="color:red;">This link is expired within 1 hr</p>
        <a style="background-color:blue; color:white;padding:10px 20px;text-decoration:none; font-weight:bold;border-radius:7px" href="${link}">Reset Your Password</a>
      </p>`
    await sendEmail(user.email, 'Reset Password', html)
    res.status(201).json({ data: 'password rest successful ,An Email sent to your account please verify', token })
  } catch (error) {
    next(error)
  }
} // send mail for reset password

exports.passVerify = async (req, res, next) => {
  try {
    const key = process.env.reset_key
    const { password, passwordConfirm } = req.body
    const user = await userVerify(req, key)
    if (await user.comparePassword(password))
      generateError(403, 'you already entered the old password ,please enter the new one or return to login page')
    user.changePassword = true
    Object.assign(user, password && { password }, password && { passwordConfirm })
    await user.save()
    res.status(201).json({ status: 'password changed successfully' })
  } catch (error) {
    next(error)
  }
} // reset password

const userVerify = async (req, key) => {
  const user = await User.findById(req.params.id)
  if (!user) {
    generateError(400, 'invalid link')
  }
  const token = jwt.verify(req.params.token, eval(key))
  if (!token) {
    generateError(400, 'invalid link')
  }
  return user
} //token and user verify

exports.generateToken = async (req, res, next) => {
  try {
    const user = req.user;
    req.token = jwt.sign(user, process.env.secret_key, { expiresIn: '3d' });
    next();
  } catch (error) {
    next(error)
  }
}

exports.sendWelcomeMail = async (req, res, next) => {
  try {
    const user = req.user;
    const token = req.token;
    let html = '';
    if (user.firstRegistration) {
      html = `<h3 style="color:blue;">Hello, ${user.fullName}</h3>
              <h4>Welcome</h4>
              <p>Thanks for signing up with us to use HiveSpace</p>`
    } else {
      html = `<h3 style="color:blue;">Hello, ${user.fullName}</h3>
              <h4>Welcome Back </h4>
              <p>Make yourself at home</p>`
    }
    await sendEmail(user.email, 'Welcome email', html);

    res.status(201).json({ status: 'login successful', data: user, token })
  } catch (error) {
    next(error)
  }
} // send welcome mail after login