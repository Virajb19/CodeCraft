"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCommentSchema = exports.createRoomSchema = exports.createSnippetSchema = exports.createCodeExecutionSchema = exports.SignInSchema = exports.SignUpSchema = void 0;
const zod_1 = require("zod");
exports.SignUpSchema = zod_1.z.object({
    username: zod_1.z.string().min(3, { message: 'username must be atleast 3 letters long' }).max(10, { message: 'username cannot be more than 10 letters' }).trim(),
    email: zod_1.z.string().email({ message: 'Please enter a valid email' }).trim(),
    password: zod_1.z.string().min(8, { message: 'Password must be atleast 8 letters long' }).max(15)
        .regex(/^(?=.*[0-9])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/, { message: 'Password must contain atleast one special char and one number' }).trim()
});
exports.SignInSchema = zod_1.z.object({
    email: zod_1.z.string().email({ message: 'Please enter a valid email' }).trim(),
    password: zod_1.z.string().min(8, { message: 'Password must be atleast 8 letters long' }).max(15, { message: 'Password cannot exceed 15 characters' })
        .regex(/^(?=.*[0-9])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/, { message: 'Password must contain atleast one special char and one number' }).trim()
});
exports.createCodeExecutionSchema = zod_1.z.object({
    language: zod_1.z.string(),
    code: zod_1.z.string(),
    output: zod_1.z.string(),
    error: zod_1.z.string().nullable()
});
exports.createSnippetSchema = zod_1.z.object({
    title: zod_1.z.string().min(1),
    language: zod_1.z.string(),
    code: zod_1.z.string()
});
exports.createRoomSchema = zod_1.z.object({
    title: zod_1.z.string().min(1)
});
exports.createCommentSchema = zod_1.z.object({
    content: zod_1.z.string().min(1).max(500)
});
