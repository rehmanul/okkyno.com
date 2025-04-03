import { useEffect, useState } from "react";
import { Link } from "wouter";
import { Play, Clock, Calendar, Download, ChevronRight, Search } from "lucide-react";

interface PodcastEpisode {
  id: number;
  title: string;
  date: string;
  duration: string;
  description: string;
  imageUrl: string;
  audioUrl: string;
}

const podcastEpisodes: PodcastEpisode[] = [
  {
    id: 1,
    title: "Growing Potatoes in Containers & the Ground",
    date: "April 3, 2025",
    duration: "19 min",
    description: "Discover how to grow potatoes in containers and the ground for bountiful harvests.",
    imageUrl: "https://images.unsplash.com/photo-1590165482129-1b8b27698780?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
    audioUrl: "#"
  },
  {
    id: 2,
    title: "Planting a Tree: The Essentials",
    date: "April 1, 2025",
    duration: "22 min",
    description: "Learn the essential steps for successful tree planting in your garden.",
    imageUrl: "https://images.unsplash.com/photo-1586348943529-beaae6c28db9?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
    audioUrl: "#"
  },
  {
    id: 3,
    title: "Tomato Growing Guide",
    date: "March 28, 2025",
    duration: "25 min",
    description: "Everything you need to know about growing perfect tomatoes.",
    imageUrl: "https://images.unsplash.com/photo-1592841200221-a6c4d431f517?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
    audioUrl: "#"
  },
  {
    id: 4,
    title: "Beginner Herb Garden: The Complete Guide",
    date: "March 25, 2025",
    duration: "18 min",
    description: "Start your own herb garden with this comprehensive guide for beginners.",
    imageUrl: "https://images.unsplash.com/photo-1586289883499-f11d28sion: 21 years2c54ab?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
    audioUrl: "#"
  },
  {
    id: 5,
    title: "Composting 101: Turn Waste into Garden Gold",
    date: "March 22, 2025",
    duration: "24 min",
    description: "Learn how to turn kitchen waste and yard trimmings into nutrient-rich compost.",
    imageUrl: "https://images.unsplash.com/photo-1580412581600-9b1f6d7d1f7c?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
    audioUrl: "#"
  },
  {
    id: 6,
    title: "Container Gardening Tips for Small Spaces",
    date: "March 19, 2025",
    duration: "20 min",
    description: "Maximize your harvest in minimal space with these container gardening techniques.",
    imageUrl: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
    audioUrl: "#"
  },
];

