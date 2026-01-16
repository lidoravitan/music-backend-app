import z from 'zod'

export const userScheme = z.object({
  // phone number i.e +972546781721
  username: z
    .string()
    .min(10)
    .max(15)
    .regex(/^\+\d+$/),
  //   must include symbol, number, uppercase and lowercase
  password: z.string().min(6).max(30),
  // first name
  firstName: z.string().min(2).max(30),
  // last name
  lastName: z.string().min(2).max(30),
})
