import React, { useState } from 'react';
// Copied Form data from Week 3 covernerted to REACT
export default function Contact() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: ''
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  // MOCk Email sent 
    console.log("Thank you, your message has been sent. We will be in touch shortly. Thank you for visiting MovMania.");
    console.log("Submitted Data:", formData);

    setSubmitted(true); // Mock trigger success message Updated
    setFormData({ firstName: '', lastName: '', email: '' }); // reset form
  };

  return (
    <div className="container mt-4">
      <h2>Contact</h2>
      <p>Email: contact@example.com</p>
      <p>
        Twitter:{' '}
        <a href="https://twitter.com/yourhandle" target="_blank" rel="noopener noreferrer">
          @yourhandle
        </a>
      </p>

      {submitted && (
        <div className="alert alert-success mt-4" role="alert">
          Thank you! Your message has been sent. We will be in touch shortly. Thank you for visiting <strong>MovMania</strong>.
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-4">
        <div className="mb-3">
          <label htmlFor="firstName" className="form-label">First Name</label>
          <input
            type="text"
            className="form-control"
            id="firstName"
            name="firstName"
            placeholder="Professor"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="lastName" className="form-label">Last Name</label>
          <input
            type="text"
            className="form-control"
            id="lastName"
            name="lastName"
            placeholder="Falken"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            id="email"
            name="email"
            placeholder="bill.gates@aol.com"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary">Submit</button>
      </form>
    </div>
  );
}
