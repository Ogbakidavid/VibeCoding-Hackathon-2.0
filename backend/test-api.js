// // test-api.js - Test script for FreelancersBot API
// const axios = require('axios');

// const API_BASE_URL = 'http://localhost:5000';

// // Test data examples
// const testCases = [
//     {
//         name: "Mobile App Development",
//         request: {
//             project_description: "I need someone to build a mobile app for my restaurant. It should have online ordering, payment integration, and a loyalty program. I want it done in 6 weeks and my budget is around $8,000-12,000.",
//             budget_range: "$8,000-12,000",
//             timeline: "6 weeks",
//             priority_level: "High",
//             client_location: "Los Angeles, CA",
//             communication_preference: "Daily updates"
//         }
//     },
//     {
//         name: "Website Design",
//         request: {
//             project_description: "I need a modern, responsive website for my consulting business. Should include about page, services, contact form, and blog. Clean professional design is important.",
//             budget_range: "$3,000-5,000",
//             timeline: "4 weeks",
//             priority_level: "Medium",
//             client_location: "New York, NY",
//             communication_preference: "Weekly updates"
//         }
//     },
//     {
//         name: "AI Chatbot Development",
//         request: {
//             project_description: "Looking for someone to build an AI-powered customer service chatbot for our e-commerce site. Needs to integrate with our existing systems and handle common customer inquiries.",
//             budget_range: "$10,000-15,000",
//             timeline: "8 weeks",
//             priority_level: "High",
//             client_location: "San Francisco, CA",
//             communication_preference: "Bi-weekly meetings"
//         }
//     },
//     {
//         name: "Brand Design",
//         request: {
//             project_description: "Starting a new tech startup and need complete brand identity - logo, color scheme, typography, business cards, letterhead, and brand guidelines.",
//             budget_range: "$2,000-4,000",
//             timeline: "3 weeks",
//             priority_level: "Medium",
//             client_location: "Austin, TX",
//             communication_preference: "Regular check-ins"
//         }
//     }
// ];

// // Test functions
// async function testHealthCheck() {
//     try {
//         console.log('\n🔍 Testing Health Check...');
//         const response = await axios.get(`${API_BASE_URL}/api/health`);
//         console.log('✅ Health Check:', response.data);
//         return true;
//     } catch (error) {
//         console.error('❌ Health Check Failed:', error.message);
//         return false;
//     }
// }

// async function testGetFreelancers() {
//     try {
//         console.log('\n👥 Testing Get Freelancers...');
//         const response = await axios.get(`${API_BASE_URL}/api/freelancers`);
//         const freelancers = response.data.freelancers || [];
//         console.log('✅ Freelancers Retrieved:', freelancers.length, 'freelancers');
//         if (freelancers.length > 0) {
//             console.log('Sample freelancer:', freelancers[0].name);
//         }
//         return true;
//     } catch (error) {
//         console.error('❌ Get Freelancers Failed:', error.message);
//         return false;
//     }
// }


// async function testFreelancerMatching() {
//     console.log('\n🤖 Testing Freelancer Matching...');

//     for (let i = 0; i < testCases.length; i++) {
//         const testCase = testCases[i];
//         try {
//             console.log(`\n📋 Test Case ${i + 1}: ${testCase.name}`);
//             console.log('Project:', testCase.request.project_description.substring(0, 100) + '...');

//             const response = await axios.post(`${API_BASE_URL}/api/match-freelancer`, testCase.request);

//             if (response.data.success) {
//                 const matchResult = response.data.match_result;
//                 console.log(`✅ Match Score: ${matchResult.match_score}%`);
//                 console.log(`👤 Recommended: ${matchResult.recommended_freelancer?.name || 'None'}`);
//                 console.log(`💬 Summary: ${matchResult.summary_message.substring(0, 150)}...`);
//                 console.log(`🔥 Key Strengths: ${matchResult.key_strengths.length} listed`);

//                 if (matchResult.potential_concerns.length > 0) {
//                     console.log(`⚠️  Concerns: ${matchResult.potential_concerns.length} noted`);
//                 }
//             } else {
//                 console.log('❌ Match Failed:', response.data.error);
//             }

