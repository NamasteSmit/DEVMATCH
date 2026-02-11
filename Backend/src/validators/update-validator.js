const z = require('zod');

const updateSchema = z.object({
    firstname: z.string().min(3).max(50),
    lastname: z.string().min(3).max(50),
    age: z.number().int().min(0).max(150),
    gender: z.enum(["male", "female"]),
    skills: z.array(z.string()),
    about: z.string().max(500).optional(),
  }).partial(); // allows any subset

  module.exports = updateSchema;