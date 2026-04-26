"use client";

import Image from "next/image";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import {
  Building2,
  MapPin,
  Users,
  Phone,
  Mail,
  Navigation,
  Waves,
  Home,
  Shield,
  Star,
  MessageSquare,
  Bell,
  TrendingUp,
  FileText,
  X,
  Navigation2,
  Coffee,
  ShoppingBag,
  Plane,
  User,
  Globe,
  AlertTriangle,
  Printer,
  Menu,
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hasCelebrated, setHasCelebrated] = useState(false);
  const [sparkleParticles, setSparkleParticles] = useState<{ id: number; angle: number; delay: number; x: number; y: number }[]>([]);
  const documentsSectionRef = useRef<HTMLElement>(null);
  const documentsInView = useInView(documentsSectionRef, { once: true, amount: 0.2 });
  const [publicAnnouncements, setPublicAnnouncements] = useState<
    { id: string; title: string; content: string; date: string; type: string; updatedAt?: string }[]
  >([]);
  const [publicBoard, setPublicBoard] = useState<
    { id: string; name: string; position: string; email: string; phone?: string; initials?: string }[]
  >([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const [a, b] = await Promise.all([
        fetch("/api/public/announcements").then((r) => r.json()).catch(() => null),
        fetch("/api/public/board").then((r) => r.json()).catch(() => null),
      ]);
      if (cancelled) return;
      const announcements = Array.isArray(a?.items) ? a.items : [];
      const board = Array.isArray(b?.items) ? b.items : [];
      setPublicAnnouncements(
        announcements
          .slice()
          .sort((x: { updatedAt?: string }, y: { updatedAt?: string }) =>
            String(y.updatedAt ?? "").localeCompare(String(x.updatedAt ?? ""))
          )
          .slice(0, 6)
      );
      setPublicBoard(board);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!documentsInView || hasCelebrated) return;
    const id = requestAnimationFrame(() => {
      setHasCelebrated(true);
      const count = 36;
      const particles = Array.from({ length: count }, (_, i) => ({
        id: i,
        angle: (i / count) * 360 + Math.random() * 20,
        delay: Math.random() * 0.3,
        x: (Math.random() - 0.5) * 80,
        y: (Math.random() - 0.5) * 80,
      }));
      setSparkleParticles(particles);
    });
    const t = setTimeout(() => setSparkleParticles([]), 1800);
    return () => {
      cancelAnimationFrame(id);
      clearTimeout(t);
    };
  }, [documentsInView, hasCelebrated]);

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
              <span className="text-lg text-gray-800">
                <span className="font-bold">River Run</span> Condominium
              </span>
            </motion.div>
            <div className="hidden md:flex space-x-6">
              {[
                { name: "Home", href: "#home" },
                { name: "About", href: "#about" },
                { name: "Resources", href: "#documents" },
                { name: "Board", href: "#board" },
                { name: "Prop. Mgmt", href: "#property-management" },
                { name: "News", href: "#news" },
                { name: "Contact", href: "#contact" },
                { name: "Admin Portal", href: "/admin/login" },
              ].map((item) => (
                <motion.a
                  key={item.name}
                  href={item.href}
                  className="text-sm font-medium text-gray-700 hover:text-amber-700 transition-colors"
                  whileHover={{ scale: 1.05 }}
                >
                  {item.name}
                </motion.a>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-gray-700 hover:text-amber-700 hover:bg-white/10 transition-colors"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white/95 backdrop-blur-sm border-t border-white/20"
            >
              <div className="px-4 py-4 space-y-3">
                {[
                  { name: "Home", href: "#home" },
                  { name: "About", href: "#about" },
                  { name: "Resources", href: "#documents" },
                  { name: "Board", href: "#board" },
                  { name: "Property Management", href: "#property-management" },
                  { name: "News", href: "#news" },
                  { name: "Contact", href: "#contact" },
                  { name: "Admin Portal", href: "/admin/login" },
                ].map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block py-2 text-sm font-medium text-gray-700 hover:text-amber-700 transition-colors"
                  >
                    {item.name}
                  </a>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Hero Section */}
      <section
        id="home"
        className="relative min-h-screen sm:min-h-screen md:min-h-screen lg:min-h-screen flex items-center justify-center overflow-hidden pt-16"
      >
        {/* Hero Background Image */}
        <div className="absolute inset-0">
          <div className="relative w-full h-full">
            <Image
              src="/images/building.jpg"
              alt="River Run Condominium Building"
              fill
              className="object-cover object-center"
              sizes="100vw"
              priority
            />
          </div>
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

            <div className="mb-6">
              <motion.h1
                className="text-5xl md:text-7xl font-extrabold text-white mb-2 tracking-tight"
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
              <motion.h2
                className="text-2xl md:text-4xl font-normal text-amber-200 tracking-wide"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                style={{
                  textShadow: "0 2px 15px rgba(0, 0, 0, 0.4)",
                  letterSpacing: "0.1em",
                }}
              >
                Condominium
              </motion.h2>
            </div>

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
                  "Stunning side view showcasing the building's design",
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
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      sizes="(max-width: 768px) 100vw, 33vw"
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
      <section className="relative py-12 sm:py-16 md:py-20 overflow-hidden">
        <div className="absolute inset-0">
          <div className="relative w-full h-full">
            <Image
              src="/images/bird-eye.jpg"
              alt="Aerial View of River Run Condominium"
              fill
              className="object-cover object-center parallax"
              sizes="100vw"
            />
          </div>
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

      {/* Recent Announcements */}
      <section className="py-16 bg-gradient-to-r from-amber-50 to-amber-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Recent Announcements */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              Recent Announcements
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(publicAnnouncements.length ? publicAnnouncements : [
                {
                  id: "fallback-1",
                  title: "HOA Meeting — March 5, 2026",
                  content:
                    "The Board held a meeting on March 5, 2026, to discuss the additional funds necessary for the 40-year recertification and to hear residents' concerns. The HOA is actively working to address that feedback and has launched this website to keep you informed on current events, upcoming projects, and association documents. Stay connected with your neighbors: the HOA has created a dedicated River Run Condominium group on Nextdoor—join the app and the group to participate in the community conversation.",
                  date: "March 5, 2026",
                  type: "Meeting",
                },
              ]).map((announcement, index) => (
                <motion.div
                  key={announcement.id ?? announcement.title}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="glass border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-full">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between mb-3">
                        <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                          {(announcement.type === "Meeting" && (
                            <Users className="h-5 w-5 text-amber-600" />
                          )) ||
                            (announcement.type === "Property" && (
                              <Home className="h-5 w-5 text-amber-600" />
                            )) || <FileText className="h-5 w-5 text-amber-600" />}
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

      {/* Association Resources */}
      <section ref={documentsSectionRef} id="documents" className="relative py-16 bg-white/30 overflow-hidden">
        {/* Sparkle celebration when section comes into view */}
        <AnimatePresence>
          {sparkleParticles.length > 0 && (
            <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
              {sparkleParticles.map((p) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                  animate={{
                    opacity: [0, 1, 0],
                    scale: [0, 1.2, 0.5],
                    x: Math.cos((p.angle * Math.PI) / 180) * 120 + p.x,
                    y: Math.sin((p.angle * Math.PI) / 180) * 120 + p.y,
                  }}
                  transition={{
                    duration: 1.2,
                    delay: p.delay,
                    ease: "easeOut",
                  }}
                  className="absolute h-2 w-2 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.8)]"
                  style={{ willChange: "transform, opacity" }}
                />
              ))}
            </div>
          )}
        </AnimatePresence>
        <div className="relative z-0 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Association Resources
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Key documents organized by category. Click a card to open the folder.
            </p>
          </motion.div>

          {(() => {
            const docs = [
              {
                title: "Wind Mitigation + Elevation Certificate + Appraisal",
                description: "Wind mitigation report, elevation certificate, and property appraisal documentation.",
                href: "https://drive.google.com/drive/folders/1W9_ON8-bI3b-9kbNUo_hHjcrDHyCfAhU?usp=drive_link",
                icon: Shield,
              },
              {
                title: "Insurance",
                description: "Contractor and RRCA insurance documentation.",
                href: "https://drive.google.com/drive/folders/11hzoujLb4_7uiLEFXaKAtbXBE6p3A4rb?usp=drive_link",
                icon: Shield,
              },
              {
                title: "40 Year Recertification Docs",
                description: "Engineering reports, SIRS, permits, and recertification documentation.",
                href: "https://drive.google.com/drive/folders/1KerWSWmxkmBOWe4TRvowKY5XmxD7MFux?usp=drive_link",
                icon: Building2,
              },
              {
                title: "Rules",
                description: "Governing documents, declaration, EV charging policy, and association rules.",
                href: "https://drive.google.com/drive/folders/1EmHTGAipH8lAFi6eCXxeuW1OuCNaL7y9?usp=sharing",
                icon: FileText,
              },
              {
                title: "Financials",
                description: "Association financial reports and budgets.",
                href: "https://drive.google.com/drive/folders/1Jx6VI6MurVf1PusP-gRLhrc-UqRY6814?usp=sharing",
                icon: TrendingUp,
              },
              {
                title: "Contractor Photos & Videos",
                description: "Pictures and videos of work completed by the contractor for the 40-year recertification and related projects.",
                href: "https://www.dropbox.com/scl/fo/70pifcqy682n50silkh9p/AEtro_yWkm_mLOViT_LLAtk?rlkey=0o7fs1aot0nvdqmw44kkb6m15&st=wtr6ebcv&dl=0",
                icon: Building2,
              },
            ];
            const DocCard = ({ doc, index }: { doc: (typeof docs)[0]; index: number }) => {
              const DocIcon = doc.icon;
              return (
                <motion.a
                  href={doc.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="block h-full min-h-0 w-full min-w-0"
                >
                  <Card className="glass border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-full group cursor-pointer flex flex-col">
                    <CardHeader className="pb-3 flex-1 flex flex-col">
                      <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center mb-3 group-hover:bg-amber-200 transition-colors shrink-0">
                        <DocIcon className="h-5 w-5 text-amber-700" />
                      </div>
                      <CardTitle className="text-xl text-gray-800 group-hover:text-amber-700 transition-colors">
                        {doc.title}
                      </CardTitle>
                      <CardDescription className="text-sm flex-1">
                        {doc.description}
                      </CardDescription>
                      <span className="text-amber-600 text-sm font-medium mt-2 inline-flex items-center gap-1 shrink-0">
                        Open folder
                        <FileText className="h-4 w-4" />
                      </span>
                    </CardHeader>
                  </Card>
                </motion.a>
              );
            };
            return (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 [grid-auto-rows:1fr]">
                {docs.map((doc, i) => (
                  <DocCard key={doc.title} doc={doc} index={i} />
                ))}
              </div>
            );
          })()}
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

          <div className="relative">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(publicBoard.length
                ? publicBoard
                : [
                    {
                      id: "fallback-sj",
                      name: "Board Updates Coming Soon",
                      position: "Board of Directors",
                      email: "rrcboardemail@gmail.com",
                      phone: "",
                      initials: "RR",
                    },
                  ]
              ).map((member, index) => (
                <motion.div
                  key={member.id ?? member.email ?? member.name}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="glass border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-full">
                    <CardHeader className="text-center pb-3">
                      <Avatar className="w-16 h-16 mx-auto mb-3">
                        <AvatarImage src="" />
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
                      {member.phone ? (
                        <div className="flex items-center space-x-2 text-xs text-gray-600">
                          <Phone className="h-3 w-3" />
                          <span>{member.phone}</span>
                        </div>
                      ) : null}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
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
        </div>
      </section>

      {/* Property Management Section */}
      <section id="property-management" className="py-16 bg-white/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Property Management
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Emergency contacts and property management services for River Run
              Condominium
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Elizabeth Perez Garcia Card */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <Card className="bg-white/95 backdrop-blur-sm border border-amber-200/50 shadow-xl rounded-2xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 h-full">
                <CardHeader className="text-center pb-3">
                  <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Building2 className="h-10 w-10 text-white" />
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-800 mb-2">
                    Caribbean Property Management Inc.
                  </CardTitle>
                  <CardDescription className="text-amber-700 font-semibold text-lg">
                    Elizabeth Perez Garcia
                    <br />
                    Contact
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-600 text-center mb-6">
                    Primary contact for property management services and general
                    inquiries.
                  </p>

                  <div className="space-y-4">
                    {/* Elizabeth Contact */}
                    <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                      <div className="flex items-center space-x-3 mb-3">
                        <User className="h-5 w-5 text-amber-600" />
                        <div>
                          <p className="text-sm font-semibold text-gray-800">
                            Elizabeth Perez Garcia
                          </p>
                          <p className="text-gray-600 text-xs">
                            Primary Contact
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <Mail className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <a
                            href="mailto:efperezgarcia@caribbeanproperty.cc"
                            className="text-gray-800 hover:text-amber-600 font-semibold text-sm break-all"
                          >
                            efperezgarcia@caribbeanproperty.cc
                          </a>
                        </div>
                      </div>
                    </div>

                    {/* General Office Info */}
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <MapPin className="h-4 w-4 text-amber-600" />
                        <div className="flex-1">
                          <p className="text-sm text-gray-600">
                            Office Address
                          </p>
                          <p className="text-gray-800 text-sm">
                            12301 SW 132 Court
                            <br />
                            Miami, FL 33186
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <Phone className="h-4 w-4 text-amber-600" />
                        <div className="flex-1">
                          <p className="text-sm text-gray-600">General Phone</p>
                          <a
                            href="tel:305-251-3848"
                            className="text-gray-800 hover:text-amber-600 font-semibold"
                          >
                            305-251-3848
                          </a>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <Printer className="h-4 w-4 text-amber-600" />
                        <div className="flex-1">
                          <p className="text-sm text-gray-600">Fax</p>
                          <p className="text-gray-800 font-semibold">
                            305-251-3849
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3">
                        <Mail className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-600">General Email</p>
                          <a
                            href="mailto:info@caribbeanproperty.cc"
                            className="text-gray-800 hover:text-amber-600 font-semibold text-sm break-all"
                          >
                            info@caribbeanproperty.cc
                          </a>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4">
                      <a
                        href="http://www.caribbeanproperty.cc"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full inline-flex items-center justify-center bg-gradient-to-r from-amber-500 to-amber-600 text-white px-4 py-2 rounded-lg font-semibold hover:from-amber-600 hover:to-amber-700 transition-all duration-300 shadow-lg hover:shadow-xl text-sm"
                      >
                        <Globe className="h-4 w-4 mr-2" />
                        Visit Website
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Juan & General Info Card */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <Card className="bg-white/95 backdrop-blur-sm border border-amber-200/50 shadow-xl rounded-2xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 h-full">
                <CardHeader className="text-center pb-3">
                  <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Building2 className="h-10 w-10 text-white" />
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-800 mb-2">
                    Caribbean Property Management Inc.
                  </CardTitle>
                  <CardDescription className="text-amber-700 font-semibold text-lg">
                    General Information
                    <br />
                    Contact
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-600 text-center mb-6">
                    General office information and secondary contact for
                    property management services.
                  </p>

                  <div className="space-y-4">
                    {/* Juan Contact */}
                    <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                      <div className="flex items-center space-x-3 mb-3">
                        <User className="h-5 w-5 text-amber-600" />
                        <div>
                          <p className="text-sm font-semibold text-gray-800">
                            Juan
                          </p>
                          <p className="text-gray-600 text-xs">
                            Secondary Contact
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <Mail className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <a
                            href="mailto:juan@caribbeanproperty.cc"
                            className="text-gray-800 hover:text-amber-600 font-semibold text-sm break-all"
                          >
                            juan@caribbeanproperty.cc
                          </a>
                        </div>
                      </div>
                    </div>

                    {/* General Office Info */}
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <MapPin className="h-4 w-4 text-amber-600" />
                        <div className="flex-1">
                          <p className="text-sm text-gray-600">
                            Office Address
                          </p>
                          <p className="text-gray-800 text-sm">
                            12301 SW 132 Court
                            <br />
                            Miami, FL 33186
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <Phone className="h-4 w-4 text-amber-600" />
                        <div className="flex-1">
                          <p className="text-sm text-gray-600">General Phone</p>
                          <a
                            href="tel:305-251-3848"
                            className="text-gray-800 hover:text-amber-600 font-semibold"
                          >
                            305-251-3848
                          </a>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <Printer className="h-4 w-4 text-amber-600" />
                        <div className="flex-1">
                          <p className="text-sm text-gray-600">Fax</p>
                          <p className="text-gray-800 font-semibold">
                            305-251-3849
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3">
                        <Mail className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-600">General Email</p>
                          <a
                            href="mailto:info@caribbeanproperty.cc"
                            className="text-gray-800 hover:text-amber-600 font-semibold text-sm break-all"
                          >
                            info@caribbeanproperty.cc
                          </a>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4">
                      <a
                        href="http://www.caribbeanproperty.cc"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full inline-flex items-center justify-center bg-gradient-to-r from-amber-500 to-amber-600 text-white px-4 py-2 rounded-lg font-semibold hover:from-amber-600 hover:to-amber-700 transition-all duration-300 shadow-lg hover:shadow-xl text-sm"
                      >
                        <Globe className="h-4 w-4 mr-2" />
                        Visit Website
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Emergency & Maintenance Contact Card */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <Card className="bg-white/95 backdrop-blur-sm border border-amber-200/50 shadow-xl rounded-2xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 h-full">
                <CardHeader className="text-center pb-3">
                  <div className="w-20 h-20 bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <AlertTriangle className="h-10 w-10 text-white" />
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-800 mb-2">
                    Emergency & Maintenance
                  </CardTitle>
                  <CardDescription className="text-red-700 font-semibold text-lg">
                    Urgent Contact Information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-600 text-center mb-6">
                    For emergency situations and urgent maintenance issues.
                  </p>

                  <div className="space-y-4">
                    <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                      <div className="flex items-center space-x-3 mb-2">
                        <Phone className="h-5 w-5 text-red-600" />
                        <div>
                          <p className="text-sm font-semibold text-gray-800">
                            Emergency Line
                          </p>
                          <a
                            href="tel:305-251-3848"
                            className="text-red-700 hover:text-red-800 font-bold text-lg"
                          >
                            305.251.3848
                          </a>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                      <div className="flex items-center space-x-3">
                        <User className="h-5 w-5 text-amber-600" />
                        <div>
                          <p className="text-sm font-semibold text-gray-800">
                            On-Site Maintenance
                          </p>
                          <p className="text-gray-700 font-semibold">German</p>
                          <a
                            href="tel:786-344-3706"
                            className="text-amber-700 hover:text-amber-800 font-bold"
                          >
                            786.344.3706
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-start space-x-3">
                      <AlertTriangle className="h-5 w-5 text-gray-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-gray-800 font-semibold text-sm mb-1">
                          When to Use Emergency Contacts
                        </p>
                        <p className="text-gray-600 text-xs">
                          Use the emergency line for urgent maintenance issues,
                          security concerns, or emergency situations that
                          require immediate attention. Available 24/7.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
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
                <Image
                  src="/images/side-view.jpg"
                  alt="Side View of River Run Condominium"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
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
          <div className="relative w-full h-full">
            <Image
              src="/images/back-view.jpg"
              alt="Back View of River Run Condominium"
              fill
              className="object-cover opacity-20"
              sizes="100vw"
            />
          </div>
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
                <a
                  href="#property-management"
                  className="block text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Property Management
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
