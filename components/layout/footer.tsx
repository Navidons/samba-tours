import Link from "next/link"
import { Facebook, Instagram, Twitter, Youtube, Phone, Mail, MapPin } from "lucide-react"

const footerLinks = {
  quickLinks: [
    { name: "Home", href: "/" },
    { name: "About Us", href: "/about" },
    { name: "Contact Us", href: "/contact" },
    { name: "Our Team", href: "/about#team" },
  ],
  tours: [
    { name: "Safari Tours", href: "/tours?category=safari" },
    { name: "Cultural Tours", href: "/tours?category=cultural" },
    { name: "Adventure Tours", href: "/tours?category=adventure" },
    { name: "Custom Tours", href: "/tours" },
  ],
  support: [
    { name: "FAQs", href: "/faqs" },
    { name: "Travel Tips", href: "/blog/category/travel-tips" },
    { name: "Careers", href: "/careers" },
    { name: "Booking Terms", href: "/terms" },
  ],
}

const socialLinks = [
  { name: "Facebook", icon: Facebook, href: "https://facebook.com/sambatours" },
  { name: "Instagram", icon: Instagram, href: "https://instagram.com/sambatours" },
  { name: "Twitter", icon: Twitter, href: "https://twitter.com/sambatours" },
  { name: "YouTube", icon: Youtube, href: "https://youtube.com/sambatours" },
]

export default function Footer() {
  return (
    <footer className="bg-earth-900 text-white">
      <div className="container-max px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-forest-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xl">ST</span>
              </div>
              <div>
                <h3 className="font-playfair text-2xl font-bold">Samba Tours</h3>
                <p className="text-sm text-gray-300">& Travel</p>
              </div>
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Discover the beauty of Uganda and East Africa with our expertly crafted tours. We create unforgettable
              experiences that connect you with nature, culture, and adventure.
            </p>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-forest-400" />
                <span>+256 700 123 456</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-forest-400" />
                <span>info@sambatours.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-forest-400" />
                <span>Kampala, Uganda</span>
              </div>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {footerLinks.quickLinks.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-gray-300 hover:text-forest-400 transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-lg mb-4">Tours & Services</h4>
            <ul className="space-y-2">
              {footerLinks.tours.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-gray-300 hover:text-forest-400 transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-lg mb-4">Support & Resources</h4>
            <ul className="space-y-2">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-gray-300 hover:text-forest-400 transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Social Links & Copyright */}
        <div className="border-t border-gray-700 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex space-x-6 mb-4 md:mb-0">
              {socialLinks.map((social) => (
                <Link
                  key={social.name}
                  href={social.href}
                  className="text-gray-400 hover:text-forest-400 transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <social.icon className="h-6 w-6" />
                </Link>
              ))}
            </div>
            <div className="text-center md:text-right text-gray-400 text-sm">
              <p>&copy; 2024 Samba Tours & Travel. All rights reserved.</p>
              <div className="flex space-x-4 mt-2">
                <Link href="/privacy" className="hover:text-forest-400 transition-colors">
                  Privacy Policy
                </Link>
                <Link href="/terms" className="hover:text-forest-400 transition-colors">
                  Terms of Service
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
