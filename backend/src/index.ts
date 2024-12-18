import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import { ExpressAuth } from "@auth/express"
import GitHub from "@auth/express/providers/github"

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.set("trust proxy", true)
app.use("/auth/*", ExpressAuth({ 
  providers: [
     GitHub,
     
  ]
}))
app.use(express.json())

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
  });

  