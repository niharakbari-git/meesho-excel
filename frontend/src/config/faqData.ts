export const faqData = [
  {
    category: "Critical Upload Cautions",
    items: [
      {
        question: "Why is my catalog being flagged as a Duplicate?",
        answer: "Meesho strictly flags catalogs as duplicates if you use the exact same Primary Image URL across different catalogs or listings. Even if the text changes, identical images trigger their duplicate detection. Always use distinct images or visually alter them (e.g., adding text/badges) if uploading independent listings."
      },
      {
        question: "How do I avoid 'SKU already exists' errors?",
        answer: "SKUs must be 100% unique across your entire seller account history, not just the current Excel sheet. Use our Auto-Increment feature with a unique prefix (e.g., 'TSHIRT-AUG-001') to ensure you never repeat an SKU."
      },
      {
        question: "How do I make products appear as separate listings instead of variations?",
        answer: "To force independent listings on Meesho, ensure that both the 'Product ID' (or 'Style ID') AND the 'Group ID' are unique for every single row. You can use our 'Auto Increment' generation mode for these fields. If they share a Group ID, Meesho will group them as size/color variations under a single product."
      }
    ]
  },
  {
    category: "Restricted Keywords & Content",
    items: [
      {
        question: "What words are strictly prohibited in titles and descriptions?",
        answer: "Never use the following: 'Copy', 'First Copy', 'Replica', 'Fake', 'Duplicate'. Do not mention competitor names ('Amazon', 'Flipkart', 'Myntra') or 'Meesho'. Do not include phone numbers, email addresses, or website links. Do not use major brand names (e.g., 'Nike', 'Zara') unless you have explicit brand authorization."
      },
      {
        question: "Can I use random prices?",
        answer: "Yes, but Meesho has safety nets. Your 'Meesho Price' must be higher than the 'Returns Price' (wrong/defective). If you set Returns Price higher, the upload will fail. Our generator automatically caps the Returns Price to stay valid."
      }
    ]
  },
  {
    category: "General Recommendations",
    items: [
      {
        question: "What is Variation Mode?",
        answer: "Variation Mode takes your first row and duplicates its core details (like Title, Description, and Images) across all rows, while keeping SKUs unique. This is perfect when you are uploading the same t-shirt in 5 different sizes."
      },
      {
        question: "What is Independent Listing Mode?",
        answer: "Independent Listing Mode treats every single row as a completely distinct product. It prepends unique adjectives from your Adjective Pool to the product names to ensure Meesho doesn't flag them as identical text."
      }
    ]
  },
  {
    category: "Strategic Pricing Tips",
    items: [
      {
        question: "Does the Meesho Price include shipping?",
        answer: "No, the Meesho Price you set is excluding shipping charges. Keep in mind that customers will have to pay ₹40 to ₹50 more on top of your Meesho price as the shipping charge at checkout."
      },
      {
        question: "How should I price the Wrong/Defective Returns Price?",
        answer: "Keep the defective price about ₹15 less than the Meesho Price (with a variation of ₹3 to ₹5). This helps to increase the price gap between 'Return in all conditions' and 'Wrong/Defective product only'. A wider gap attracts customers to select the Wrong/Defective product return option only, which is highly beneficial for your margins."
      }
    ]
  }
];
