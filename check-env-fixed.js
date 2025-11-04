// Simple script to check environment variables
require("dotenv").config();

console.log("Environment Variables Check:");
console.log("NEXT_PUBLIC_BASE_URL:", process.env.NEXT_PUBLIC_BASE_URL);
console.log(
  "NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES:",
  process.env.NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES
);
console.log("DATABASE_URL:", process.env.DATABASE_URL ? "Set" : "Missing");
console.log(
  "BETTER_AUTH_SECRET:",
  process.env.BETTER_AUTH_SECRET ? "Set" : "Missing"
);
console.log("BETTER_AUTH_URL:", process.env.BETTER_AUTH_URL);
console.log(
  "GITHUB_CLIENT_ID:",
  process.env.GITHUB_CLIENT_ID ? "Set" : "Missing"
);
console.log(
  "GITHUB_CLIENT_SECRET:",
  process.env.GITHUB_CLIENT_SECRET ? "Set" : "Missing"
);
console.log("RESEND_API_KEY:", process.env.RESEND_API_KEY ? "Set" : "Missing");
console.log("ARCJET_API_KEY:", process.env.ARCJET_API_KEY ? "Set" : "Missing");
console.log(
  "AWS_ACCESS_KEY_ID:",
  process.env.AWS_ACCESS_KEY_ID ? "Set" : "Missing"
);
console.log(
  "AWS_SECRET_ACCESS_KEY:",
  process.env.AWS_SECRET_ACCESS_KEY ? "Set" : "Missing"
);
console.log("AWS_REGION:", process.env.AWS_REGION);
console.log("AWS_ENDPOINT_URL_S3:", process.env.AWS_ENDPOINT_URL_S3);
console.log("AWS_ENDPOINT_URL_IAM:", process.env.AWS_ENDPOINT_URL_IAM);
