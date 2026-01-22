import { Request, Response, NextFunction } from 'express';
import { body, validationResult, param } from 'express-validator';

export const validate = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            error: "Validate falied",
            details: errors.array()
        });
    }
    next();
};

export const validateRegister = [
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Invalid email format')
        .normalizeEmail(),

    body('password')
        .trim()
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),

    body('name')
        .trim()
        .notEmpty().withMessage('Name is required')
        .isLength({ min: 4 }).withMessage('Name must be at least 4 characters'),

    validate

];

export const validateLogin = [
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Invalid email format')
        .normalizeEmail(),

    body('password')
        .trim()
        .notEmpty().withMessage('Password is required'),
    
    validate
];

//validate Project

export const validateCreateProject=[
    body('name')
       .trim()
       .notEmpty().withMessage('Project name is required')
       .isLength({min: 3, max:100}).withMessage('Project name must be 3-100 characters'),

    body('key')
       .trim()
       .notEmpty().withMessage('Project key is required')
       .matches(/^[A-Z0-9]{2,10}$/).withMessage('Project key must be 2-10 uppercase letters/numbers (e.g.,  PROJ, BLOG'),

    body('description')
       .optional()
       .trim()
       .isLength({max:500}).withMessage('Description must not exceed 500 characters'),

       validate,
]

export const validateUpdateProject = [
  body('name')
    .optional()
    .trim()
    .notEmpty().withMessage('Project name cannot be empty')
    .isLength({ min: 3, max: 100 }).withMessage('Project name must be 3-100 characters'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Description must not exceed 500 characters'),

 body().custom((value, {req})=>{
    if(!req.body.name && !req.body.description){
        throw new Error('At least one field (name or description) is required');
    }

    return true;
 }),

 validate
]

export const validateAddMember = [
  body('userId')
    .notEmpty().withMessage('User ID is required')
    .isInt({ min: 1 }).withMessage('User ID must be a positive integer'),
  
  body('role')
    .optional()
    .isIn(['admin', 'member']).withMessage('Role must be either "admin" or "member"'),
  
  validate
];

export const validateProjectId = [
  param('id')
    .isInt({ min: 1 }).withMessage('Project ID must be a positive integer'),
  
  validate
];

export const validateUserId = [
  param('userId')
    .isInt({ min: 1 }).withMessage('User ID must be a positive integer'),
  
  validate
];