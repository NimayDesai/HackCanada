# Why NutriMind?

Have you ever wanted to find a recipe, but go overwhelmed by the countless number of recipes on the internet? With NutriMind, this problem will become an ancient relic of the past, allowing you to filter recipes by your preferences and our in-house AI will aggregate all the results into a beautiful dashboard. Even if you close the tab, NutriMind will save all of your favourite recipes in our private and secure accounts

# What we used?

Backend: Mainly utilized TypeScript with NodeJS as our primary language, while creating a RAG (Retrieval Augmented Generation) system that is trained on over 500K recipes from across the globe. All the data used embedings with the latest Gemini model from Google.
Database: We stored all data in PostgreSQL except user sessions which is stored in Redis. This is due to the complexity and open-source nature of PostgreSQL and the efficiency of Redis. We stored the vector embeddings of the RAG in PGVector providing an integrated experience with all other data
Frontend: We utilized NextJS with TypeScript, while utilizing TailwindCSS and ShadCN for styling the app. In addition, we utilized Framer motion for smooth animations between pages, while providing strong user-form support with Zod.
API: We used GraphQL as our API of choice to provide a much more precise and analytical way of viewing data transferring to both stacks

# What Challenges did we face?

We faced 2 challenging problems when designing and building this application.
The first one was learning the countless technologies that we ended up using. Since we had no experience with using LangChain, it was quite difficult setting up the RAG for first time training. In addition, training took quite a long time, especially on my budget laptop, which netted us less time for programming. In addition, only one of our teammates had knowledge of GraphQL, which made setting up the API quite difficult compared to other areas
The second major challenge was making sure that these technologies communicated well with each other. For example, LangChain was primarily built with Python, which created a problem for us using JavaScript. Thus, we had to rely on community maintined packages which caused major stability issues.

# Setting it up

## Frontend

First, install the packages through

```bash
pnpm install
```

Then, run the site

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Backend

First, download PostgreSQL, Redis, and the PGVector Extention from the appropriate sources which relate to your operating system. It is recommended that you use a Unix-based operating system such as Macintosh or Linux, although Windows is still fine.

Then, fill the .env.example with your appropriate information and rename it to .env.

Finally, build the backend and start the server.

To train the RAG, you simply need to run the program. You may replace our csv with an alternative csv.

```bash
pnpm build
pnpm start
```
