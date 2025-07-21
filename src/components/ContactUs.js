import React, { useState } from 'react';
import './ContactUs.css';

const ContactUs = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);
  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = e => {
    e.preventDefault();
    setSent(true);
    setForm({ name: '', email: '', message: '' });
    setTimeout(() => setSent(false), 3000);
  };
  return (
    <div className="contactus-container">
      <h2>Contact Us</h2>
      <form className="contactus-form" onSubmit={handleSubmit}>
        <input name="name" value={form.name} onChange={handleChange} placeholder="Your Name" required />
        <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="Your Email" required />
        <textarea name="message" value={form.message} onChange={handleChange} placeholder="Your Message" required />
        <button type="submit">Send</button>
        {sent && <div className="contactus-success">Message sent!</div>}
      </form>
    </div>
  );
};

export default ContactUs; 