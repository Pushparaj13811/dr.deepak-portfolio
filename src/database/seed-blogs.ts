import { sql } from "./db";
import type { BlogTheme } from "../types";

// Sample blog images in base64 format (small placeholder images)
const sampleImages = [
  {
    id: "img_health_1",
    name: "healthy-lifestyle.jpg",
    base64: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZTNmMmZkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzY2NjY2NiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkhlYWx0aHkgTGlmZXN0eWxlPC90ZXh0Pjwvc3ZnPg==",
    alt: "Healthy lifestyle illustration",
    caption: "Living a healthy and balanced lifestyle"
  },
  {
    id: "img_medical_1",
    name: "medical-checkup.jpg",
    base64: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBmZGZmIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzY2NjY2NiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk1lZGljYWwgQ2hlY2t1cDwvdGV4dD48L3N2Zz4=",
    alt: "Medical checkup illustration",
    caption: "Regular health checkups are essential"
  },
  {
    id: "img_nutrition_1",
    name: "nutrition-guide.jpg",
    base64: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBmZGY0Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzY2NjY2NiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk51dHJpdGlvbiBHdWlkZTwvdGV4dD48L3N2Zz4=",
    alt: "Nutrition guide illustration",
    caption: "A comprehensive guide to healthy eating"
  },
  {
    id: "img_exercise_1",
    name: "exercise-routine.jpg",
    base64: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZmVmM2U4Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzY2NjY2NiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkV4ZXJjaXNlIFJvdXRpbmU8L3RleHQ+PC9zdmc+",
    alt: "Exercise routine illustration",
    caption: "Daily exercise for better health"
  },
  {
    id: "img_wellness_1",
    name: "mental-wellness.jpg",
    base64: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZmFmNWZmIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzY2NjY2NiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk1lbnRhbCBXZWxsbmVzczwvdGV4dD48L3N2Zz4=",
    alt: "Mental wellness illustration",
    caption: "Taking care of your mental health"
  }
];

// Default blog theme
const defaultTheme: BlogTheme = {
  mode: "light",
  primaryColor: "#3b82f6",
  fontFamily: "sans-serif",
  fontSize: "medium",
  layout: "standard",
  showCoverImage: true,
  showReadingTime: true,
  showAuthor: true,
  showDate: true,
  enableComments: false,
};

