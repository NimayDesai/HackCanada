import { GoogleGenerativeAI } from "@google/generative-ai";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { TaskType } from "@google/generative-ai";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { PGVectorStore } from "@langchain/community/vectorstores/pgvector";
import { Pool } from "pg";
import * as fs from "fs";
import * as csv from "csv-parse";

interface Recipe {
  title: string;
  ingredients: string;
  instructions: string;
  totalCost: number;
  costPerServing: number;
  servings: number;
  nutritionalInfo: {
    calories: number;
    protein: number;
    carbohydrates: number;
    fat: number;
    sugar: number;
    fiber: number;
    vitamins: {
      vitaminA: number;
      vitaminC: number;
      vitaminD: number;
      vitaminE: number;
      vitaminK: number;
      thiamin: number;
      riboflavin: number;
      niacin: number;
      b6: number;
      b12: number;
      folate: number;
    };
    minerals: {
      calcium: number;
      iron: number;
      magnesium: number;
      phosphorus: number;
      potassium: number;
      sodium: number;
      zinc: number;
    };
  };
}

export const generate = async () => {
  // Initialize PostgreSQL connection
  const pool = new Pool({
    host: process.env.POSTGRES_HOST || "localhost",
    port: parseInt(process.env.POSTGRES_PORT || "5432"),
    user: process.env.POSTGRES_USER || "nimaydesai",
    password: process.env.POSTGRES_PASSWORD || "ninu125012",
    database: process.env.POSTGRES_DB || "hackcanada",
  });

  // Instantiate Gemini vector embeddings
  const embeddings = new GoogleGenerativeAIEmbeddings({
    model: "text-embedding-004",
    taskType: TaskType.RETRIEVAL_DOCUMENT,
    title: "Document title",
    apiKey: process.env.GEMINI_API,
  });

  // Initialize PGVector store
  const vectorStore = await PGVectorStore.initialize(embeddings, {
    tableName: "recipes_embeddings",
    pool,
    schemaName: "public",
    dimensions: 768,
  });

  // Check if documents are already processed
  const existingCount = await pool.query(
    "SELECT COUNT(*) FROM recipes_embeddings"
  );

  if (existingCount.rows[0].count > 0) {
    console.log(
      `Found ${existingCount.rows[0].count} existing documents. Skipping processing.`
    );

    // You can still run your query here
    const query =
      "Give me a recipe for a vegetarian dish with at least 20g of protein per serving";
    const relevantDocs = await vectorStore?.similaritySearch(query, 1);
    console.log("Relevant documents:", relevantDocs);

    await pool.end();
    return;
  }

  // If no existing documents, proceed with processing
  const BATCH_SIZE = 500;
  let currentBatch = [];
  let processedCount = 0;
  let totalCount = 0;

  // Get total count of records first
  const countStream = fs
    .createReadStream(
      "/Users/nimaydesai/HackCanada/hackcanada-app/backend/data/recipes2.csv"
    )
    .pipe(csv.parse({ columns: true }));

  for await (const _ of countStream) {
    totalCount++;
  }

  console.log(`Total records to process: ${totalCount}`);

  const parser = fs
    .createReadStream(
      "/Users/nimaydesai/HackCanada/hackcanada-app/backend/data/recipes2.csv"
    )
    .pipe(csv.parse({ columns: true }));

  // Improved text splitter configuration for recipes
  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 2000, // Increased for better context
    chunkOverlap: 300,
  });

  // Process records in batches with progress tracking
  for await (const record of parser) {
    try {
      const content = Object.values(record).join(" ");
      currentBatch.push({
        pageContent: content,
        metadata: {
          ...record,
          // Ensure all numerical fields are properly parsed
          calories: parseFloat(record.calories) || 0,
          protein: parseFloat(record.protein) || 0,
          carbohydrates: parseFloat(record.carbohydrates) || 0,
          fat: parseFloat(record.fat) || 0,
          sugar: parseFloat(record.sugar) || 0,
          fiber: parseFloat(record.fiber) || 0,
          // Add other nutritional fields with proper parsing
          vitamin_a: parseFloat(record.vitamin_a) || 0,
          vitamin_c: parseFloat(record.vitamin_c) || 0,
          vitamin_d: parseFloat(record.vitamin_d) || 0,
          vitamin_e: parseFloat(record.vitamin_e) || 0,
          vitamin_k: parseFloat(record.vitamin_k) || 0,
          thiamin: parseFloat(record.thiamin) || 0,
          riboflavin: parseFloat(record.riboflavin) || 0,
          niacin: parseFloat(record.niacin) || 0,
          vitamin_b6: parseFloat(record.vitamin_b6) || 0,
          vitamin_b12: parseFloat(record.vitamin_b12) || 0,
          folate: parseFloat(record.folate) || 0,
          calcium: parseFloat(record.calcium) || 0,
          iron: parseFloat(record.iron) || 0,
          magnesium: parseFloat(record.magnesium) || 0,
          phosphorus: parseFloat(record.phosphorus) || 0,
          potassium: parseFloat(record.potassium) || 0,
          sodium: parseFloat(record.sodium) || 0,
          zinc: parseFloat(record.zinc) || 0,
        },
      });

      if (currentBatch.length >= BATCH_SIZE) {
        const splitDocs = await textSplitter.splitDocuments(currentBatch);
        await vectorStore.addDocuments(splitDocs);

        processedCount += currentBatch.length;
        const progress = ((processedCount / totalCount) * 100).toFixed(2);
        console.log(`Processed ${processedCount}/${totalCount} (${progress}%)`);

        currentBatch = [];
        // Add delay to prevent rate limiting
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    } catch (error) {
      console.error(`Error processing record: ${error}`);
      continue; // Skip problematic records
    }
  }

  // Process remaining documents
  if (currentBatch.length > 0) {
    try {
      const splitDocs = await textSplitter.splitDocuments(currentBatch);
      await vectorStore.addDocuments(splitDocs);
      processedCount += currentBatch.length;
      console.log(
        `Final batch processed. Total: ${processedCount}/${totalCount}`
      );
    } catch (error) {
      console.error(`Error processing final batch: ${error}`);
    }
  }

  console.log("Database population complete!");
  await pool.end();
};

