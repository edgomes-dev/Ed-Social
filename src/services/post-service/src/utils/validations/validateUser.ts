import { Request, Response, NextFunction } from "express";
import Joi, { ValidationResult } from "joi";

const postSchema = Joi.object({       
    text: Joi.string().required().min(20),
    img: Joi.string().required(),
    coments: Joi.boolean().required(),
    likes: Joi.boolean().required()
})

export const validateUser = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    let result: ValidationResult = postSchema.validate(
        req.body,
        { abortEarly: false }
    );

    if(result.error) {
        return res.status(422).json({
            message: 'Invalid request data',
        });
    }

    next();
}