import { Book, Brain, Heart, Users } from 'lucide-react';

function About() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Content */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Understanding Dyslexia</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            LexiLearn is dedicated to raising awareness about dyslexia and providing support to individuals, 
            educators, and families affected by dyslexia.
          </p>
        </div>

        {/* Key Information Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <InfoCard
            title="What is Dyslexia?"
            content="Dyslexia is a learning difference that primarily affects reading, writing, and spelling skills. It's characterized by difficulties in word recognition, decoding, and spelling."
            icon={<Book className="h-8 w-8" />}
          />
          <InfoCard
            title="Signs and Symptoms"
            content="Common signs include difficulty reading, problems with phonological processing, poor spelling, and challenges with writing. Early identification is crucial for effective support."
            icon={<Brain className="h-8 w-8" />}
          />
          <InfoCard
            title="Impact on Learning"
            content="Dyslexia can affect self-esteem and academic performance. However, with proper support and teaching methods, individuals with dyslexia can achieve great success."
            icon={<Heart className="h-8 w-8" />}
          />
          <InfoCard
            title="Our Mission"
            content="We aim to provide resources, support, and community for everyone affected by dyslexia. Together, we can create better understanding and opportunities for success."
            icon={<Users className="h-8 w-8" />}
          />
        </div>

        {/* Statistics Section */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Dyslexia Facts</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <StatCard number="15-20%" text="of people have dyslexia" />
            <StatCard number="90%" text="of reading difficulties are related to dyslexia" />
            <StatCard number="1 in 5" text="students has dyslexia" />
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoCard({ title, content, icon }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="text-indigo-600 mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{content}</p>
    </div>
  );
}

function StatCard({ number, text }) {
  return (
    <div className="text-center">
      <div className="text-4xl font-bold text-indigo-600 mb-2">{number}</div>
      <p className="text-gray-600">{text}</p>
    </div>
  );
}

export default About;