// Sample blog posts
const blogPosts = [
  {
    title: "10 Essential Tips for a Healthier Lifestyle",
    slug: "10-essential-tips-healthier-lifestyle",
    excerpt: "Discover practical and actionable tips to transform your daily routine and achieve better health. From nutrition to exercise, learn how small changes can make a big difference.",
    content: `# 10 Essential Tips for a Healthier Lifestyle

Living a healthy lifestyle doesn't have to be complicated. With the right approach and consistent habits, you can significantly improve your overall well-being. Here are ten essential tips that can help you on your journey to better health.

## 1. Start Your Day with Hydration

{{image:img_health_1}}

Begin each morning with a glass of water. After hours of sleep, your body needs hydration to kickstart your metabolism and flush out toxins. Consider adding a slice of lemon for extra vitamin C and a refreshing taste.

## 2. Incorporate More Whole Foods

Focus on eating whole, unprocessed foods. Fresh fruits, vegetables, lean proteins, and whole grains provide essential nutrients without the added chemicals and preservatives found in processed foods.

### Benefits of Whole Foods:
* Higher nutrient density
* Better satiety
* Improved energy levels
* Reduced inflammation

## 3. Regular Physical Activity

{{image:img_exercise_1}}

Aim for at least 30 minutes of moderate exercise most days of the week. This doesn't mean you need an expensive gym membership – walking, swimming, cycling, or home workouts can be equally effective.

## 4. Prioritize Quality Sleep

Good sleep is foundational to health. Aim for 7-9 hours of quality sleep each night. Create a relaxing bedtime routine and keep your bedroom cool, dark, and quiet.

## 5. Manage Stress Effectively

{{image:img_wellness_1}}

Chronic stress can negatively impact your health. Find healthy ways to manage stress such as:

- Meditation or mindfulness practices
- Regular exercise
- Spending time in nature
- Connecting with loved ones

## 6. Stay Consistent with Medical Checkups

{{image:img_medical_1}}

Regular health screenings and checkups can help detect potential issues early. Don't wait until you feel sick – prevention is always better than treatment.

## 7. Build Strong Social Connections

Maintaining relationships and building new ones contributes significantly to mental and emotional well-being. Make time for friends and family, and don't hesitate to join groups or activities that interest you.

## 8. Practice Mindful Eating

Pay attention to what and how you eat. Eat slowly, savor your food, and listen to your body's hunger and fullness cues. This can help prevent overeating and improve digestion.

## 9. Limit Screen Time

Excessive screen time can affect sleep, posture, and mental health. Set boundaries for device usage, especially before bedtime.

## 10. Set Realistic Goals

Start small and build gradually. Setting unrealistic expectations can lead to frustration and giving up. Celebrate small victories along the way.

## Conclusion

Remember, healthy living is a journey, not a destination. Be patient with yourself and focus on progress, not perfection. Small, consistent changes over time will lead to significant improvements in your health and quality of life.

Start implementing these tips one at a time, and you'll be amazed at the positive changes you'll experience!`,
    image_base64: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImciIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiM2MzY2ZjEiLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiM4YjVjZjYiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2cpIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIzMiIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+SGVhbHRoeSBMaWZlc3R5bGU8L3RleHQ+PC9zdmc+",
    published: true,
    category: "Health Tips",
    tags: ["health", "lifestyle", "wellness", "tips"],
    author: "Dr. Deepak Mehta",
    meta_title: "10 Essential Tips for a Healthier Lifestyle - Expert Health Advice",
    meta_description: "Discover 10 practical tips for a healthier lifestyle. Expert advice on nutrition, exercise, sleep, and wellness from Dr. Deepak Mehta.",
    meta_keywords: "healthy lifestyle, health tips, wellness, nutrition, exercise, mental health",
    inline_images: [sampleImages[0], sampleImages[1], sampleImages[3], sampleImages[4]]
  },
  {
    title: "Understanding Heart Health: Prevention and Care",
    slug: "understanding-heart-health-prevention-care",
    excerpt: "Learn about maintaining cardiovascular health through proper diet, exercise, and lifestyle choices. Expert insights on preventing heart disease and maintaining a healthy heart.",
    content: `# Understanding Heart Health: Prevention and Care

Heart disease remains one of the leading causes of death worldwide, but the good news is that many heart conditions are preventable through proper lifestyle choices and early intervention.

## The Importance of Heart Health

Your heart is a remarkable muscle that beats approximately 100,000 times per day, pumping blood throughout your body. Maintaining its health is crucial for overall well-being and longevity.

{{image:img_medical_1}}

## Risk Factors for Heart Disease

Understanding the risk factors can help you take preventive measures:

### Controllable Risk Factors:
* High blood pressure
* High cholesterol
* Smoking
* Obesity
* Sedentary lifestyle
* Poor diet
* Diabetes
* Excessive alcohol consumption

### Non-controllable Risk Factors:
* Age
* Gender
* Family history
* Ethnicity

## Prevention Strategies

### 1. Maintain a Heart-Healthy Diet

{{image:img_nutrition_1}}

Focus on:
- Fruits and vegetables
- Whole grains
- Lean proteins
- Healthy fats (omega-3 fatty acids)
- Limited sodium and processed foods

### 2. Regular Exercise

{{image:img_exercise_1}}

Aim for at least 150 minutes of moderate-intensity aerobic activity per week. This can include:
- Brisk walking
- Swimming
- Cycling
- Dancing

### 3. Manage Stress

Chronic stress can negatively impact heart health. Practice stress-reduction techniques such as meditation, yoga, or deep breathing exercises.

### 4. Get Adequate Sleep

Poor sleep quality and duration are linked to increased risk of heart disease. Aim for 7-9 hours of quality sleep each night.

### 5. Avoid Smoking and Limit Alcohol

Smoking damages blood vessels and increases heart disease risk. If you smoke, quitting is one of the best things you can do for your heart health.

## Warning Signs to Watch For

Seek immediate medical attention if you experience:
- Chest pain or discomfort
- Shortness of breath
- Nausea or lightheadedness
- Pain in arms, back, neck, or jaw
- Cold sweats

## Regular Health Screenings

Regular checkups can help detect heart problems early:
- Blood pressure monitoring
- Cholesterol testing
- Blood sugar testing
- Body mass index (BMI) assessment

## Conclusion

Taking care of your heart is an investment in your future. By making healthy lifestyle choices today, you can significantly reduce your risk of heart disease and enjoy a longer, healthier life.

Remember to consult with your healthcare provider for personalized advice based on your individual risk factors and health status.`,
    image_base64: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImciIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiNlZjQ0NDQiLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiNmOTY5MDgiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2cpIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIzMiIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+SGVhcnQgSGVhbHRoPC90ZXh0Pjwvc3ZnPg==",
    published: true,
    category: "Medical News",
    tags: ["heart health", "cardiology", "prevention", "medical advice"],
    author: "Dr. Deepak Mehta",
    meta_title: "Heart Health: Prevention and Care Guide - Expert Medical Advice",
    meta_description: "Comprehensive guide to heart health, prevention strategies, and cardiovascular care from Dr. Deepak Mehta. Learn how to protect your heart.",
    meta_keywords: "heart health, cardiovascular health, heart disease prevention, cardiology, medical advice",
    inline_images: [sampleImages[1], sampleImages[2], sampleImages[3]]
  },
  {
    title: "The Complete Guide to Nutrition and Diet",
    slug: "complete-guide-nutrition-diet",
    excerpt: "Master the fundamentals of nutrition with this comprehensive guide. Learn about macronutrients, meal planning, and dietary choices for optimal health.",
    content: `# The Complete Guide to Nutrition and Diet

Proper nutrition is the foundation of good health. Understanding what your body needs and how to provide it can transform your energy levels, mood, and overall well-being.

## Understanding Macronutrients

{{image:img_nutrition_1}}

### Carbohydrates
Carbohydrates are your body's primary energy source. Focus on complex carbohydrates from:
- Whole grains
- Vegetables
- Fruits
- Legumes

### Proteins
Proteins are essential for muscle building and repair. Good sources include:
- Lean meats and poultry
- Fish and seafood
- Eggs
- Dairy products
- Plant-based options (beans, nuts, tofu)

### Fats
Healthy fats are crucial for hormone production and nutrient absorption:
- Avocados
- Nuts and seeds
- Olive oil
- Fatty fish

## Micronutrients: Vitamins and Minerals

While needed in smaller amounts, vitamins and minerals are essential for optimal health:

### Key Vitamins:
* **Vitamin D**: Bone health, immune function
* **Vitamin C**: Immune support, collagen production
* **B Vitamins**: Energy metabolism, nervous system
* **Vitamin A**: Vision, immune function

### Essential Minerals:
* **Iron**: Oxygen transport
* **Calcium**: Bone and teeth health
* **Magnesium**: Muscle and nerve function
* **Zinc**: Immune function, wound healing

## Meal Planning Strategies

{{image:img_health_1}}

### The Plate Method
Divide your plate into:
- 1/2 vegetables and fruits
- 1/4 lean protein
- 1/4 whole grains

### Portion Control
Use these visual cues:
- Palm = protein portion
- Fist = vegetable portion
- Cupped hand = carbohydrate portion
- Thumb = fat portion

## Hydration: The Often Forgotten Nutrient

Water is essential for:
- Temperature regulation
- Joint lubrication
- Nutrient transport
- Waste elimination

**Recommendation**: Aim for 8-10 glasses of water daily, more if you're active or in hot weather.

## Special Dietary Considerations

### For Active Individuals
- Increase protein intake for muscle recovery
- Time carbohydrate intake around workouts
- Ensure adequate hydration

### For Older Adults
- Focus on nutrient-dense foods
- Consider vitamin B12 supplementation
- Maintain adequate protein intake

### For Children
- Provide variety to develop healthy eating habits
- Limit processed foods and added sugars
- Encourage family meals

## Common Nutrition Myths Debunked

### Myth 1: "Carbs are bad"
**Truth**: Complex carbohydrates are essential for energy and brain function.

### Myth 2: "Fat makes you fat"
**Truth**: Healthy fats are essential and can actually help with weight management.

### Myth 3: "You need supplements for good health"
**Truth**: A balanced diet usually provides all necessary nutrients.

## Practical Tips for Better Nutrition

1. **Read food labels** - Look for whole food ingredients
2. **Cook at home more often** - Control ingredients and portions
3. **Plan your meals** - Reduce impulsive food choices
4. **Eat mindfully** - Pay attention to hunger and fullness cues
5. **Stay consistent** - Small changes over time yield big results

{{image:img_wellness_1}}

## When to Seek Professional Help

Consider consulting a registered dietitian if you have:
- Chronic health conditions
- Food allergies or intolerances
- Eating disorders
- Specific fitness goals
- Digestive issues

## Building Sustainable Eating Habits

The key to lasting nutrition success is sustainability:
- Make gradual changes
- Focus on adding healthy foods rather than restricting
- Allow flexibility for social occasions
- Listen to your body's needs

## Conclusion

Good nutrition doesn't have to be complicated. Focus on whole foods, balance, and consistency. Remember that the best diet is one you can maintain long-term while enjoying your food and feeling your best.

Start with small changes today, and build upon them gradually. Your body will thank you for the investment in your health!`,
    image_base64: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImciIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiMxMGI5ODEiLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiMzNGQ1YjkiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2cpIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIzMiIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+TnV0cml0aW9uIEd1aWRlPC90ZXh0Pjwvc3ZnPg==",
    published: true,
    category: "Health Tips",
    tags: ["nutrition", "diet", "meal planning", "healthy eating"],
    author: "Dr. Deepak Mehta",
    meta_title: "Complete Nutrition and Diet Guide - Expert Health Advice",
    meta_description: "Comprehensive nutrition guide covering macronutrients, meal planning, and healthy eating habits. Expert advice from Dr. Deepak Mehta.",
    meta_keywords: "nutrition guide, healthy diet, meal planning, macronutrients, healthy eating",
    inline_images: [sampleImages[2], sampleImages[0], sampleImages[4]]
  },
  {
    title: "Mental Health Awareness: Breaking the Stigma",
    slug: "mental-health-awareness-breaking-stigma",
    excerpt: "Understanding mental health is crucial for overall well-being. Learn about common mental health conditions, treatment options, and how to support mental wellness.",
    content: `# Mental Health Awareness: Breaking the Stigma

Mental health is just as important as physical health, yet it's often overlooked or stigmatized. It's time to break down these barriers and prioritize our mental well-being.

## Understanding Mental Health

Mental health encompasses our emotional, psychological, and social well-being. It affects how we:
- Think and feel
- Handle stress
- Relate to others
- Make choices

{{image:img_wellness_1}}

## Common Mental Health Conditions

### Anxiety Disorders
The most common mental health conditions, affecting millions worldwide:
- Generalized Anxiety Disorder (GAD)
- Panic Disorder
- Social Anxiety Disorder
- Specific Phobias

### Depression
A serious mood disorder that affects how you feel, think, and handle daily activities:
- Major Depressive Disorder
- Persistent Depressive Disorder
- Seasonal Affective Disorder

### Other Conditions
- Bipolar Disorder
- Post-Traumatic Stress Disorder (PTSD)
- Obsessive-Compulsive Disorder (OCD)
- Eating Disorders

## Breaking the Stigma

### Common Myths vs. Reality

**Myth**: Mental health problems are a sign of weakness
**Reality**: Mental health conditions are medical conditions, not character flaws

**Myth**: Therapy is only for "crazy" people
**Reality**: Therapy helps anyone dealing with life's challenges

**Myth**: Medication is the only treatment
**Reality**: There are many effective treatments including therapy, lifestyle changes, and support groups

## Strategies for Mental Wellness

{{image:img_health_1}}

### 1. Practice Self-Care
- Get adequate sleep (7-9 hours)
- Exercise regularly
- Eat a balanced diet
- Engage in activities you enjoy

### 2. Build Strong Relationships
- Maintain connections with family and friends
- Join support groups or communities
- Consider professional counseling

### 3. Manage Stress
- Practice relaxation techniques
- Try meditation or mindfulness
- Set realistic goals and expectations
- Learn to say "no" when necessary

### 4. Develop Coping Skills
- Problem-solving techniques
- Emotional regulation strategies
- Communication skills
- Time management

## When to Seek Professional Help

Consider professional help if you experience:
- Persistent sadness or anxiety
- Difficulty functioning in daily life
- Substance abuse
- Thoughts of self-harm
- Significant changes in sleep or appetite
- Loss of interest in activities you once enjoyed

## Treatment Options

{{image:img_medical_1}}

### Therapy
- Cognitive Behavioral Therapy (CBT)
- Dialectical Behavior Therapy (DBT)
- Psychodynamic Therapy
- Group Therapy

### Medication
- Antidepressants
- Anti-anxiety medications
- Mood stabilizers
- Antipsychotics

### Lifestyle Interventions
- Exercise therapy
- Nutrition counseling
- Sleep hygiene
- Stress management programs

### Alternative Approaches
- Meditation and mindfulness
- Art or music therapy
- Yoga and movement therapy
- Support groups

## Supporting Others

### How to Help Someone Struggling
1. **Listen without judgment**
2. **Offer specific help** (not just "let me know if you need anything")
3. **Encourage professional help** when appropriate
4. **Stay connected** and check in regularly
5. **Educate yourself** about mental health conditions

### What NOT to Say
- "Just think positive"
- "Others have it worse"
- "You don't look depressed"
- "It's all in your head"

## Creating a Supportive Environment

### At Home
- Open communication
- Reduce stress triggers
- Establish routines
- Encourage healthy habits

### At Work
- Mental health policies
- Employee assistance programs
- Flexible work arrangements
- Stress reduction initiatives

### In Community
- Awareness campaigns
- Support groups
- Access to mental health services
- Reducing discrimination

## The Role of Technology

### Helpful Apps and Tools
- Meditation apps (Headspace, Calm)
- Mood tracking apps
- Therapy platforms
- Crisis hotlines

### Social Media Awareness
- Limit exposure to negative content
- Curate positive feeds
- Use privacy settings
- Take regular breaks

## Moving Forward

### Building Resilience
- Develop a growth mindset
- Learn from challenges
- Build a support network
- Practice gratitude

### Advocacy and Awareness
- Share your story (if comfortable)
- Support mental health organizations
- Educate others
- Advocate for policy changes

## Resources for Help

### Crisis Resources
- National Suicide Prevention Lifeline: 988
- Crisis Text Line: Text HOME to 741741
- Emergency: 911

### Professional Help
- Psychology Today therapist directory
- Your primary care physician
- Employee assistance programs
- Community mental health centers

## Conclusion

Mental health is a journey, not a destination. It requires ongoing attention and care, just like physical health. By breaking the stigma, seeking help when needed, and supporting others, we can create a society where mental wellness is prioritized and celebrated.

Remember: seeking help is a sign of strength, not weakness. You are not alone in your struggle, and recovery is possible with the right support and treatment.

Take the first step today – your mental health matters.`,
    image_base64: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImciIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiM4YjVjZjYiLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiNhNzhmZmYiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2cpIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIzMiIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+TWVudGFsIEhlYWx0aDwvdGV4dD48L3N2Zz4=",
    published: true,
    category: "Lifestyle",
    tags: ["mental health", "wellness", "therapy", "anxiety", "depression"],
    author: "Dr. Deepak Mehta",
    meta_title: "Mental Health Awareness: Breaking the Stigma - Expert Guide",
    meta_description: "Comprehensive guide to mental health awareness, breaking stigma, and supporting mental wellness. Expert advice from Dr. Deepak Mehta.",
    meta_keywords: "mental health, mental wellness, anxiety, depression, therapy, mental health stigma",
    inline_images: [sampleImages[4], sampleImages[0], sampleImages[1]]
  },
  {
    title: "Exercise and Fitness: Building a Sustainable Routine",
    slug: "exercise-fitness-sustainable-routine",
    excerpt: "Create a fitness routine that works for your lifestyle and goals. Learn about different types of exercise, proper form, and how to stay motivated for long-term success.",
    content: `# Exercise and Fitness: Building a Sustainable Routine

Regular exercise is one of the most powerful tools for improving your health, mood, and quality of life. The key is finding a routine that you can stick with long-term.

## The Benefits of Regular Exercise

### Physical Benefits
- Strengthens heart and lungs
- Builds and maintains muscle mass
- Improves bone density
- Enhances flexibility and balance
- Boosts immune system
- Helps maintain healthy weight

### Mental Benefits
- Reduces stress and anxiety
- Improves mood and self-esteem
- Enhances cognitive function
- Promotes better sleep
- Increases energy levels

{{image:img_exercise_1}}

## Types of Exercise

### Cardiovascular Exercise
Improves heart health and endurance:
- **Low-impact**: Walking, swimming, cycling
- **High-impact**: Running, jumping, dancing
- **Interval training**: Alternating high and low intensity

### Strength Training
Builds muscle and bone strength:
- **Bodyweight exercises**: Push-ups, squats, planks
- **Free weights**: Dumbbells, barbells
- **Resistance bands**: Portable and versatile
- **Machines**: Guided movements for beginners

### Flexibility and Mobility
Maintains range of motion and prevents injury:
- **Static stretching**: Holding stretches for 15-30 seconds
- **Dynamic stretching**: Movement-based stretching
- **Yoga**: Combines flexibility, strength, and mindfulness
- **Pilates**: Focuses on core strength and alignment

## Creating Your Exercise Plan

### Assess Your Current Fitness Level
Before starting any exercise program:
1. Consult with a healthcare provider
2. Perform basic fitness tests
3. Identify any limitations or injuries
4. Set realistic starting points

### Set SMART Goals
- **Specific**: Clear and well-defined
- **Measurable**: Trackable progress
- **Achievable**: Realistic given your circumstances
- **Relevant**: Meaningful to your life
- **Time-bound**: Has a deadline

{{image:img_health_1}}

### Weekly Exercise Recommendations
**For General Health (Adults 18-64)**:
- 150 minutes moderate-intensity aerobic activity OR
- 75 minutes vigorous-intensity aerobic activity
- Muscle-strengthening activities 2+ days per week

**For Weight Loss**:
- 300+ minutes moderate-intensity aerobic activity
- Strength training 2-3 days per week
- Consider adding high-intensity interval training

## Building Your Routine

### Start Small
- Begin with 10-15 minutes of activity
- Focus on consistency over intensity
- Add 5 minutes each week
- Listen to your body

### Choose Activities You Enjoy
- Try different types of exercise
- Consider your personality (social vs. solo)
- Think about practical factors (time, location, cost)
- Mix it up to prevent boredom

### Schedule Your Workouts
- Treat exercise like important appointments
- Find your optimal time of day
- Plan for obstacles (bad weather, travel)
- Have backup options

## Staying Motivated

### Track Your Progress
- Keep a workout log
- Use fitness apps or wearables
- Take photos and measurements
- Celebrate small victories

### Find Your Why
- Health improvements
- Stress relief
- Better sleep
- Setting a good example
- Personal challenge

### Build Support Systems
- Workout with friends or family
- Join fitness classes or groups
- Hire a personal trainer
- Share goals with others

{{image:img_wellness_1}}

## Common Obstacles and Solutions

### "I Don't Have Time"
**Solutions**:
- Start with 10-minute workouts
- Exercise during lunch breaks
- Walk or bike for transportation
- Do bodyweight exercises at home

### "I'm Too Tired"
**Solutions**:
- Start with light activity
- Exercise in the morning
- Focus on the energy boost after exercise
- Ensure adequate sleep and nutrition

### "It's Too Expensive"
**Solutions**:
- Use free online workout videos
- Exercise outdoors (walking, running)
- Use household items as weights
- Take advantage of free trial periods

### "I Don't Know What to Do"
**Solutions**:
- Start with walking
- Follow beginner workout videos
- Take a fitness class
- Consult with a trainer

## Proper Form and Safety

### General Safety Tips
- Warm up before intense exercise
- Cool down and stretch afterward
- Stay hydrated
- Listen to your body
- Progress gradually

### Signs to Stop Exercising
- Chest pain or pressure
- Severe shortness of breath
- Dizziness or lightheadedness
- Nausea or vomiting
- Joint or muscle pain

## Nutrition and Exercise

### Pre-Workout
- Light snack 30-60 minutes before
- Focus on easily digestible carbs
- Stay hydrated

### Post-Workout
- Eat within 30-60 minutes
- Include protein for muscle recovery
- Replenish fluids lost through sweat

{{image:img_nutrition_1}}

## Adapting Your Routine

### For Busy Periods
- High-intensity interval training
- Bodyweight circuits
- Active commuting
- Desk exercises

### For Injuries
- Focus on unaffected areas
- Low-impact alternatives
- Consult healthcare providers
- Physical therapy exercises

### As You Age
- Emphasize balance and flexibility
- Include resistance training
- Consider joint-friendly activities
- Listen to your body more carefully

## Making It Sustainable

### Keys to Long-term Success
1. **Start slowly** and build gradually
2. **Be consistent** rather than perfect
3. **Enjoy the process** not just the results
4. **Adapt and adjust** as needed
5. **Focus on how you feel** not just how you look

### Building Habits
- Stack exercise with existing habits
- Use positive reinforcement
- Plan for setbacks
- Focus on identity change ("I am an active person")

## Conclusion

Building a sustainable exercise routine is a journey, not a destination. The best workout is the one you'll actually do consistently. Start where you are, use what you have, and do what you can.

Remember that any movement is better than no movement. Whether it's a 10-minute walk or an hour-long gym session, every bit of activity contributes to your health and well-being.

Be patient with yourself, celebrate your progress, and focus on creating healthy habits that will serve you for life. Your future self will thank you for starting today!`,
    image_base64: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImciIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiNmOTY5MDgiLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiNmNzFkMTIiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2cpIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIzMiIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+Rml0bmVzcyAmIEV4ZXJjaXNlPC90ZXh0Pjwvc3ZnPg==",
    published: true,
    category: "Lifestyle",
    tags: ["exercise", "fitness", "workout", "healthy lifestyle", "routine"],
    author: "Dr. Deepak Mehta",
    meta_title: "Exercise and Fitness: Building a Sustainable Routine - Expert Guide",
    meta_description: "Complete guide to building a sustainable exercise routine. Learn about different types of exercise, motivation, and creating lasting fitness habits.",
    meta_keywords: "exercise routine, fitness, workout plan, sustainable fitness, exercise motivation",
    inline_images: [sampleImages[3], sampleImages[0], sampleImages[4], sampleImages[2]]
  }
];

