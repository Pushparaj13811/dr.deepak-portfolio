#!/usr/bin/env bun
import { initDatabase, isDatabaseSeeded, dropAllTables } from "./db";
import { seedDatabase } from "./seed";

async function promptInput(question: string): Promise<string> {
  const readline = await import("readline");
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer);
    });
  });
}

async function setup() {
  try {
    console.log("🚀 Starting database setup...\n");

    // Check if database is already seeded
    const isSeeded = await isDatabaseSeeded();

    if (isSeeded) {
      console.log("⚠️  Database is already set up and seeded.\n");
      const reseedAnswer = await promptInput("Do you want to DROP ALL TABLES and RESEED? (yes/no): ");

      if (reseedAnswer.toLowerCase() === 'yes' || reseedAnswer.toLowerCase() === 'y') {
        console.log("\n⚠️  WARNING: This will delete ALL existing data!");
        const confirmAnswer = await promptInput("Are you absolutely sure? Type 'DELETE' to confirm: ");

        if (confirmAnswer === 'DELETE') {
          // Drop all tables
          await dropAllTables();

          // Recreate tables
          console.log("\n📋 Creating database tables...");
          await initDatabase();

          // Reseed database
          console.log("\n🌱 Seeding database...");
          await seedDatabase();

          console.log("\n🎉 Database reset and reseeded successfully!\n");
        } else {
          console.log("\n❌ Reseed cancelled. Database remains unchanged.\n");
        }
      } else {
        console.log("\n✅ Setup skipped. Database remains unchanged.\n");
      }
    } else {
      // Database not seeded, initialize and seed
      console.log("📋 Creating database tables...");
      await initDatabase();

      console.log("\n🌱 Seeding database...");
      await seedDatabase();

      console.log("\n🎉 Setup completed successfully!\n");
    }

    process.exit(0);
  } catch (error) {
    console.error("\n❌ Setup failed:", error);
    process.exit(1);
  }
}

setup();
