import { useEffect } from "react";
import { Separator } from "@/components/ui/separator";

const About = () => {
  useEffect(() => {
    document.title = "About Us - Okkyno";
  }, []);

  return (
    <>
      <div className="bg-green-50 py-12">
        <div className="container mx-auto px-4">
          <h1 className="font-bold text-3xl md:text-4xl text-center">About Okkyno</h1>
        </div>
      </div>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="mb-12 flex flex-col md:flex-row items-center gap-8">
              <div className="md:w-1/2">
                <img 
                  src="/images/about/mission.svg" 
                  alt="Our Mission" 
                  className="rounded-lg shadow-lg w-full h-auto"
                />
              </div>
              <div className="md:w-1/2">
                <h2 className="font-bold text-2xl mb-4">Our Mission</h2>
                <p className="text-gray-700 mb-4">
                  At Okkyno, our mission is to help you become a better gardener with expert tips, tools, and resources 
                  to grow your own food and create beautiful gardens, regardless of your experience level or available space.
                </p>
                <p className="text-gray-700">
                  We believe that growing your own food and connecting with nature through gardening can transform lives, 
                  improve health, and contribute to a more sustainable world.
                </p>
              </div>
            </div>

            <div className="mb-12 flex flex-col md:flex-row-reverse items-center gap-8">
              <div className="md:w-1/2">
                <img 
                  src="/images/about/story.svg" 
                  alt="Our Story" 
                  className="rounded-lg shadow-lg w-full h-auto"
                />
              </div>
              <div className="md:w-1/2">
                <h2 className="font-bold text-2xl mb-4">Our Story</h2>
                <p className="text-gray-700 mb-4">
                  Okkyno began as a small blog documenting personal gardening experiments and has grown into a 
                  comprehensive resource for gardeners worldwide. What started as a passion project has evolved into a 
                  community of like-minded individuals who share tips, celebrate successes, and learn from challenges.
                </p>
                <p className="text-gray-700">
                  Today, we reach millions of gardeners through our website, social media, podcast, and YouTube channel, 
                  always maintaining our commitment to practical, accessible gardening advice.
                </p>
              </div>
            </div>

            <div className="mb-12">
              <h2 className="font-bold text-2xl mb-4 text-center">Our Values</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                <div className="bg-white p-6 rounded-lg shadow-md text-center">
                  <div className="text-green-600 text-3xl mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                      <path d="M2 17l10 5 10-5"/>
                      <path d="M2 12l10 5 10-5"/>
                    </svg>
                  </div>
                  <h3 className="font-semibold text-xl mb-2">Sustainability</h3>
                  <p className="text-gray-700">
                    We promote environmentally friendly gardening practices that work with nature, not against it.
                  </p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md text-center">
                  <div className="text-green-600 text-3xl mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
                      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
                    </svg>
                  </div>
                  <h3 className="font-semibold text-xl mb-2">Education</h3>
                  <p className="text-gray-700">
                    We believe in making gardening knowledge accessible to all, regardless of experience level.
                  </p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md text-center">
                  <div className="text-green-600 text-3xl mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                      <circle cx="9" cy="7" r="4"/>
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                    </svg>
                  </div>
                  <h3 className="font-semibold text-xl mb-2">Community</h3>
                  <p className="text-gray-700">
                    We foster a supportive community where gardeners can connect, share, and grow together.
                  </p>
                </div>
              </div>
            </div>

            <div className="mb-12">
              <h2 className="font-bold text-2xl mb-4">Our Team</h2>
              <p className="text-gray-700 mb-8">
                Our team consists of passionate gardeners, horticulturists, and plant enthusiasts dedicated to creating 
                the best gardening content and products to help you succeed in your gardening journey.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white rounded-lg overflow-hidden shadow-md">
                  <img 
                    src="/images/team/john.svg" 
                    alt="John Smith" 
                    className="w-full h-56 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-1">John Smith</h3>
                    <p className="text-green-600 text-sm mb-3">Founder & CEO</p>
                    <p className="text-gray-700 text-sm">
                      Urban gardening expert with over 15 years of experience growing in small spaces.
                    </p>
                  </div>
                </div>
                <div className="bg-white rounded-lg overflow-hidden shadow-md">
                  <img 
                    src="/images/team/sarah.svg" 
                    alt="Sarah Johnson" 
                    className="w-full h-56 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-1">Sarah Johnson</h3>
                    <p className="text-green-600 text-sm mb-3">Head of Content</p>
                    <p className="text-gray-700 text-sm">
                      Horticulturist and garden writer specializing in vegetable gardening and permaculture.
                    </p>
                  </div>
                </div>
                <div className="bg-white rounded-lg overflow-hidden shadow-md">
                  <img 
                    src="/images/team/robert.svg" 
                    alt="Robert Chen" 
                    className="w-full h-56 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-1">Robert Chen</h3>
                    <p className="text-green-600 text-sm mb-3">Product Manager</p>
                    <p className="text-gray-700 text-sm">
                      Former landscaper with a passion for creating innovative gardening tools and solutions.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default About;