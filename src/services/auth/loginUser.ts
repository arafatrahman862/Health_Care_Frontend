"use server"

import z, { success } from "zod";

const loginValidationZodSchema = z.object({
    email: z.email({ error: "Invalid email address" }),
    password: z.string().min(6, "Password must be at least 6 characters long").max(100, "Password must be less than 100 characters long")
})

export const loginUser = async (_currentState: any, formData: any): Promise<any> => {
    try {



        const loginData = {
            email: formData.get('email'),
            password: formData.get('password')
        }

        const validatedFields = loginValidationZodSchema.safeParse(loginData);
        console.log(validatedFields);

        if(!validatedFields.success) {
            return {
                success: false,
                errors: validatedFields.error.issues.map(issue => {
                    return {
                        field: issue.path[0],
                        message: issue.message
                    }
                })
            }
        }

            

const res = await fetch("http://localhost:5000/api/v1/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(loginData)
        }).then(res => res.json());

        return res;

    }
    catch (error) {
        console.log(error);
        return { error: "An error occurred while logging in" };
    }
}