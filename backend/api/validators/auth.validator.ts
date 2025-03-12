import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

const registerSchema = Joi.object({
  salutation: Joi.string().required(),
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  nickname: Joi.string().optional(),
  dateOfBirth: Joi.date().required(),
  gender: Joi.string().valid('male', 'female', 'non-binary', 'prefer-not-to-say').required(),
  photoUrl: Joi.string().optional(),
  contactInfo: Joi.object({
    email: Joi.string().email().required(),
    whatsAppId: Joi.string().optional()
  }).required(),
  technicalSkillsOwned: Joi.array().items(
    Joi.object({
      name: Joi.string().required(),
      proficiencyLevel: Joi.string().valid('beginner', 'intermediate', 'advanced', 'expert').required(),
      yearsOfExperience: Joi.number().optional()
    })
  ).optional(),
  technicalSkillsDesired: Joi.array().items(
    Joi.object({
      name: Joi.string().required(),
      proficiencyLevel: Joi.string().valid('beginner', 'intermediate', 'advanced', 'expert').required()
    })
  ).optional()
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

export function validateRegister(req: Request, res: Response, next: NextFunction): void {
  const { error } = registerSchema.validate(req.body);
  
  if (error) {
    res.status(400).json({ success: false, message: error.details[0].message });
    return;
  }
  
  next();
}

export function validateLogin(req: Request, res: Response, next: NextFunction): void {
  const { error } = loginSchema.validate(req.body);
  
  if (error) {
    res.status(400).json({ success: false, message: error.details[0].message });
    return;
  }
  
  next();
}