//         } catch (error) {
//             console.error(`❌ Test Case ${i + 1} Failed:`, error.response?.data?.error || error.message);
//         }

//         // Add delay between requests to avoid rate limiting
//         if (i < testCases.length - 1) {
//             await new Promise(resolve => setTimeout(resolve, 1000));
//         }
//     }
// }

// async function testChatEndpoint() {
//     try {
//         console.log('\n💬 Testing Chat Endpoint...');
//         const chatMessage = "Hi! I'm looking for a developer to build a simple e-commerce website for my small business. Budget is around $4000 and I need it in 5 weeks.";

//         const response = await axios.post(`${API_BASE_URL}/api/chat`, {
//             message: chatMessage,
//             context: {
//                 budget_range: "$4,000",
//                 timeline: "5 weeks"
//             }
//         });

//         if (response.data.success) {
//             console.log('✅ Chat Response:', response.data.response.substring(0, 200) + '...');
//             console.log('👤 Recommended:', response.data.match_result.recommended_freelancer?.name || 'None');
//         } else {
//             console.log('❌ Chat Failed:', response.data.error);
//         }

//     } catch (error) {
//         console.error('❌ Chat Test Failed:', error.response?.data?.error || error.message);
//     }
// }

// async function testSpecificFreelancer() {
//     try {
//         console.log('\n👤 Testing Get Specific Freelancer...');
//         const response = await axios.get(`${API_BASE_URL}/api/freelancers/fl_001`);

//         if (response.data.success) {
//             console.log('✅ Freelancer Details:', response.data.freelancer.name);
//             console.log('Skills:', response.data.freelancer.skills.join(', '));
//         } else {
//             console.log('❌ Get Freelancer Failed:', response.data.error);
//         }

//     } catch (error) {
//         console.error('❌ Get Specific Freelancer Failed:', error.response?.data?.error || error.message);
//     }
// }

// async function testErrorHandling() {
//     console.log('\n⚠️  Testing Error Handling...');

//     // Test missing project description
//     try {
//         await axios.post(`${API_BASE_URL}/api/match-freelancer`, {
//             budget_range: "$5000"
//         });
//     } catch (error) {
//         if (error.response?.status === 400) {
//             console.log('✅ Validation Error Handled:', error.response.data.error);
//         } else {
//             console.log('❌ Unexpected error:', error.message);
//         }
//     }

//     // Test invalid freelancer ID
//     try {
//         await axios.get(`${API_BASE_URL}/api/freelancers/invalid_id`);
//     } catch (error) {
//         if (error.response?.status === 404) {
//             console.log('✅ 404 Error Handled:', error.response.data.error);
//         } else {
//             console.log('❌ Unexpected error:', error.message);
//         }
//     }

//     // Test invalid endpoint
//     try {
//         await axios.get(`${API_BASE_URL}/api/invalid-endpoint`);
//     } catch (error) {
//         if (error.response?.status === 404) {
//             console.log('✅ Invalid Endpoint Handled');
//         } else {
//             console.log('❌ Unexpected error:', error.message);
//         }
//     }
// }

// // Main test runner
// async function runAllTests() {
//     console.log('🚀 Starting FreelancersBot API Tests...');
//     console.log('='.repeat(50));

//     const healthOk = await testHealthCheck();
//     if (!healthOk) {
//         console.log('\n❌ Server is not running. Please start the server first.');
//         return;
//     }

//     await testGetFreelancers();
//     await testFreelancerMatching();
//     await testChatEndpoint();
//     await testSpecificFreelancer();
//     await testErrorHandling();

//     console.log('\n' + '='.repeat(50));
//     console.log('🏁 All tests completed!');
//     console.log('\n💡 Tips:');
//     console.log('- Check server logs for detailed Claude API interactions');
//     console.log('- Monitor API rate limits if running many tests');
//     console.log('- Customize test cases for your specific use cases');
// }

// // Run tests if this file is executed directly
// if (require.main === module) {
//     runAllTests().catch(console.error);
// }

// module.exports = {
//     testHealthCheck,
//     testGetFreelancers,
//     testFreelancerMatching,
//     testChatEndpoint,
//     testSpecificFreelancer,
//     testErrorHandling,
//     runAllTests
// };