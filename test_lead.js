import axios from 'axios';
import 'dotenv/config';

const PIXXI_API_URL = process.env.PIXXI_CRM_API_URL || 'https://dataapi.pixxicrm.ae';
const PIXXI_API_KEY = process.env.PIXXI_CRM_API_KEY;

async function testLead(payload, description) {
    console.log(`--- Testing: ${description} ---`);
    const fullPayload = {
        name: `Cath Test: ${description}`,
        email: 'cat@test.com',
        phone: '971500000000',
        subject: `Categorization Test: ${description}`,
        message: 'Testing if this field triggers Buy/Rent classification.',
        source: 'Website Debug',
        formId: '6507a47f-9443-494c-a288-64381315f14b',
        formName: 'Ophir Properties Website Lead Form',
        ...payload
    };

    try {
        const response = await axios.post(`${PIXXI_API_URL}/pixxiapi/webhook/v1/form`, fullPayload, {
            headers: { 'X-PIXXI-TOKEN': PIXXI_API_KEY }
        });
        console.log('RESULT:', response.data);
    } catch (error) {
        console.log('ERROR:', error.response ? error.response.data : error.message);
    }
}

async function runTests() {
    const contactForm7Id = '9f5d1c83-c53f-4066-bb38-8d0faf1526e9';
    const formName = 'OphirP-LP-Contact Form 7';

    await testLead({ interest: 'Selling', formId: contactForm7Id, formName: formName }, 'Form7 + interest=Selling');
    await testLead({ interest: 'New Projects', formId: contactForm7Id, formName: formName }, 'Form7 + interest=New Projects');
    await testLead({ interest: 'General Inquiry', formId: contactForm7Id, formName: formName }, 'Form7 + interest=General Inquiry');
}

runTests();