// Helper function to calculate reading time
function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

export async function seedBlogs() {
  try {
    console.log("🌱 Starting blog seeding...");

    // Check if blogs already exist
    const existingBlogs = await sql`SELECT COUNT(*) as count FROM blog_posts`;
    const blogCount = parseInt(existingBlogs[0]?.count || "0");

    if (blogCount > 0) {
      console.log(`📝 Found ${blogCount} existing blog posts. Skipping seed.`);
      return;
    }

    // Insert blog posts
    for (const blogPost of blogPosts) {
      const readingTime = calculateReadingTime(blogPost.content);
      
      await sql`
        INSERT INTO blog_posts (
          title, slug, excerpt, content, image_base64, published,
          theme, meta_title, meta_description, meta_keywords,
          tags, category, author, reading_time, inline_images
        )
        VALUES (
          ${blogPost.title},
          ${blogPost.slug},
          ${blogPost.excerpt},
          ${blogPost.content},
          ${blogPost.image_base64},
          ${blogPost.published},
          ${JSON.stringify(defaultTheme)},
          ${blogPost.meta_title},
          ${blogPost.meta_description},
          ${blogPost.meta_keywords},
          ${blogPost.tags},
          ${blogPost.category},
          ${blogPost.author},
          ${readingTime},
          ${JSON.stringify(blogPost.inline_images)}
        )
      `;
    }

    console.log(`✅ Successfully seeded ${blogPosts.length} blog posts!`);
    
    // Log the created posts
    const createdPosts = await sql`
      SELECT title, slug, published, category, reading_time 
      FROM blog_posts 
      ORDER BY created_at DESC
    `;
    
    console.log("📚 Created blog posts:");
    createdPosts.forEach((post, index) => {
      console.log(`  ${index + 1}. ${post.title} (${post.category}) - ${post.reading_time} min read`);
    });

  } catch (error) {
    console.error("❌ Error seeding blogs:", error);
    throw error;
  }
}