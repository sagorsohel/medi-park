"use client";

export function ContactMapSection() {
  // Coordinates for Forest Hills, Queens, NY (based on the map image)
  const mapCenter = "40.7209,-73.8448"; // Forest Hills coordinates
  const mapEmbedUrl = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3024.5!2d-73.8448!3d40.7209!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDDCsDQzJzE1LjIiTiA3M8KwNTAnNDEuMyJX!5e0!3m2!1sen!2sus!4v1234567890123!5m2!1sen!2sus`;

  return (
    <div className="w-full bg-white py-16 md:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="w-full h-[500px] md:h-[600px] rounded-lg overflow-hidden shadow-lg">
          <iframe
            src={mapEmbedUrl}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Medipark Location"
            className="w-full h-full"
          />
        </div>
      </div>
    </div>
  );
}

