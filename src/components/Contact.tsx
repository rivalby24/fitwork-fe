import React, { useState } from "react";
import { Send } from "lucide-react";

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validasi sederhana
    const { name, email, subject, message } = formData;
    if (!name || !email || !subject || !message) {
      alert("Mohon lengkapi semua kolom sebelum mengirim pesan.");
      return;
    }

    const emailSubject = encodeURIComponent(subject || "Pesan dari Website");
    const emailBody = encodeURIComponent(
      `Nama: ${name}\n` +
        `Email: ${email}\n` +
        `Subjek: ${subject}\n\n` +
        `Pesan:\n${message}`
    );

    const mailtoLink = `mailto:marifatuambiya1604@gmail.com?subject=${emailSubject}&body=${emailBody}`;

    window.location.href = mailtoLink;

    // Reset form
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <section
      id="contact"
      className="py-16 px-4 bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold bg-blue-600 bg-clip-text text-transparent mb-4">
            Let’s Make It Happen!
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Have an interesting idea or project you'd like to discuss? I'm here
            to listen and help make it happen!
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white/80 backdrop-blur-sm p-8 md:p-10 rounded-2xl shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300">
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {/* Nama */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                placeholder="Enter your full name"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                placeholder="name@example.com"
                required
              />
            </div>
          </div>

          <div className="space-y-6">
            {/* Subjek */}
            <div>
              <label
                htmlFor="subject"
                className="block text-sm font-medium text-gray-700 mb-2">
                Subject
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                placeholder="Subject of your message"
                required
              />
            </div>

            {/* Pesan */}
            <div>
              <label
                htmlFor="message"
                className="block text-sm font-medium text-gray-700 mb-2">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                rows={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-none bg-gray-50 focus:bg-white"
                placeholder="Tell us about your project or idea..."
                required
              />
            </div>

            {/* Tombol Kirim */}
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <button
                type="submit"
                className="w-full sm:flex-1 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-lg hover:from-blue-700 hover:to-blue-700 transition-all duration-300 font-medium flex items-center justify-center space-x-2 transform hover:scale-105 shadow-lg hover:shadow-xl">
                <Send className="w-5 h-5" />
                <span>Send Message</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
};

export default ContactForm;
