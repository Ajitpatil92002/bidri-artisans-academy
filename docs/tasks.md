# Tasks

Tasks live inside each feature's folder (D-008). See **[features/README.md](features/README.md)** for the build order and the status of every feature, and open a feature's `tasks.md` for its task list and progress log.

Task IDs: `F<nn>-T<nn>`. Status marks: `[ ]` to do · `[~]` in progress · `[x]` done · `[-]` dropped (say why).

## Waiting on the owner

### To test real payments
- Razorpay test keys in `.env.local`, added by the owner, with `RAZORPAY_MOCK=false`
- Q-5 GST details
- Q-12 confirm the shipping fee and free-shipping threshold

### Content review
- Q-8 official brand name
- Q-10 and the home page copy
- The two journal articles and the five help and policy pages
- Q-13 returns and refund policy
- Q-14 business details
- Q-17 real artisan stories and photos
- Real product stock, sizes and more photos, including square shots of Fan and Star earrings

### For launch
- Add the Neon URL and generated secrets (`.env.neon`) to Vercel
- A Cloudflare R2 bucket and keys (D-028)
- A Resend account and verified sending domain
- Vercel project and the bidriart.com domain
- Razorpay website approval and live keys
