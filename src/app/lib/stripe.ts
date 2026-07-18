import Stripe from "stripe";
import dotEnv from "../config/dotEnv";

const stripe: Stripe = new Stripe(dotEnv.stripe_secret_key!);

export default stripe;