const zod = require('zod');


const SignUpSchema = zod.object({
    firstname : zod
    .string({required_error : "Name is required"})
    .trim()
    .min(3 , {message : "Name must be of atleast 3 characters"})
    .max(20 , {message : "max 20 characters"}),

    lastname  : zod
    .string({required_error : "last name is required"})
    .trim()
    .min(3 , {message : "last name must be of atleast 3 characters"})
    .max(20 , {message : "max 20 characters"}),


    emailId   : zod
    .string()
    .trim()
    .email({message : "Enter a valid email"}),

    password   : zod
    .string()
    .min(6 , {message : "password must be atleast 6 characters long"})
    .max(32 , {message : "too long password atmax 32 characters"}),

})

module.exports = SignUpSchema;



/*
and now we can use this schema to validat 
input from users....

const signupschema = require();


const validate = signupshcema.safeParse(req.body)

it has returns two value ---> data , error

if(validate.success) {
}

*/