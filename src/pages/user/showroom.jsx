import React from "react";

const ShowRoomPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 flex flex-col items-center justify-center p-6">
      {/* Header */}
      <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-8 tracking-tight">
        Vị trí cửa hàng
      </h1>

      {/* Map Section */}
      <div className="w-full max-w-5xl bg-white rounded-xl shadow-2xl overflow-hidden transform transition-all hover:shadow-3xl">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d642.3877296548736!2d105.73509584331575!3d21.053619249655743!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31345457e292d5bf%3A0x20ac91c94d74439a!2zVHLGsOG7nW5nIMSQ4bqhaS ho4buNYyBDw7RuZyBuZ2hp4buHcCBIw6AgTuG7mWk!5e1!3m2!1svi!2s!4v1748677106339!5m2!1svi!2s"
          className="w-full h-[450px] md:h-[500px] border-0"
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>

      {/* Info Section */}
      <div className="mt-8 text-center bg-white py-6 px-8 rounded-lg shadow-lg max-w-2xl">
        <div className="flex items-center justify-center mb-4">
          <svg
            className="w-6 h-6 text-blue-600 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            ></path>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            ></path>
          </svg>
          <p className="text-xl font-semibold text-gray-800">
            Số 298 Đ. Cầu Diễn, Minh Khai, Bắc Từ Liêm, Hà Nội, Việt Nam
          </p>
        </div>
        <div className="flex items-center justify-center mb-4">
          <svg
            className="w-6 h-6 text-blue-600 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
          <p className="text-lg text-gray-600">
            Mở cửa: Thứ 2 - Thứ 7, 7:30AM - 5PM
          </p>
        </div>

        {/* Button to Open Google Maps */}
        <a
          href="https://www.google.com/maps/dir/?api=1&destination=21.053728297584428,105.73511531802512"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-4 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-300"
        >
          Chỉ đường
        </a>
      </div>

      {/* Contact Info */}
      <div className="mt-6 text-center text-gray-500">
        <p>
          Liên hệ:{" "}
          <a href="tel:+8494105275" className="underline hover:text-blue-600">
            +84 23 123 4567
          </a>
        </p>
        <p>
          Email:{" "}
          <a
            href="mailto:nguyenhuydat201@gmail.com"
            className="underline hover:text-blue-600"
          >
            contact@showroom.vn
          </a>
        </p>
      </div>
    </div>
  );
};

export default ShowRoomPage;
