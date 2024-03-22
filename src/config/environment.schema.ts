import * as Joi from 'joi';

export default Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
  POSTGRES_URI: Joi.string().default(
    'postgres://postgres:postgres@localhost:5432/kindred_dev',
  ),
  MONGODB_TEST_URI: Joi.string().default(
    'mongodb://localhost:27017/mentor-techies-test',
  ),
  PORT: Joi.number().default(60061),
  JWT_SECRET: Joi.string().default('my-super-secure-jwt-secret'),
});