export const searchRecipes = async (query: string) => {
  const pool = new Pool({
    host: process.env.POSTGRES_HOST || "localhost",
    port: parseInt(process.env.POSTGRES_PORT || "5432"),
    user: process.env.POSTGRES_USER || "nimaydesai",
    password: process.env.POSTGRES_PASSWORD || "ninu125012",
    database: process.env.POSTGRES_DB || "hackcanada",
  });

  const embeddings = new GoogleGenerativeAIEmbeddings({
    model: "text-embedding-004",
    taskType: TaskType.RETRIEVAL_DOCUMENT,
    title: "Document title",
    apiKey: process.env.GEMINI_API,
  });

  const vectorStore = await PGVectorStore.initialize(embeddings, {
    tableName: "recipes_embeddings",
    pool,
    schemaName: "public",
    dimensions: 768,
  });

  try {
    const relevantDocs = await vectorStore.similaritySearch(query, 5);

    if (!relevantDocs.length) {
      console.log("\nNo recipes found.");
      await pool.end();
      return null;
    }

    const gemini = new GoogleGenerativeAI(process.env.GEMINI_API || "");
    const model = gemini.getGenerativeModel({ model: "gemini-pro" });

    const recipes: Recipe[] = await Promise.all(
      relevantDocs.map(async (doc) => {
        const costResponse = await model.generateContent(
          `Estimate cost per serving in USD for: ${doc.metadata.ingredients}`
        );
        const costPerServing = parseFloat(costResponse.response.text()) || 0;
        const totalCost =
          costPerServing * (parseInt(doc.metadata.servings) || 4);

        return {
          title:
            doc.metadata.title || doc.metadata.recipe_name || "Untitled Recipe",
          ingredients: doc.metadata.ingredients || "",
          instructions: doc.metadata.instructions || doc.pageContent,
          servings: parseInt(doc.metadata.servings) || 4,
          costPerServing,
          totalCost,
          nutritionalInfo: {
            calories: parseFloat(doc.metadata.calories) || 0,
            protein: parseFloat(doc.metadata.protein) || 0,
            carbohydrates: parseFloat(doc.metadata.carbohydrates) || 0,
            fat: parseFloat(doc.metadata.fat) || 0,
            sugar: parseFloat(doc.metadata.sugar) || 0,
            fiber: parseFloat(doc.metadata.fiber) || 0,
            vitamins: {
              vitaminA: parseFloat(doc.metadata.vitamin_a) || 0,
              vitaminC: parseFloat(doc.metadata.vitamin_c) || 0,
              vitaminD: parseFloat(doc.metadata.vitamin_d) || 0,
              vitaminE: parseFloat(doc.metadata.vitamin_e) || 0,
              vitaminK: parseFloat(doc.metadata.vitamin_k) || 0,
              thiamin: parseFloat(doc.metadata.thiamin) || 0,
              riboflavin: parseFloat(doc.metadata.riboflavin) || 0,
              niacin: parseFloat(doc.metadata.niacin) || 0,
              b6: parseFloat(doc.metadata.vitamin_b6) || 0,
              b12: parseFloat(doc.metadata.vitamin_b12) || 0,
              folate: parseFloat(doc.metadata.folate) || 0,
            },
            minerals: {
              calcium: parseFloat(doc.metadata.calcium) || 0,
              iron: parseFloat(doc.metadata.iron) || 0,
              magnesium: parseFloat(doc.metadata.magnesium) || 0,
              phosphorus: parseFloat(doc.metadata.phosphorus) || 0,
              potassium: parseFloat(doc.metadata.potassium) || 0,
              sodium: parseFloat(doc.metadata.sodium) || 0,
              zinc: parseFloat(doc.metadata.zinc) || 0,
            },
          },
        };
      })
    );

    // Print all recipes with detailed nutritional information
    recipes.forEach((recipe, index) => {
      console.log(`\nRecipe ${index + 1}:`);
      console.log(`\n${recipe.title}`);
      console.log(`\nTotal Cost: $${recipe.totalCost.toFixed(2)}`);
      console.log(`Cost per serving: $${recipe.costPerServing.toFixed(2)}`);
      console.log(`Makes ${recipe.servings} servings\n`);

      console.log("Ingredients:");
      recipe.ingredients
        .split(",")
        .map((i) => i.trim())
        .filter((i) => i)
        .forEach((i) => console.log(`• ${i}`));

      console.log("\nNutritional Information (per serving):");
      console.log(`Calories: ${recipe.nutritionalInfo.calories}kcal`);
      console.log(`Protein: ${recipe.nutritionalInfo.protein}g`);
      console.log(`Carbohydrates: ${recipe.nutritionalInfo.carbohydrates}g`);
      console.log(`Fat: ${recipe.nutritionalInfo.fat}g`);
      console.log(`Sugar: ${recipe.nutritionalInfo.sugar}g`);
      console.log(`Fiber: ${recipe.nutritionalInfo.fiber}g`);

      console.log("\nVitamins:");
      Object.entries(recipe.nutritionalInfo.vitamins).forEach(
        ([vitamin, amount]) => {
          console.log(`${vitamin}: ${amount}mg`);
        }
      );

      console.log("\nMinerals:");
      Object.entries(recipe.nutritionalInfo.minerals).forEach(
        ([mineral, amount]) => {
          console.log(`${mineral}: ${amount}mg`);
        }
      );

      console.log("\nInstructions:");
      recipe.instructions
        .split(/\.|;/)
        .map((i) => i.trim())
        .filter((i) => i)
        .map((step, index) => console.log(`${index + 1}. ${step}`));

      console.log("\n" + "-".repeat(80));
    });

    await pool.end();
    return recipes;
  } catch (error) {
    console.error("Error searching recipes:", error);
    await pool.end();
    return null;
  }
};
