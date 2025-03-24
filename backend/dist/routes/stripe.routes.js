"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.stripeRouter = void 0;
const express_1 = require("express");
const stripe_1 = __importDefault(require("stripe"));
const db_1 = __importDefault(require("../lib/db"));
const auth_middleware_1 = require("../middleware/auth.middleware");
exports.stripeRouter = (0, express_1.Router)();
const stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY, { apiVersion: '2024-12-18.acacia' });
exports.stripeRouter.post('/create-checkout-session', auth_middleware_1.isAuthenticated, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            res.status(401).json({ msg: 'Not authorized' });
            return;
        }
        const session = yield stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: "usd",
                        product_data: {
                            name: 'pro'
                        },
                        unit_amount: 100 * 20
                    },
                    quantity: 1
                }
            ],
            customer_creation: 'always',
            mode: 'payment',
            success_url: `${process.env.CLIENT_BASE_URL}/editor`,
            cancel_url: `${process.env.CLIENT_BASE_URL}/`,
            client_reference_id: userId.toString(),
        });
        res.status(200).json({ sessionUrl: session.url });
        // res.redirect(session.url!)
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Internal server error' });
    }
}));
exports.stripeRouter.post('/webhook', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('In stripe webhook');
        const body = req.body;
        const signature = req.headers['stripe-signature'];
        let event;
        try {
            // This line throws error without raw body parsing Dont JSON parse in this route
            event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET);
        }
        catch (err) {
            res.status(500).json({ msg: 'Invalid signature' });
            return;
        }
        const session = event.data.object;
        //  console.log('In stripe webhook')
        if (event.type === 'checkout.session.completed') {
            const userId = Number(session.client_reference_id);
            yield db_1.default.user.update({ where: { id: userId }, data: { isPro: true } });
            console.log(`User ${userId} upgraded to Pro successfully`);
        }
        res.status(200).json({ msg: 'Payment successfull' });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Internal server error' });
    }
}));
