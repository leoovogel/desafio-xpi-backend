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
    assetId: joi.number().required(),
    assetQuantity: joi.number().min(1).required(),
  }),

  'investments/sell': joi.object().keys({
    assetId: joi.number().required(),
    assetQuantity: joi.number().min(1).required(),
  }),

  'account/deposit': joi.object().keys({
    value: joi.number().min(1).required(),
  }),

  'account/withdrawal': joi.object().keys({
    value: joi.number().min(1).required(),
  }),
};