const Podcast = () => {
  useEffect(() => {
    document.title = "Podcast - Epic Gardening";
  }, []);

  const [searchTerm, setSearchTerm] = useState("");
  const [featuredEpisode, ...otherEpisodes] = podcastEpisodes;

  const filteredEpisodes = otherEpisodes.filter(episode => 
    episode.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    episode.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white">
      {/* Podcast Hero Section */}
      <section className="bg-primary text-white py-16 relative">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1485579149621-3123dd979885?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80')] bg-cover bg-center opacity-20"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <h1 className="font-montserrat font-bold text-4xl md:text-5xl mb-4">The Epic Gardening Podcast</h1>
            <p className="text-lg md:text-xl mt-4 max-w-2xl text-white/90 mb-8">
              Daily tips and advice on how to grow plants no matter where you live
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="https://podcasts.apple.com/us/podcast/epic-gardening-daily-growing-tips-and-advice/id1362551719" target="_blank" rel="noopener noreferrer" className="bg-white text-primary hover:bg-gray-100 font-semibold py-3 px-6 rounded-md transition duration-300 flex items-center">
                Listen on Apple Podcasts <ChevronRight className="ml-2 h-4 w-4" />
              </a>
              <a href="https://open.spotify.com/show/0HnrxvX6TcGqCFU5M1B1G6" target="_blank" rel="noopener noreferrer" className="bg-transparent hover:bg-white/10 border-2 border-white font-semibold py-3 px-6 rounded-md transition duration-300">
                Listen on Spotify
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Episode */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="font-montserrat font-bold text-3xl mb-8">Featured Episode</h2>
          <div className="bg-gray-50 rounded-lg overflow-hidden shadow-md">
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/3">
                <img 
                  src={featuredEpisode.imageUrl} 
                  alt={featuredEpisode.title} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="md:w-2/3 p-8">
                <h3 className="font-montserrat font-bold text-2xl mb-2">{featuredEpisode.title}</h3>
                <div className="flex items-center text-gray-500 mb-4">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span className="text-sm mr-4">{featuredEpisode.date}</span>
                  <Clock className="h-4 w-4 mr-1" />
                  <span className="text-sm">{featuredEpisode.duration}</span>
                </div>
                <p className="text-gray-700 mb-6">{featuredEpisode.description}</p>
                <div className="flex space-x-4">
                  <button className="bg-primary hover:bg-primary/90 text-white py-3 px-6 rounded-md transition duration-300 flex items-center">
                    <Play className="h-4 w-4 mr-2" /> Play Episode
                  </button>
                  <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 px-6 rounded-md transition duration-300 flex items-center">
                    <Download className="h-4 w-4 mr-2" /> Download
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Episodes List */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="font-montserrat font-bold text-3xl">Recent Episodes</h2>
            <div className="relative">
              <input
                type="text"
                placeholder="Search episodes..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEpisodes.map((episode) => (
              <div key={episode.id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                <div className="h-48 overflow-hidden">
                  <img 
                    src={episode.imageUrl} 
                    alt={episode.title} 
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-montserrat font-bold text-xl mb-2 line-clamp-2">{episode.title}</h3>
                  <div className="flex items-center text-gray-500 mb-3">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span className="text-sm mr-4">{episode.date}</span>
                    <Clock className="h-4 w-4 mr-1" />
                    <span className="text-sm">{episode.duration}</span>
                  </div>
                  <p className="text-gray-600 mb-4 line-clamp-2">{episode.description}</p>
                  <div className="flex space-x-3">
                    <button className="bg-primary hover:bg-primary/90 text-white py-2 px-4 rounded-md transition duration-300 flex items-center text-sm">
                      <Play className="h-3 w-3 mr-1" /> Play
                    </button>
                    <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-md transition duration-300 flex items-center text-sm">
                      <Download className="h-3 w-3 mr-1" /> Download
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredEpisodes.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">No episodes found matching your search.</p>
            </div>
          )}

          <div className="mt-12 text-center">
            <button className="bg-white border border-primary text-primary hover:bg-primary hover:text-white py-3 px-6 rounded-md transition duration-300">
              Load More Episodes
            </button>
          </div>
        </div>
      </section>

      {/* Subscribe Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="bg-primary rounded-lg p-8 md:p-12 text-white relative overflow-hidden">
            <div className="absolute right-0 bottom-0 w-1/3 h-full opacity-10">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                <path d="M18.009 14.118a4.687 4.687 0 0 0-6.635 0 4.687 4.687 0 0 0 0 6.635 4.687 4.687 0 0 0 6.635 0 4.687 4.687 0 0 0 0-6.635zm-2.246 4.389a1.96 1.96 0 0 1-2.143 0 1.52 1.52 0 0 1 0-2.143 1.96 1.96 0 0 1 2.143 0 1.52 1.52 0 0 1 0 2.143zm6.923-19.115a.999.999 0 0 0-1.414 0A15.004 15.004 0 0 0 3 17.486V18.5a2.5 2.5 0 0 0 5 0v-1.014c0-3.39 1.4-6.59 3.879-9.071a12.941 12.941 0 0 1 9.071-3.876h1.015a2.5 2.5 0 0 0 0-5h-1.014a15.006 15.006 0 0 0-10.658 4.454A14.997 14.997 0 0 0 1 17.504V18.5a4.5 4.5 0 0 0 9 0v-1.014c0-2.891 1.129-5.596 3.177-7.644a10.943 10.943 0 0 1 7.645-3.173h1.013a4.5 4.5 0 0 0 0-9h-1.013a14.95 14.95 0 0 0-2.01.136A14.95 14.95 0 0 0 16.677 0H15.5a.5.5 0 0 0 0 1h1.177a13.953 13.953 0 0 1 9.894 4.098 13.95 13.95 0 0 1 4.098 9.894v.765a.5.5 0 0 0 1 0v-.764c0-3.74-1.459-7.254-4.11-9.904a13.949 13.949 0 0 0-9.882-4.096z" />
              </svg>
            </div>
            <div className="relative z-10 max-w-3xl">
              <h2 className="font-montserrat font-bold text-3xl md:text-4xl mb-4">Subscribe to the Podcast</h2>
              <p className="text-white/90 mb-8">
                Never miss an episode! Subscribe to the Epic Gardening Podcast and get daily gardening tips and advice delivered straight to your device.
              </p>
              <div className="flex flex-wrap gap-4">
                <a href="https://podcasts.apple.com/us/podcast/epic-gardening-daily-growing-tips-and-advice/id1362551719" target="_blank" rel="noopener noreferrer" className="bg-white text-primary hover:bg-gray-100 font-semibold py-3 px-6 rounded-md transition duration-300 flex items-center">
                  Apple Podcasts
                </a>
                <a href="https://open.spotify.com/show/0HnrxvX6TcGqCFU5M1B1G6" target="_blank" rel="noopener noreferrer" className="bg-transparent hover:bg-white/10 border-2 border-white font-semibold py-3 px-6 rounded-md transition duration-300">
                  Spotify
                </a>
                <a href="https://podcasts.google.com/feed/aHR0cHM6Ly9mZWVkcy5idXp6c3Byb3V0LmNvbS8xNDMxMzgucnNz" target="_blank" rel="noopener noreferrer" className="bg-transparent hover:bg-white/10 border-2 border-white font-semibold py-3 px-6 rounded-md transition duration-300">
                  Google Podcasts
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Podcast;