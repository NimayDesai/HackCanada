import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { TaskType } from "@google/generative-ai";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { PGVectorStore } from "@langchain/community/vectorstores/pgvector";
import { Pool } from "pg";
import * as fs from "fs";
import * as csv from "csv-parse";

export const generate = async (
  cuisine: string,
  protein: number,
  restrictions: string
): Promise<any> => {
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

    const query = `Give me a recipe for a dish with ${cuisine} ${
      protein ? `and at least ${protein}g of protein` : ""
    } ${restrictions ? `and must be ${restrictions}` : ""}`.trim();

    const relevantDocs = await vectorStore?.similaritySearch(query, 1);

    return {
      recipe: relevantDocs?.[0]?.pageContent,
      metadata: relevantDocs?.[0]?.metadata,
    };
  }

  // If no existing documents, proceed with processing
  const BATCH_SIZE = 500;
  let currentBatch = [];
  let processedCount = 0;
  let totalCount = 0;

  // Get total count of records first
  const countStream = fs
    .createReadStream(
      "/Users/nimaydesai/HackCanada/hackcanada-app/backend/data/recipes.csv"
    )
    .pipe(csv.parse({ columns: true }));

  for await (const _ of countStream) {
    totalCount++;
  }

  console.log(`Total records to process: ${totalCount}`);

  const parser = fs
    .createReadStream(
      "/Users/nimaydesai/HackCanada/hackcanada-app/backend/data/recipes.csv"
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

    // Print all recipes with detailed nutritional information

    await pool.end();
  } catch (error) {
    console.error("Error searching recipes:", error);
    await pool.end();
    return null;
  }
};
