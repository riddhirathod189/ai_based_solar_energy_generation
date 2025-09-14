import React from 'react';
import { Brain, Target, Users, Award, Lightbulb, Globe } from 'lucide-react';

const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 pt-20">
      {/* Hero Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-gray-800 mb-6">About SolarPredict AI</h1>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              We're revolutionizing renewable energy forecasting through cutting-edge artificial intelligence, 
              empowering individuals and organizations to harness solar power with unprecedented precision.
            </p>
          </div>
          
          <div className="relative rounded-3xl overflow-hidden shadow-2xl">
            <img 
              src="https://images.pexels.com/photos/9875418/pexels-photo-9875418.jpeg?auto=compress&cs=tinysrgb&w=1920&h=800&fit=crop"
              alt="Modern solar installation with advanced technology"
              className="w-full h-96 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-green-900/60 flex items-center justify-center">
              <div className="text-white text-center">
                <h2 className="text-4xl font-bold mb-4">Pioneering Solar Intelligence</h2>
                <p className="text-lg opacity-90 max-w-2xl leading-relaxed">
                  Combining environmental science, machine learning, and renewable energy expertise 
                  to create the world's most accurate solar prediction platform.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-800 mb-6">Our Mission</h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                To democratize solar energy optimization through intelligent prediction technology. 
                We believe everyone should have access to precise, actionable insights that maximize 
                renewable energy potential and accelerate the global transition to clean power.
              </p>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Our AI-powered platform eliminates guesswork from solar installations, helping 
                homeowners, businesses, and energy professionals make data-driven decisions that 
                optimize both environmental impact and economic returns.
              </p>
              
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-lg">
                  <Target className="w-8 h-8 text-blue-500 mb-3" />
                  <h3 className="font-bold text-gray-800 mb-2">Precision Focus</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">95%+ accuracy in solar output predictions</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-lg">
                  <Globe className="w-8 h-8 text-green-500 mb-3" />
                  <h3 className="font-bold text-gray-800 mb-2">Global Impact</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">Supporting renewable energy worldwide</p>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <img 
                src="https://images.pexels.com/photos/9875417/pexels-photo-9875417.jpeg?auto=compress&cs=tinysrgb&w=800&h=1000&fit=crop"
                alt="Solar panels against blue sky"
                className="rounded-2xl shadow-2xl"
              />
              <div className="absolute -bottom-6 -right-6 bg-gradient-to-r from-yellow-400 to-orange-500 p-6 rounded-2xl text-white">
                <div className="text-2xl font-bold">10,000+</div>
                <div className="text-sm opacity-90">Optimized Installations</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How We Help Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-6">How We Help the Public</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Our comprehensive platform addresses every aspect of solar energy optimization, 
              making renewable energy accessible and profitable for everyone.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {[
              {
                icon: <Users className="w-8 h-8 text-blue-500" />,
                title: "Homeowners",
                benefits: [
                  "Maximize home solar investment ROI",
                  "Reduce electricity bills effectively", 
                  "Increase property value sustainably",
                  "Access to expert-level insights"
                ]
              },
              {
                icon: <Brain className="w-8 h-8 text-green-500" />,
                title: "Energy Professionals",
                benefits: [
                  "Advanced predictive analytics tools",
                  "Streamlined project planning",
                  "Accurate client proposals",
                  "Competitive market advantage"
                ]
              },
              {
                icon: <Lightbulb className="w-8 h-8 text-yellow-500" />,
                title: "Businesses",
                benefits: [
                  "Enterprise-scale energy optimization",
                  "Sustainability goal achievement",
                  "Operational cost reduction",
                  "Environmental impact measurement"
                ]
              }
            ].map((group, index) => (
              <div key={index} className="bg-gray-50 p-8 rounded-2xl">
                <div className="bg-white w-16 h-16 rounded-xl flex items-center justify-center mb-6 shadow-md">
                  {group.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-6">{group.title}</h3>
                <ul className="space-y-3">
                  {group.benefits.map((benefit, idx) => (
                    <li key={idx} className="flex items-start">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-gray-600 leading-relaxed">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-gray-900 to-blue-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-6">Our Technology Advantage</h2>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              Advanced machine learning algorithms powered by comprehensive environmental data 
              and real-world solar performance metrics.
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              {[
                {
                  title: "Multi-Factor Analysis",
                  description: "Our AI considers geographical coordinates, weather patterns, seasonal variations, panel specifications, and shading effects for comprehensive predictions."
                },
                {
                  title: "Real-Time Adaptation",
                  description: "Machine learning models continuously improve accuracy by incorporating new environmental data and performance feedback."
                },
                {
                  title: "Optimization Algorithms",
                  description: "Advanced calculations determine optimal panel tilt, azimuth angles, and placement strategies for maximum energy generation."
                },
                {
                  title: "Predictive Forecasting",
                  description: "Long-term and short-term predictions help users plan maintenance, energy storage, and grid integration effectively."
                }
              ].map((item, index) => (
                <div key={index} className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20">
                  <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                  <p className="text-blue-100 leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
            
            <div className="text-center">
              <div className="bg-white/10 backdrop-blur-sm p-12 rounded-3xl border border-white/20">
                <Award className="w-24 h-24 text-yellow-400 mx-auto mb-6" />
                <h3 className="text-3xl font-bold text-white mb-4">Award-Winning Innovation</h3>
                <p className="text-blue-100 mb-6 leading-relaxed">
                  Recognized by leading energy organizations for advancing renewable energy adoption 
                  through artificial intelligence excellence.
                </p>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="bg-white/10 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-white">95%</div>
                    <div className="text-sm text-blue-200">Accuracy Rate</div>
                  </div>
                  <div className="bg-white/10 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-white">24/7</div>
                    <div className="text-sm text-blue-200">Data Processing</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-800 mb-6">Our Environmental Impact</h2>
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            Through optimized solar installations, we're helping reduce carbon emissions 
            and accelerate the global transition to sustainable energy.
          </p>
          
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { value: "50K", suffix: "tons", label: "CO₂ Reduced Annually" },
              { value: "15M", suffix: "kWh", label: "Clean Energy Generated" },
              { value: "5K", suffix: "+", label: "Homes Powered" },
              { value: "25%", suffix: "avg", label: "Efficiency Improvement" }
            ].map((stat, index) => (
              <div key={index} className="bg-white p-8 rounded-2xl shadow-lg">
                <div className="text-4xl font-bold text-green-600 mb-2">
                  {stat.value}<span className="text-2xl">{stat.suffix}</span>
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;