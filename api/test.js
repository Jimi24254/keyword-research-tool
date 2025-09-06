// api/test.js
// This is a simple serverless function to test if Vercel routing is working correctly.
// It has no external dependencies.

export default function handler(req, res) {
    console.log("Test endpoint was called successfully!");
    res.status(200).json({ message: "Hello from the test API!" });
}
