/* istanbul ignore file */
import joi from 'joi';

export default {
  'investments/buy': joi.object().keys({
    clientCode: joi.string().required(),
    assetCode: joi.string().required(),
    assetAmount: joi.number().required(),
  }),
};
