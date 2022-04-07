const jwt = require('jsonwebtoken')
const User = require('../Models/UserSchema')
const sendEmail = require('../Service/emailTransporter')
const { generateError } = require('../Utils/handleErrors.utils')

exports.register_post = async (req, res, next) => {
  try {
    //get data from body
    const { first_name, last_name, email, password, passwordConfirm, country, phone_number } = req.body
    let user = {}
    console.log(phone_number, req.phoneNumber + '');
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
    await user.save();
    req.user = user.userData();
    next();
  } catch (error) {
    next(error)
  }
} //registration for users


exports.sendVerificationEmail = async (req, res, next) => {
  try {
    const infoHash = {};
    const user = req.user;
    infoHash.user = user;
    infoHash.id = user._id;
    console.log(user);
    const key = eval(process.env.mail_key);
    const token = jwt.sign(infoHash, key, { expiresIn: "24h" });
    const link = `${process.env.BASE_URL}/user/verify/${user._id}/${token}`;
    //generate html code
    const html = `<h3 style="color:blue;">Hello, ${user.fullName}</h3>
    <p>E-mail verification was requested for this email address ${user.email}. If you requested this verification, click the link below :</p>
    <p>
      <a style="background-color:blue; color:white;padding:10px 20px;text-decoration:none; font-weight:bold;border-radius:7px" href="${link}">Verify Your Email</a>
    </p>`
    await sendEmail(user.email, "Verify Email", html);
    res.status(201).json({ data: "Registration successful ,An Email sent to your account please verify", token });
  } catch (error) {
    next(error)
  }
}//send email verification

exports.emailVerify = async (req, res, next) => {
  try {
    const key = process.env.mail_key;
    const user = await userVerify(req, key);
    await user.update({ verified: true })
    res.status(200).json("mail verified success")
  } catch (error) {
    next(error)
  }
}//verify email on link sent

const userVerify = async (req, key) => {
  const user = await User.findById(req.params.id);
  if (!user) { generateError(400, "invalid link") }
  const token = jwt.verify(req.params.token, eval(key));
  if (!token) { generateError(400, "invalid link") }
  return user;
}//token and user verify

