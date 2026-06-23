import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Map product slugs to Stripe Price IDs
// Replace each price_XXXXXXXX with your real Price ID from Stripe dashboard
const PRICES = {
  'cnc-aluminium':   'price_XXXXXXXX_CNC',
  '3d-fdm':          'price_XXXXXXXX_FDM',
  '3d-sls':          'price_XXXXXXXX_SLS',
  'gravure-laser':   'price_XXXXXXXX_LASER',
  'plaque':          'price_XXXXXXXX_PLAQUE',
  'portecle':        'price_XXXXXXXX_PORTECLE',
  'gravure-objet':   'price_XXXXXXXX_GRAVURE',
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { items } = req.body;

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Panier vide' });
  }

  // Build line items
  const line_items = [];
  for (const item of items) {
    const priceId = PRICES[item.id];
    if (!priceId || priceId.includes('XXXXXXXX')) {
      return res.status(400).json({ error: `Produit inconnu ou non configuré : ${item.id}` });
    }
    line_items.push({ price: priceId, quantity: item.qty });
  }

  const origin = req.headers.origin || 'https://frenchrevolve.vercel.app';

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    line_items,
    success_url: `${origin}/success.html`,
    cancel_url:  `${origin}/boutique.html`,
    locale: 'fr',
    shipping_address_collection: { allowed_countries: ['FR', 'BE', 'CH', 'LU'] },
    payment_method_types: ['card'],
    customer_email: undefined,
    metadata: { source: 'frenchrevolve_boutique' },
  });

  res.status(200).json({ url: session.url });
}
