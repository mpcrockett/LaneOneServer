const Joi = require('joi').extend(require('@joi/date'));;
const { joiPasswordExtendCore } = require('joi-password');
const joiPassword = Joi.extend(joiPasswordExtendCore);

const newUserSchema = Joi.object({
  password: joiPassword
    .string()
    .minOfSpecialCharacters(1)
    .minOfLowercase(1)
    .minOfNumeric(1)
    .noWhiteSpaces()
    .required(),
  first_name: Joi.string()
    .min(3)
    .max(25)
    .required(),
  last_name: Joi.string()
    .min(3)
    .max(25)
    .required(),
  email: Joi.string().email().required(),
  birthday: Joi.date().format('YYYY-MM-DD').utc()
});

const userUpdatesSchema = Joi.object({
  first_name: Joi.string()
    .min(3)
    .max(25)
    .required(),
  last_name: Joi.string()
    .min(3)
    .max(25)
    .required(),
  birthday: Joi.date().format('YYYY-MM-DD').utc()
});

const passwordSchema = Joi.object({
  password: joiPassword
    .string()
    .minOfSpecialCharacters(1)
    .minOfLowercase(1)
    .minOfNumeric(1)
    .noWhiteSpaces()
    .required(),
});

module.exports = { newUserSchema, userUpdatesSchema, passwordSchema };