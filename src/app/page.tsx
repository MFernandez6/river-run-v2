"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import {
  Building2,
  MapPin,
  Users,
  Calendar,
  Phone,
  Mail,
  Navigation,
  Waves,
  Home,
  Shield,
  Star,
  Newspaper,
  MessageSquare,
  Bell,
  TrendingUp,
  UserPlus,
  FileText,
  Megaphone,
  X,
  Navigation2,
  Coffee,
  ShoppingBag,
  Plane,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

export default function HomePage() {
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);

  // Building location coordinates (Miami, FL area)
  const buildingLocation = {
    lat: 25.7617,
    lng: -80.1918,
    address: "33125 Miami, Florida",
  };

  // Surrounding attractions
  const attractions = [
    {
      name: "Miami International Airport",
      distance: "8.2 miles",
      icon: <Plane className="h-4 w-4" />,
      category: "Transportation",
    },
    {
      name: "Bayside Marketplace",
      distance: "12.5 miles",
      icon: <ShoppingBag className="h-4 w-4" />,
      category: "Shopping",
    },
    {
      name: "Miami Beach",
      distance: "15.3 miles",
      icon: <Waves className="h-4 w-4" />,
      category: "Entertainment",
    },
    {
      name: "Downtown Miami",
      distance: "10.8 miles",
      icon: <Building2 className="h-4 w-4" />,
      category: "Business",
    },
    {
      name: "Coral Gables",
      distance: "6.7 miles",
      icon: <Coffee className="h-4 w-4" />,
      category: "Dining",
    },
    {
      name: "Key Biscayne",
      distance: "18.2 miles",
      icon: <Navigation2 className="h-4 w-4" />,
      category: "Recreation",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-100 via-amber-50 to-amber-200">
      {/* Navigation */}
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="fixed top-0 w-full z-50 glass border-b border-white/20"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-3">
            <motion.div
              className="flex items-center space-x-2"
              whileHover={{ scale: 1.05 }}
            >
              <Building2 className="h-7 w-7 text-amber-700" />
              <span className="text-lg font-bold text-gray-800">River Run</span>
            </motion.div>
            <div className="hidden md:flex space-x-6">
              {["Home", "About", "Board", "News", "Contact"].map((item) => (
                <motion.a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="text-sm font-medium text-gray-700 hover:text-amber-700 transition-colors"
                  whileHover={{ scale: 1.05 }}
                >
                  {item}
                </motion.a>
              ))}
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section
        id="home"
        className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16"
      >
        {/* Hero Background Image */}
        <div className="absolute inset-0">
          <img
            src="/images/building.jpg"
            alt="River Run Condominium Building"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-amber-900/50 via-amber-800/40 to-amber-900/60"></div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-64 h-64 bg-amber-200/20 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-float"></div>
        <div
          className="absolute top-40 right-10 w-64 h-64 bg-amber-200/20 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-float"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute bottom-20 left-1/3 w-64 h-64 bg-amber-400/25 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-float"
          style={{ animationDelay: "4s" }}
        ></div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="glass rounded-2xl p-8 md:p-12 backdrop-blur-xl"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="inline-flex items-center justify-center w-16 h-16 bg-amber-700 rounded-full mb-6"
            >
              <Building2 className="h-8 w-8 text-white" />
            </motion.div>

            <motion.h1
              className="text-5xl md:text-7xl font-extrabold text-white mb-6 tracking-tight"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              style={{
                textShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
                background:
                  "linear-gradient(135deg, #ffffff 0%, #fef3c7 50%, #f59e0b 100%)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              River Run
            </motion.h1>

            <motion.p
              className="text-xl md:text-2xl text-amber-100 mb-8 max-w-3xl mx-auto font-medium leading-relaxed"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.9 }}
              style={{
                textShadow: "0 2px 10px rgba(0, 0, 0, 0.3)",
              }}
            >
              Waterfront Living in the Heart of Miami
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.1 }}
              className="flex flex-col sm:flex-row gap-3 justify-center"
            >
              <Button
                size="lg"
                onClick={() => setIsMapModalOpen(true)}
                className="bg-amber-700 hover:bg-amber-800 text-white px-6 py-2.5 rounded-full text-sm font-medium"
              >
                <MapPin className="mr-2 h-4 w-4" />
                Explore Location
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => {
                  document.getElementById("board")?.scrollIntoView({
                    behavior: "smooth",
                  });
                }}
                className="border-amber-700 text-amber-700 hover:bg-amber-700 hover:text-white px-6 py-2.5 rounded-full text-sm font-medium"
              >
                <Users className="mr-2 h-4 w-4" />
                Meet the Board
              </Button>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.5 }}
          className="absolute bottom-6 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-5 h-8 border-2 border-gray-400 rounded-full flex justify-center"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1 h-2 bg-gray-400 rounded-full mt-1"
            />
          </motion.div>
        </motion.div>
      </section>

      {/* Building Overview Section */}
      <section id="about" className="py-16 bg-white/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Building Overview
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              A prestigious 10-story waterfront condominium offering luxury
              living in Miami&apos;s most desirable location.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="glass border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-full">
                <CardHeader className="pb-3">
                  <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center mb-3">
                    <Building2 className="h-5 w-5 text-amber-700" />
                  </div>
                  <CardTitle className="text-xl">10 Stories</CardTitle>
                  <CardDescription className="text-sm">
                    Modern residential tower built in 1982
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm text-gray-600">
                    Each floor offers stunning views of the North River and
                    Miami skyline, providing residents with a unique waterfront
                    living experience.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <Card className="glass border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-full">
                <CardHeader className="pb-3">
                  <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center mb-3">
                    <Home className="h-5 w-5 text-amber-700" />
                  </div>
                  <CardTitle className="text-xl">Premium Flooring</CardTitle>
                  <CardDescription className="text-sm">
                    Hardwood and tile throughout all units
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm text-gray-600">
                    Each unit offers premium flooring options including
                    hardwood, tile, and luxury vinyl, combining durability with
                    sophisticated design aesthetics.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <Card className="glass border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-full">
                <CardHeader className="pb-3">
                  <div className="w-10 h-10 bg-amber-200 rounded-lg flex items-center justify-center mb-3">
                    <Waves className="h-5 w-5 text-amber-800" />
                  </div>
                  <CardTitle className="text-xl">Waterfront Location</CardTitle>
                  <CardDescription className="text-sm">
                    Prime position along the North River
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm text-gray-600">
                    Located in the prestigious 33125 postal code area, offering
                    unparalleled waterfront views and access to Miami&apos;s
                    best amenities.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Building Gallery Section */}
      <section className="py-16 bg-gradient-to-r from-amber-50 to-amber-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Building Gallery
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Explore the stunning architecture and beautiful views from every
              angle of River Run Condominium.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                src: "/images/front-entrance.jpg",
                alt: "Front Entrance of River Run Condominium",
                title: "Grand Entrance",
                description: "Elegant front entrance with modern design",
              },
              {
                src: "/images/side-view.jpg",
                alt: "Side View of River Run Condominium",
                title: "Architectural Profile",
                description:
                  "Stunning side view showcasing the building&apos;s design",
              },
              {
                src: "/images/back-view.jpg",
                alt: "Back View of River Run Condominium",
                title: "Waterfront Access",
                description: "Direct access to the North River waterfront",
              },
              {
                src: "/images/south-east-view.jpg",
                alt: "South East View of River Run Condominium",
                title: "Southeast Perspective",
                description: "Beautiful southeast angle with natural lighting",
              },
              {
                src: "/images/bird-eye.jpg",
                alt: "Bird&apos;s Eye View of River Run Condominium",
                title: "Aerial View",
                description: "Breathtaking aerial perspective of the property",
              },
              {
                src: "/images/building.jpg",
                alt: "Main Building View of River Run Condominium",
                title: "Main Facade",
                description: "The iconic main building facade",
              },
            ].map((image, index) => (
              <motion.div
                key={image.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group cursor-pointer"
              >
                <Card className="glass border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden">
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={image.src}
                      alt={image.alt}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="absolute bottom-4 left-4 right-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <h4 className="font-semibold text-sm mb-1">
                        {image.title}
                      </h4>
                      <p className="text-xs">{image.description}</p>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-gray-800 mb-2">
                      {image.title}
                    </h3>
                    <p className="text-sm text-gray-600">{image.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Parallax Waterfront Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/images/bird-eye.jpg"
            alt="Aerial View of River Run Condominium"
            className="w-full h-full object-cover parallax"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-amber-900/80 via-amber-800/70 to-amber-900/80"></div>
        </div>
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center text-white"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Prime Waterfront Location
            </h2>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-amber-100">
              Experience the breathtaking views and direct access to the North
              River from your home at River Run Condominium.
            </p>
            <div className="grid md:grid-cols-3 gap-8 mt-12">
              <div className="glass rounded-xl p-6 backdrop-blur-sm">
                <Waves className="h-12 w-12 text-amber-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">
                  Direct River Access
                </h3>
                <p className="text-amber-100 text-sm">
                  Private waterfront access for residents
                </p>
              </div>
              <div className="glass rounded-xl p-6 backdrop-blur-sm">
                <Navigation className="h-12 w-12 text-amber-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">
                  Strategic Location
                </h3>
                <p className="text-amber-100 text-sm">
                  Convenient access to Miami&apos;s best amenities
                </p>
              </div>
              <div className="glass rounded-xl p-6 backdrop-blur-sm">
                <Star className="h-12 w-12 text-amber-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Premium Views</h3>
                <p className="text-amber-100 text-sm">
                  Stunning panoramic views from every unit
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Neighborhood Section */}
      <section className="py-16 bg-gradient-to-r from-amber-50 to-amber-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Neighborhood Context
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Experience the best of Miami living in one of the city&apos;s most
              established waterfront communities.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <Card className="glass border-0 shadow-lg overflow-hidden">
                <div className="relative h-48">
                  <img
                    src="/images/front-entrance.jpg"
                    alt="Front Entrance of River Run Condominium"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <h3 className="font-semibold text-lg">Elegant Entrance</h3>
                    <p className="text-sm text-amber-100">
                      Welcoming residents and guests
                    </p>
                  </div>
                </div>
                <CardHeader className="pb-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                      <MapPin className="h-5 w-5 text-amber-700" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">
                        33125 Postal Code
                      </CardTitle>
                      <CardDescription className="text-sm">
                        Miami, Florida
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm text-gray-600 mb-4">
                    River Run Condominium is strategically positioned in
                    Miami&apos;s 33125 postal code area, one of the city&apos;s
                    most desirable waterfront residential districts.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Badge
                      variant="secondary"
                      className="bg-amber-200 text-amber-900 text-xs"
                    >
                      Waterfront Living
                    </Badge>
                    <Badge
                      variant="secondary"
                      className="bg-amber-100 text-amber-800 text-xs"
                    >
                      Established Neighborhood
                    </Badge>
                    <Badge
                      variant="secondary"
                      className="bg-amber-200 text-amber-900 text-xs"
                    >
                      Prime Location
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="space-y-4"
            >
              <div className="glass rounded-xl p-4 border-0 shadow-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                  Key Features
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-3">
                    <Navigation className="h-4 w-4 text-amber-600" />
                    <span className="text-sm text-gray-700">
                      Direct North River access
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Star className="h-4 w-4 text-amber-600" />
                    <span className="text-sm text-gray-700">
                      Established waterfront community
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Shield className="h-4 w-4 text-amber-700" />
                    <span className="text-sm text-gray-700">
                      Secure residential environment
                    </span>
                  </div>
                </div>
              </div>

              <div className="glass rounded-xl p-4 border-0 shadow-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                  Market Position
                </h3>
                <p className="text-sm text-gray-600">
                  As part of Miami&apos;s prestigious waterfront residential
                  offerings, River Run Condominium represents one of the most
                  sought-after addresses in the Miami real estate market.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Board Members Section */}
      <section id="board" className="py-16 bg-white/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Board of Directors
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Meet the dedicated professionals who guide our community with
              expertise and care.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                name: "Sarah Johnson",
                position: "President",
                email: "RRCBoardEmail@Gmail.com",
                phone: "(305) 555-0101",
                initials: "SJ",
              },
              {
                name: "Michael Rodriguez",
                position: "Vice President",
                email: "RRCBoardEmail@Gmail.com",
                phone: "(305) 555-0102",
                initials: "MR",
              },
              {
                name: "Jennifer Chen",
                position: "Treasurer",
                email: "RRCBoardEmail@Gmail.com",
                phone: "(305) 555-0103",
                initials: "JC",
              },
              {
                name: "David Thompson",
                position: "Secretary",
                email: "RRCBoardEmail@Gmail.com",
                phone: "(305) 555-0104",
                initials: "DT",
              },
              {
                name: "Maria Gonzalez",
                position: "Board Member",
                email: "RRCBoardEmail@Gmail.com",
                phone: "(305) 555-0105",
                initials: "MG",
              },
              {
                name: "Robert Kim",
                position: "Board Member",
                email: "RRCBoardEmail@Gmail.com",
                phone: "(305) 555-0106",
                initials: "RK",
              },
            ].map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="glass border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-full">
                  <CardHeader className="text-center pb-3">
                    <Avatar className="w-16 h-16 mx-auto mb-3">
                      <AvatarImage src={`/api/placeholder/64/64`} />
                      <AvatarFallback className="bg-amber-100 text-amber-800 text-lg font-semibold">
                        {member.initials}
                      </AvatarFallback>
                    </Avatar>
                    <CardTitle className="text-lg">{member.name}</CardTitle>
                    <CardDescription className="text-amber-700 font-medium text-sm">
                      {member.position}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0 space-y-2">
                    <div className="flex items-center space-x-2 text-xs text-gray-600">
                      <Mail className="h-3 w-3" />
                      <span className="truncate">{member.email}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-xs text-gray-600">
                      <Phone className="h-3 w-3" />
                      <span>{member.phone}</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter & Discussion Board Section */}
      <section id="news" className="py-16 bg-white/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Community Updates & Discussion
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Stay informed with the latest community news, announcements, and
              engage in discussions with your neighbors.
            </p>
          </motion.div>

          {/* Nextdoor Community Section - Full Width */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <Card className="glass border-0 shadow-xl overflow-hidden">
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-8">
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-6">
                  <div className="flex items-center space-x-4 mb-4 lg:mb-0">
                    <div className="w-16 h-16 bg-green-500 rounded-2xl flex items-center justify-center shadow-lg">
                      <span className="text-white text-2xl font-bold">N</span>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-800 mb-1">
                        River Run Nextdoor Community
                      </h3>
                      <p className="text-gray-600">
                        Connect with your neighbors and stay informed about
                        building updates
                      </p>
                    </div>
                  </div>
                  <Button
                    onClick={() =>
                      window.open(
                        "https://nextdoor.com/g/u68pgclpi/?is=groups_section_rhr",
                        "_blank"
                      )
                    }
                    size="lg"
                    className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <Users className="mr-2 h-5 w-5" />
                    Join Community
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-green-200">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                        <TrendingUp className="h-5 w-5 text-amber-600" />
                      </div>
                      <h4 className="font-semibold text-gray-800">
                        Live Updates
                      </h4>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      Real-time building maintenance updates, community events,
                      and resident discussions
                    </p>
                    <div className="flex items-center text-xs text-green-600">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                      Active community
                    </div>
                  </div>

                  <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-green-200">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Bell className="h-5 w-5 text-blue-600" />
                      </div>
                      <h4 className="font-semibold text-gray-800">
                        Instant Alerts
                      </h4>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      Get notified about building announcements, security
                      updates, and local news
                    </p>
                    <div className="flex items-center text-xs text-green-600">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                      Real-time notifications
                    </div>
                  </div>

                  <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-green-200">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                        <MessageSquare className="h-5 w-5 text-purple-600" />
                      </div>
                      <h4 className="font-semibold text-gray-800">
                        Community Chat
                      </h4>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      Engage in discussions with neighbors, share
                      recommendations, and build connections
                    </p>
                    <div className="flex items-center text-xs text-green-600">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                      Active discussions
                    </div>
                  </div>
                </div>

                <div className="mt-8 p-6 bg-white/50 backdrop-blur-sm rounded-xl border border-green-200">
                  <div className="flex flex-col md:flex-row items-center justify-between">
                    <div className="flex items-center space-x-6 mb-4 md:mb-0">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">
                          150+
                        </div>
                        <div className="text-xs text-gray-600">
                          Active Members
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">
                          24/7
                        </div>
                        <div className="text-xs text-gray-600">
                          Community Support
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">
                          100%
                        </div>
                        <div className="text-xs text-gray-600">
                          Verified Neighbors
                        </div>
                      </div>
                    </div>
                    <div className="text-center md:text-right">
                      <p className="text-sm text-gray-600 mb-2">
                        Join the most active building community in Miami
                      </p>
                      <div className="flex items-center justify-center md:justify-end space-x-2 text-xs text-gray-500">
                        <span>🏠 Building Updates</span>
                        <span>👥 Community Events</span>
                        <span>💬 Local Discussions</span>
                        <span>🔔 Instant Alerts</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Recent Announcements */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              Recent Announcements
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  title: "Google Fiber Partnership Completed",
                  content:
                    "We are pleased to announce the successful completion of our partnership with Google Fiber, providing ultra-fast internet service included in each residential unit. The installation was completed mid-summer, delivering speeds up to 2 Gigabits per second to all residents.",
                  date: "July 15, 2025",
                  icon: <TrendingUp className="h-5 w-5 text-blue-600" />,
                  type: "Technology",
                },
                {
                  title: "Racquetball Court Demolition",
                  content:
                    "The former racquetball court located at the waterfront end of the property has been successfully demolished and converted into a landscaped grass field. Additional improvements and future development plans will be presented for resident input at upcoming board meetings.",
                  date: "August 23, 2025",
                  icon: <Shield className="h-5 w-5 text-amber-600" />,
                  type: "Property",
                },
                {
                  title: "40-Year Recertification Project",
                  content:
                    "The building is currently undergoing its mandatory 40-year recertification process. This comprehensive project will span approximately 12 weeks and includes structural inspections, exterior painting updates, and garage facility renovations to ensure continued compliance and safety standards.",
                  date: "October 25, 2025",
                  icon: <FileText className="h-5 w-5 text-amber-600" />,
                  type: "Maintenance",
                },
              ].map((announcement, index) => (
                <motion.div
                  key={announcement.title}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="glass border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-full">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between mb-3">
                        <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                          {announcement.icon}
                        </div>
                        <Badge
                          variant="secondary"
                          className={`text-xs ${
                            announcement.type === "Maintenance"
                              ? "bg-amber-100 text-amber-800"
                              : announcement.type === "Event"
                              ? "bg-amber-100 text-amber-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {announcement.type}
                        </Badge>
                      </div>
                      <CardTitle className="text-lg">
                        {announcement.title}
                      </CardTitle>
                      <CardDescription className="text-xs text-gray-500">
                        {announcement.date}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-sm text-gray-600">
                        {announcement.content}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section
        id="contact"
        className="py-16 bg-gradient-to-r from-amber-800 to-amber-900"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Get in Touch
            </h2>
            <p className="text-lg text-amber-100 max-w-2xl mx-auto">
              Contact us for more information about River Run Condominium and
              our community.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="glass rounded-xl p-6 overflow-hidden"
            >
              <div className="relative h-48 mb-6 rounded-lg overflow-hidden">
                <img
                  src="/images/side-view.jpg"
                  alt="Side View of River Run Condominium"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-amber-900/60 to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <h4 className="font-semibold text-lg">Contact River Run</h4>
                  <p className="text-sm text-amber-100">
                    Visit us at our beautiful waterfront location
                  </p>
                </div>
              </div>
              <h3 className="text-xl font-bold text-white mb-4">
                Contact Information
              </h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-amber-200" />
                  <span className="text-white text-sm">
                    33125 Miami, Florida
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-amber-200" />
                  <span className="text-white text-sm">
                    RRCBoardEmail@Gmail.com
                  </span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="glass rounded-xl p-6"
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Users className="h-5 w-5 text-green-700" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">
                    Nextdoor Community
                  </h3>
                  <p className="text-sm text-gray-300">
                    Connect with neighbors
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-green-50/10 rounded-lg border border-green-200/20">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-semibold">
                        N
                      </span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-white text-sm">
                        River Run Group
                      </h4>
                      <p className="text-xs text-gray-300">
                        Active community discussions
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center p-3 bg-white/5 rounded-lg">
                    <div className="text-lg font-bold text-green-400">150+</div>
                    <div className="text-xs text-gray-300">Members</div>
                  </div>
                  <div className="text-center p-3 bg-white/5 rounded-lg">
                    <div className="text-lg font-bold text-green-400">24/7</div>
                    <div className="text-xs text-gray-300">Active</div>
                  </div>
                </div>

                <Button
                  onClick={() =>
                    window.open(
                      "https://nextdoor.com/g/u68pgclpi/?is=groups_section_rhr",
                      "_blank"
                    )
                  }
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                >
                  <Users className="mr-2 h-4 w-4" />
                  Join Community
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative bg-gray-900 text-white py-12 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/images/back-view.jpg"
            alt="Back View of River Run Condominium"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80 to-gray-900/60"></div>
        </div>
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-3">
                <Building2 className="h-6 w-6 text-amber-400" />
                <span className="text-lg font-bold">River Run</span>
              </div>
              <p className="text-gray-400 text-sm">
                Waterfront living in the heart of Miami. Experience luxury,
                comfort, and community.
              </p>
            </div>
            <div>
              <h4 className="text-base font-semibold mb-3">Community</h4>
              <div className="space-y-2">
                <a
                  href="#board"
                  className="block text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Board Members
                </a>
                <a
                  href="#news"
                  className="block text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Community Updates
                </a>
                <a
                  href="#contact"
                  className="block text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Contact
                </a>
                <button
                  onClick={() =>
                    window.open(
                      "https://nextdoor.com/g/u68pgclpi/?is=groups_section_rhr",
                      "_blank"
                    )
                  }
                  className="block text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Nextdoor Group
                </button>
              </div>
            </div>
            <div>
              <h4 className="text-base font-semibold mb-3">Contact</h4>
              <div className="space-y-2 text-gray-400 text-sm">
                <p>33125 Miami, Florida</p>
                <p>RRCBoardEmail@Gmail.com</p>
              </div>
            </div>
          </div>
          <Separator className="my-6 bg-gray-700" />
          <div className="text-center text-gray-400 text-sm">
            <p>&copy; 2025 River Run Condominium. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Maps Modal */}
      <AnimatePresence>
        {isMapModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setIsMapModalOpen(false)}
            />

            {/* Modal Content */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-6xl h-[80vh] glass rounded-2xl overflow-hidden flex flex-col"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-white/20">
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    River Run Location
                  </h2>
                  <p className="text-amber-200">{buildingLocation.address}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMapModalOpen(false)}
                  className="text-white hover:bg-white/10"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {/* Modal Body */}
              <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">
                {/* Map Section */}
                <div className="flex-1 relative min-h-[300px] lg:min-h-0">
                  <iframe
                    src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d114964.78925916165!2d-80.299499!3d25.7823903!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x88d9b0a20ec8c111%3A0xff96f271ddad4f65!2sMiami%2C%20FL!5e0!3m2!1sen!2sus!4v1640995200000!5m2!1sen!2sus`}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="rounded-r-2xl lg:rounded-r-2xl rounded-b-2xl lg:rounded-b-none"
                    onError={() => {
                      // Fallback if iframe fails to load
                      const mapContainer =
                        document.querySelector(".map-container");
                      if (mapContainer) {
                        mapContainer.innerHTML = `
                          <div class="flex items-center justify-center h-full bg-gray-800 text-white">
                            <div class="text-center">
                              <MapPin class="h-12 w-12 mx-auto mb-4 text-amber-400" />
                              <h3 class="text-lg font-semibold mb-2">River Run Condominium</h3>
                              <p class="text-amber-200">${buildingLocation.address}</p>
                              <Button 
                                class="mt-4 bg-amber-700 hover:bg-amber-800 text-white"
                                onclick="window.open('https://www.google.com/maps/search/?api=1&query=${buildingLocation.lat},${buildingLocation.lng}', '_blank')"
                              >
                                Open in Google Maps
                              </Button>
                            </div>
                          </div>
                        `;
                      }
                    }}
                  />

                  {/* Building Location Star Marker */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{
                        delay: 0.5,
                        type: "spring",
                        stiffness: 200,
                      }}
                      className="relative"
                    >
                      <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                        <Star className="h-5 w-5 text-white fill-white" />
                      </div>
                      <div className="absolute inset-0 bg-amber-500 rounded-full animate-ping opacity-30"></div>
                    </motion.div>
                  </div>

                  {/* Building Info Overlay */}
                  <div className="absolute top-3 right-3 w-1/3 glass rounded-lg p-3 backdrop-blur-sm border border-amber-200/30 shadow-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-7 h-7 bg-amber-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <MapPin className="h-4 w-4 text-amber-400" />
                      </div>
                      <div className="min-w-0">
                        <span className="text-sm font-semibold text-amber-900 block leading-tight">
                          River Run Condominium
                        </span>
                        <span className="text-xs text-amber-700 leading-tight">
                          Miami, FL 33125
                        </span>
                        <div className="mt-1">
                          <span className="text-xs text-amber-600 block">
                            Waterfront Living
                          </span>
                          <span className="text-xs text-amber-500">
                            Premium Location
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Attractions Sidebar */}
                <div className="w-full lg:w-80 bg-white/10 backdrop-blur-sm flex flex-col h-full">
                  <div className="p-6 pb-4 flex-shrink-0">
                    <h3 className="text-lg font-semibold text-white mb-4">
                      Nearby Attractions
                    </h3>
                  </div>
                  <div className="flex-1 overflow-y-auto px-6">
                    <div className="space-y-3 pb-6">
                      {attractions.map((attraction, index) => (
                        <motion.div
                          key={attraction.name}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="glass rounded-lg p-3 hover:bg-white/10 transition-colors cursor-pointer"
                        >
                          <div className="flex items-start space-x-3">
                            <div className="text-amber-400 mt-0.5">
                              {attraction.icon}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-medium text-white truncate">
                                {attraction.name}
                              </h4>
                              <div className="flex items-center justify-between mt-1">
                                <span className="text-xs text-amber-200">
                                  {attraction.distance}
                                </span>
                                <Badge
                                  variant="secondary"
                                  className="text-xs bg-amber-100/20 text-amber-200 border-amber-300/30"
                                >
                                  {attraction.category}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Directions Button */}
                  <div className="p-6 pt-4 border-t border-white/10 flex-shrink-0">
                    <Button
                      className="w-full bg-amber-700 hover:bg-amber-800 text-white"
                      onClick={() =>
                        window.open(
                          `https://www.google.com/maps/dir/?api=1&destination=${buildingLocation.lat},${buildingLocation.lng}`,
                          "_blank"
                        )
                      }
                    >
                      <Navigation2 className="mr-2 h-4 w-4" />
                      Get Directions
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
