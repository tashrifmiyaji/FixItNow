import Stripe from "stripe";
import dotEnv from "../config/dotEnv";

const stripe = new Stripe(dotEnv.stripe_secret_key!);

export default stripe;