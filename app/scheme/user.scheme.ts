import z from 'zod'

export const userScheme = z.object({
  // phone number i.e 0546781721
  username: z
    .string()
    .min(10)
    .max(15)
    .regex(/^[0-9]+$/, 'Username must contain only numbers'),

  //   must include symbol, number, uppercase and lowercase
  password: z.string().min(6).max(30),
  // first name
  firstname: z.string().min(2).max(30),
  // last name
  lastname: z.string().min(2).max(30),
})

export const userSignInScheme = userScheme.pick({
  username: true,
  password: true,
})

export type UserScheme = z.infer<typeof userScheme>
