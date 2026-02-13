export interface BankQuestion {
  id: string;
  text: string;
  type: string;
  answerChoices?: string[];
  tags: string[];
}

const id = () => crypto.randomUUID();

export const QUESTION_BANK_CATEGORIES = [
  "Recommended Questions",
  "Previously Used Questions",
  "All Categories",
  "Community",
  "Customer Feedback",
  "Customer Satisfaction",
  "Demographics",
  "Education",
  "Events",
  "Healthcare",
  "Human Resources",
  "Industry Specific",
  "Just for Fun",
  "Market Research",
  "Non-Profit",
  "Political",
] as const;

export type QuestionBankCategory = (typeof QUESTION_BANK_CATEGORIES)[number];

function questionsFor(category: string): BankQuestion[] {
  const common: Record<string, BankQuestion[]> = {
    "Recommended Questions": [
      { id: id(), text: "How likely is it that you would recommend this company to a friend or colleague?", type: "Multiple choice", tags: ["Service Feedback", "Product Feedback", "Brand Research", "Insurance"], answerChoices: ["Very likely", "Somewhat likely", "Neutral", "Somewhat unlikely", "Very unlikely"] },
      { id: id(), text: "Do you have any other comments, questions, or concerns?", type: "Single text box", tags: ["Service Feedback", "Health Insurance Evaluation", "Post-event Feedback", "Neighbourhood Feedback"] },
      { id: id(), text: "How satisfied are you with your experience today?", type: "Multiple choice", tags: ["Customer Satisfaction", "Service Feedback"], answerChoices: ["Very satisfied", "Satisfied", "Neutral", "Dissatisfied", "Very dissatisfied"] },
      { id: id(), text: "What is your gender?", type: "Multiple choice", tags: ["Demographics"], answerChoices: ["Male", "Female", "Non-binary", "Prefer not to say"] },
      { id: id(), text: "What is your age range?", type: "Multiple choice", tags: ["Demographics"], answerChoices: ["18-24", "25-34", "35-44", "45-54", "55-64", "65+"] },
      { id: id(), text: "What is your first name?", type: "Single text box", tags: ["RSVP & Contact Information"] },
      { id: id(), text: "What is your email address?", type: "Single text box", tags: ["RSVP & Contact Information"] },
      { id: id(), text: "Which of the following best describes your employment status?", type: "Multiple choice", tags: ["Demographics"], answerChoices: ["Employed full-time", "Employed part-time", "Self-employed", "Student", "Retired", "Unemployed", "Prefer not to say"] },
      { id: id(), text: "How did you hear about us?", type: "Multiple choice", tags: ["Market Research"], answerChoices: ["Search engine", "Social media", "Friend or family", "Advertisement", "Other"] },
      { id: id(), text: "Would you like to receive updates and offers from us?", type: "Multiple choice", tags: ["Marketing"], answerChoices: ["Yes", "No"] },
    ],
    "Customer Feedback": [
      { id: id(), text: "How likely is it that you would recommend this company to a friend or colleague?", type: "Multiple choice", tags: ["NPS", "Service Feedback"], answerChoices: ["Very likely", "Somewhat likely", "Neutral", "Somewhat unlikely", "Very unlikely"] },
      { id: id(), text: "What did you like most about our product or service?", type: "Single text box", tags: ["Product Feedback"] },
      { id: id(), text: "What could we improve?", type: "Single text box", tags: ["Product Feedback", "Service Feedback"] },
      { id: id(), text: "How would you rate the quality of customer support you received?", type: "Multiple choice", tags: ["Service Feedback"], answerChoices: ["Excellent", "Good", "Average", "Poor"] },
      { id: id(), text: "Do you have any other comments, questions, or concerns?", type: "Single text box", tags: ["Service Feedback"] },
    ],
    "Customer Satisfaction": [
      { id: id(), text: "How satisfied are you with your experience today?", type: "Multiple choice", tags: ["CSAT"], answerChoices: ["Very satisfied", "Satisfied", "Neutral", "Dissatisfied", "Very dissatisfied"] },
      { id: id(), text: "How well did we meet your expectations?", type: "Multiple choice", tags: ["Expectations"], answerChoices: ["Exceeded", "Met", "Below expectations"] },
      { id: id(), text: "Would you use our service again?", type: "Multiple choice", tags: ["Loyalty"], answerChoices: ["Yes", "No", "Maybe"] },
    ],
    "Demographics": [
      { id: id(), text: "What is your gender?", type: "Multiple choice", tags: ["Demographics"], answerChoices: ["Male", "Female", "Non-binary", "Prefer not to say"] },
      { id: id(), text: "What is your age range?", type: "Multiple choice", tags: ["Demographics"], answerChoices: ["18-24", "25-34", "35-44", "45-54", "55-64", "65+"] },
      { id: id(), text: "US Region", type: "Multiple choice", tags: ["SurveyMonkey Audience - Demographics"], answerChoices: ["Northeast", "Midwest", "South", "West"] },
      { id: id(), text: "Which of the following options most closely aligns with your gender?", type: "Multiple choice", tags: ["Education Demographics"], answerChoices: ["Male", "Female", "Non-binary", "Prefer not to say"] },
      { id: id(), text: "What is your household income range?", type: "Multiple choice", tags: ["Demographics"], answerChoices: ["Under $25,000", "$25,000 - $49,999", "$50,000 - $74,999", "$75,000 - $99,999", "$100,000+"] },
    ],
    "Education": [
      { id: id(), text: "How often do you help your child engage in activities which are educational outside the home?", type: "Multiple choice", tags: ["Primary/Secondary School Parent Feedback", "Parental Support"], answerChoices: ["Daily", "A few times a week", "Once a week", "Rarely", "Never"] },
      { id: id(), text: "How regularly does your child read for fun?", type: "Multiple choice", tags: ["Primary/Secondary School Parent Feedback"], answerChoices: ["Daily", "A few times a week", "Once a week", "Rarely", "Never"] },
      { id: id(), text: "How satisfied are you with the quality of education provided?", type: "Multiple choice", tags: ["Education Feedback"], answerChoices: ["Very satisfied", "Satisfied", "Neutral", "Dissatisfied"] },
    ],
    "Events": [
      { id: id(), text: "How would you rate the event overall?", type: "Multiple choice", tags: ["Post-event Feedback"], answerChoices: ["Excellent", "Good", "Average", "Poor"] },
      { id: id(), text: "Would you attend a similar event in the future?", type: "Multiple choice", tags: ["Post-event Feedback"], answerChoices: ["Yes", "No", "Maybe"] },
      { id: id(), text: "Do you have any suggestions for future events?", type: "Single text box", tags: ["Post-event Feedback"] },
    ],
    "Healthcare": [
      { id: id(), text: "How would you rate the care you received today?", type: "Multiple choice", tags: ["Patient Feedback"], answerChoices: ["Excellent", "Good", "Fair", "Poor"] },
      { id: id(), text: "Did the staff explain things in a way you could understand?", type: "Multiple choice", tags: ["Health Insurance Evaluation"], answerChoices: ["Yes, always", "Yes, sometimes", "No"] },
      { id: id(), text: "How satisfied are you with your health insurance coverage?", type: "Multiple choice", tags: ["Health Insurance Evaluation"], answerChoices: ["Very satisfied", "Satisfied", "Neutral", "Dissatisfied"] },
    ],
    "Human Resources": [
      { id: id(), text: "How would you rate your experience working with your manager?", type: "Multiple choice", tags: ["Employee Feedback"], answerChoices: ["Excellent", "Good", "Average", "Poor"] },
      { id: id(), text: "Do you feel valued at work?", type: "Multiple choice", tags: ["Employee Engagement"], answerChoices: ["Always", "Often", "Sometimes", "Rarely", "Never"] },
      { id: id(), text: "Would you recommend this company as a place to work?", type: "Multiple choice", tags: ["eNPS"], answerChoices: ["Yes", "No", "Maybe"] },
    ],
    "Market Research": [
      { id: id(), text: "How did you hear about us?", type: "Multiple choice", tags: ["Brand Research"], answerChoices: ["Search engine", "Social media", "Friend or family", "Advertisement", "Other"] },
      { id: id(), text: "Which brand do you prefer and why?", type: "Single text box", tags: ["Brand Research"] },
      { id: id(), text: "How often do you purchase products in this category?", type: "Multiple choice", tags: ["Market Research"], answerChoices: ["Weekly", "Monthly", "Quarterly", "Rarely", "Never"] },
    ],
    "Community": [
      { id: id(), text: "How would you rate your neighbourhood as a place to live?", type: "Multiple choice", tags: ["Neighbourhood Feedback"], answerChoices: ["Excellent", "Good", "Average", "Poor"] },
      { id: id(), text: "What do you think would most improve your community?", type: "Single text box", tags: ["Community Feedback"] },
    ],
    "Previously Used Questions": [
      { id: id(), text: "How likely is it that you would recommend this company to a friend or colleague?", type: "Multiple choice", tags: ["NPS"], answerChoices: ["Very likely", "Somewhat likely", "Neutral", "Somewhat unlikely", "Very unlikely"] },
      { id: id(), text: "What is your first name?", type: "Single text box", tags: ["Contact"] },
      { id: id(), text: "What is your email address?", type: "Single text box", tags: ["Contact"] },
    ],
    "All Categories": [
      { id: id(), text: "How likely is it that you would recommend this company to a friend or colleague?", type: "Multiple choice", tags: ["NPS"], answerChoices: ["Very likely", "Somewhat likely", "Neutral", "Somewhat unlikely", "Very unlikely"] },
      { id: id(), text: "Do you have any other comments, questions, or concerns?", type: "Single text box", tags: ["Feedback"] },
      { id: id(), text: "What is your first name?", type: "Single text box", tags: ["Contact"] },
      { id: id(), text: "What is your age range?", type: "Multiple choice", tags: ["Demographics"], answerChoices: ["18-24", "25-34", "35-44", "45-54", "55+"] },
      { id: id(), text: "How satisfied are you with your experience today?", type: "Multiple choice", tags: ["Satisfaction"], answerChoices: ["Very satisfied", "Satisfied", "Neutral", "Dissatisfied"] },
    ],
    "Industry Specific": [
      { id: id(), text: "How would you rate the quality of our product?", type: "Multiple choice", tags: ["Product"], answerChoices: ["Excellent", "Good", "Average", "Poor"] },
      { id: id(), text: "How often do you use our service?", type: "Multiple choice", tags: ["Usage"], answerChoices: ["Daily", "Weekly", "Monthly", "Rarely"] },
    ],
    "Just for Fun": [
      { id: id(), text: "What is your favorite color?", type: "Multiple choice", tags: ["Fun"], answerChoices: ["Red", "Blue", "Green", "Yellow", "Other"] },
      { id: id(), text: "If you could have dinner with anyone, who would it be?", type: "Single text box", tags: ["Fun"] },
    ],
    "Non-Profit": [
      { id: id(), text: "How likely are you to donate to our cause again?", type: "Multiple choice", tags: ["Donor Feedback"], answerChoices: ["Very likely", "Likely", "Neutral", "Unlikely"] },
      { id: id(), text: "What motivated you to support our organization?", type: "Single text box", tags: ["Donor Feedback"] },
    ],
    "Political": [
      { id: id(), text: "Which issue is most important to you in the upcoming election?", type: "Multiple choice", tags: ["Political Survey"], answerChoices: ["Economy", "Healthcare", "Education", "Environment", "Other"] },
      { id: id(), text: "How likely are you to vote in the next election?", type: "Multiple choice", tags: ["Political Survey"], answerChoices: ["Very likely", "Likely", "Unlikely", "I don't vote"] },
    ],
  };

  if (common[category]?.length) return common[category];
  return common["Recommended Questions"] ?? [];
}

export function getQuestionsForCategory(category: string): BankQuestion[] {
  return questionsFor(category);
}
