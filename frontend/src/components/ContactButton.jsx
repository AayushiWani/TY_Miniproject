import React from "react";

const ContactButton = ({ email, className }) => {
  if (!email) return null;

  return (
    <a 
      href={`mailto:${email}`}
      className={`inline-block bg-[#7209b7] hover:bg-[#5f32ad] text-white py-1 px-3 rounded ${className || ""}`}
    >
      Contact
    </a>
  );
};

export default ContactButton;