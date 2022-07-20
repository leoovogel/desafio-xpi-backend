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
    assetQuantity: joi.number().required(),
  }),
};
