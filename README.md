# CodeCraft

Online IDE with multi-language support

https://github.com/user-attachments/assets/5d0683af-c000-4130-8e03-97702e0aa9fb

## How to run locally ?

**1.Clone the repo**

```bash 
git clone https://github.com/Virajb19/CodeCraft
cd CodeCraft
```

**2. Run Frontend**

```bash
cd frontend && npm install && npm run dev
```

**3. Run Backend**

```bash
npm install && npm run dev 
```
Create .env and add env vars (Refer .env.example in backend folder)

**4. Start Database**

Pull postgres image

```bash
docker pull postgres
```
Run docker container

```bash
docker run --name postgres-ctr -e POSTGRES_PASSWORD=password -p 5432:5432 -d postgres

```
Run this command

```bash
pnpm dlx prisma migrate deploy
```

Run this command to open prisma studio

```bash
pnpm dlx prisma studio
```
Open [http://localhost:5555]

**5. Authentication**

Go to [https://github.com/settings/apps] and create an OAuth app

GITHUB_CLIENT_ID=""  
GITHUB_CLIENT_SECRET=""  

(Optional. You can just login using Github)

Go to [https://console.cloud.google.com/] and create an OAuth app

GOOGLE_CLIENT_ID="" GOOGLE_CLIENT_SECRET=""

**6. Start REDIS**

pull redis image

```bash
docker pull redis
```
Run redis container

```bash
docker run --name redis-local -p 6379:6379 -d redis
```
**7. Stripe**

Go to [https://dashboard.stripe.com/apikeys]

STRIPE_SECRET_KEY="your_stripe_secret_key"

Install stripe CLI in your system

Run this command

```bash
stripe listen --forward-to localhost:3000/api/webhook/stripe
```

A secret will be generated. Add that secret to 

STRIPE_WEBHOOK_SECRET=""

