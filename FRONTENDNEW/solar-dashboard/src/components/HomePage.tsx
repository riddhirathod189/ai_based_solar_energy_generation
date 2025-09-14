import React from 'react';
import { ArrowRight, Zap, MapPin, TrendingUp, Download } from 'lucide-react';
import SolarPanel3D from './SolarPanel3D';

interface HomePageProps {
  onPageChange: (page: string) => void;
}

const HomePage: React.FC<HomePageProps> = ({ onPageChange }) => {
    return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-6 leading-tight">
                Predict Solar Power with
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-orange-500"> AI Precision</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Harness the power of artificial intelligence to predict solar energy generation with unprecedented accuracy. 
                Optimize your solar installations and maximize renewable energy output.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <button 
                onClick={() => onPageChange('dashboard')}
                className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-lg font-semibold 
                                 hover:from-blue-700 hover:to-blue-800 transform hover:scale-105 transition-all duration-200 
                                 flex items-center justify-center group shadow-lg">
                  Start Prediction <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button className="border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-lg font-semibold 
                                 hover:bg-blue-600 hover:text-white transition-all duration-200 shadow-lg">
                  Watch Demo
                </button>
              </div>
            </div>
            
            <div className="flex justify-center lg:justify-end">
              <div className="relative">
                <SolarPanel3D/>
                <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 text-sm text-gray-500 font-medium">
                  Interactive 3D Solar Panel
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Hero Image Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="relative rounded-3xl overflow-hidden shadow-2xl">
            <img 
              src="https://images.pexels.com/photos/9875416/pexels-photo-9875416.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop"
              alt="Solar panels in a field with blue sky"
              className="w-full h-96 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-900/70 to-transparent flex items-center">
              <div className="text-white px-12">
                <h3 className="text-3xl font-bold mb-4">Advanced Solar Analytics</h3>
                <p className="text-lg opacity-90 leading-relaxed max-w-2xl">
                  Our AI algorithms analyze weather patterns, geographical data, and panel specifications 
                  to deliver precise solar energy predictions for optimal renewable energy planning.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-6">Why Choose SolarPredict AI?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Our cutting-edge machine learning platform revolutionizes solar energy forecasting with 
              precision, adaptability, and actionable insights.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <Zap className="w-8 h-8 text-yellow-500" />,
                title: "AI-Powered Predictions",
                description: "Advanced machine learning models analyze complex environmental factors for accurate solar output forecasting."
              },
              {
                icon: <MapPin className="w-8 h-8 text-green-500" />,
                title: "Location Intelligence",
                description: "Precise geographical analysis considering latitude, longitude, and local weather patterns for optimal accuracy."
              },
              {
                icon: <TrendingUp className="w-8 h-8 text-blue-500" />,
                title: "Performance Optimization",
                description: "Get actionable recommendations for panel tilt, azimuth angles, and placement to maximize energy generation."
              },
              {
                icon: <Download className="w-8 h-8 text-purple-500" />,
                title: "Detailed Reports",
                description: "Export comprehensive reports in CSV or PDF format with daily, weekly, and monthly generation forecasts."
              }
            ].map((feature, index) => (
              <div key={index} className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300">
                <div className="bg-gray-50 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-green-600">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-6">Proven Impact</h2>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto leading-relaxed">
              See how our AI-powered predictions are transforming solar energy optimization worldwide.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 text-center">
            {[
              { value: "95%", label: "Prediction Accuracy", description: "Industry-leading precision" },
              { value: "25%", label: "Efficiency Increase", description: "Average improvement in solar output" },
              { value: "10K+", label: "Active Users", description: "Trusted by professionals globally" }
            ].map((stat, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl border border-white/20">
                <div className="text-5xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-xl font-semibold text-blue-100 mb-2">{stat.label}</div>
                <div className="text-blue-200">{stat.description}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-800 mb-6">Ready to Optimize Your Solar Energy?</h2>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Join thousands of solar professionals using AI to maximize renewable energy generation. 
            Start your free prediction today.
          </p>
          <button className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-12 py-4 rounded-lg text-lg font-semibold 
                           hover:from-green-700 hover:to-blue-700 transform hover:scale-105 transition-all duration-200 
                           shadow-lg flex items-center justify-center mx-auto group">
            Get Started Now <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </section>
    </div>
  );
};

export default HomePage;