/* istanbul ignore file */
import joi from 'joi';

export default {
  register: joi.object().keys({
    email: joi.string().email({ minDomainSegments: 2 }).required(),
    password: joi.string().min(8).required(),
    name: joi.string().required(),
  }),

  login: joi.object().keys({
    email: joi.string().email({ minDomainSegments: 2 }).required(),
    password: joi.string().required(),
  }),

  'investments/buy': joi.object().keys({
    clientCode: joi.string().required(),
    assetCode: joi.string().required(),
    assetAmount: joi.number().required(),
  }),
};
