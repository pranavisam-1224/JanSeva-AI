import React, { useState } from 'react';
import './App.css';

type Complaint = {
  id: string;
  name: string;
  email: string;
  location: string;
  category: string;
  description: string;
  priority: string;
  status: string;
  date: string;
};

function App() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [success, setSuccess] = useState('');
  const [complaintId, setComplaintId] = useState('');

  const [trackingId, setTrackingId] = useState('');
  const [trackingResult, setTrackingResult] = useState<Complaint | null>(null);
  const [trackingError, setTrackingError] = useState('');
  const [adminComplaints, setAdminComplaints] = useState<Complaint[]>([]);
  const [adminFilter, setAdminFilter] = useState('All');

  const loadAdminComplaints = () => {
    const saved: Complaint[] = JSON.parse(
      localStorage.getItem('janseva_complaints') || '[]'
    );
    console.log('Saved complaints:', saved);
    setAdminComplaints(saved);
  };

  const updateComplaintStatus = (id: string, status: string) => {
    const updated = adminComplaints.map((complaint) =>
      complaint.id === id ? { ...complaint, status } : complaint
    );

    localStorage.setItem('janseva_complaints', JSON.stringify(updated));

    setAdminComplaints(updated);
  };

  const classifyComplaint = (text: string) => {
    const issue = text.toLowerCase();

    if (/water|supply|leak|pipe/.test(issue)) return 'Water';
    if (/electricity|power|current|streetlight/.test(issue))
      return 'Electricity';
    if (/garbage|waste|sanitation|clean/.test(issue)) return 'Sanitation';
    if (/drain|sewage|sewer/.test(issue)) return 'Drainage';
    if (/road|pothole|street|bridge/.test(issue)) return 'Roads';

    return 'Other';
  };
  const detectPriority = (text: string) => {
    const issue = text.toLowerCase();
  
    if (/emergency|flood|flooding|fire|danger|accident|major leak|overflow/.test(issue)) {
      return 'High';
    }
  
    if (/streetlight|garbage|waste|water supply|pothole|drain/.test(issue)) {
      return 'Medium';
    }
  
    return 'Low';
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const detectedCategory = classifyComplaint(description + ' ' + category);

    const id = 'JSAI-' + Date.now().toString().slice(-8);

    const complaint: Complaint = {
      id,
      name,
      email,
      location,
      category: detectedCategory,
      description,
      priority: detectPriority(description),
      status: 'Pending',
      date: new Date().toLocaleString(),
    };

    const existing: Complaint[] = JSON.parse(
      localStorage.getItem('janseva_complaints') || '[]'
    );

    localStorage.setItem(
      'janseva_complaints',
      JSON.stringify([complaint, ...existing])
    );

    setComplaintId(id);
    setSuccess('Your grievance has been registered successfully!');

    setName('');
    setEmail('');
    setLocation('');
    setCategory('');
    setDescription('');
    setTrackingResult(null);
  };

  const handleTracking = () => {
    const complaints: Complaint[] = JSON.parse(
      localStorage.getItem('janseva_complaints') || '[]'
    );

    const result = complaints.find(
      (item) => item.id.toLowerCase() === trackingId.trim().toLowerCase()
    );

    setTrackingResult(result || null);
    setTrackingError(
      result ? '' : 'Complaint ID not found. Please check your ID.'
    );
  };

  return (
    <div className="app">
      <nav className="navbar">
        <h2>🏛️ JanSeva AI</h2>
        <div className="nav-links">
          <a href="#home">Home</a>
          <a href="#features">Features</a>
          <a href="#complaint">Register</a>
          <a href="#tracking">Track</a>
        </div>
        <a href="#admin" className="login-btn">
          Admin
        </a>
      </nav>

      <section className="hero" id="home">
        <div className="hero-content">
          <span className="tag">AI POWERED PUBLIC SERVICE</span>
          <h1>
            Your Voice Matters.
            <br />
            <span>We Make It Heard.</span>
          </h1>
          <p>
            Report public issues easily, track your complaints, and help build a
            better community with JanSeva AI.
          </p>
          <div className="hero-buttons">
            <button
              onClick={() =>
                document.getElementById('complaint')?.scrollIntoView({
                  behavior: 'smooth',
                })
              }
            >
              Submit a Complaint →
            </button>
            <button
              className="secondary"
              onClick={() =>
                document.getElementById('tracking')?.scrollIntoView({
                  behavior: 'smooth',
                })
              }
            >
              Track Complaint
            </button>
          </div>
        </div>
        <div className="hero-icon">🏛️</div>
      </section>

      <section className="features" id="features">
        <h2>How JanSeva AI Helps You</h2>
        <p>Simple, transparent and accessible public grievance management.</p>
        <div className="cards">
          <div className="card">
            <div>📝</div>
            <h3>Easy Complaints</h3>
            <p>Submit public issues through a simple online form.</p>
          </div>
          <div className="card">
            <div>🤖</div>
            <h3>Smart Categorization</h3>
            <p>Automatically identify the relevant complaint category.</p>
          </div>
          <div className="card">
            <div>📍</div>
            <h3>Complaint Tracking</h3>
            <p>Check complaint progress using your tracking ID.</p>
          </div>
        </div>
      </section>

      <section className="complaint-section" id="complaint">
        <div className="form-container">
          <h2>Register a Grievance</h2>
          <p>Tell us about the public issue you want to report.</p>

          {success && (
            <div className="success-message">
              <h3>✓ Complaint Registered!</h3>
              <p>{success}</p>
              <strong>Your Complaint ID: {complaintId}</strong>
              <p>Please save this ID to track your complaint.</p>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <label>Full Name</label>
            <input
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <label>Email Address</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <label>Location</label>
            <input
              type="text"
              placeholder="Enter your area or city"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />

            <label>Complaint Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              <option value="">Select a department</option>
              <option value="Roads">Roads</option>
              <option value="Water">Water Supply</option>
              <option value="Electricity">Electricity</option>
              <option value="Sanitation">Sanitation</option>
              <option value="Drainage">Drainage</option>
              <option value="Other">Other</option>
            </select>

            <label>Complaint Description</label>
            <textarea
              placeholder="Describe your public issue..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
              required
            />

            <button type="submit" className="submit-btn">
              Submit Grievance
            </button>
          </form>
        </div>
      </section>

      <section className="tracking" id="tracking">
        <h2>Track Your Complaint</h2>
        <p>Enter your complaint ID to check its current status.</p>

        <div className="tracking-controls">
          <input
            placeholder="Example: JSAI-12345678"
            value={trackingId}
            onChange={(e) => setTrackingId(e.target.value)}
          />
          <button onClick={handleTracking}>Track Now</button>
        </div>

        {trackingError && <p className="error-message">{trackingError}</p>}

        {trackingResult && (
          <div className="tracking-result">
            <h3>Complaint Details</h3>
            <p>
              <strong>ID:</strong> {trackingResult.id}
            </p>
            <p>
              <strong>Category:</strong> {trackingResult.category}
            </p>
            <p>
  <strong>Priority:</strong>{' '}
  {trackingResult.priority || 'Not assigned'}
</p>
            <p>
              <strong>Location:</strong> {trackingResult.location}
            </p>
            <p>
              <strong>Status:</strong> {trackingResult.status}
            </p>
            <p>
              <strong>Date:</strong> {trackingResult.date}
            </p>
          </div>
        )}
      </section>
      <section className="admin-section" id="admin">
  <div className="admin-container">
    <div className="admin-heading">
      <div>
        <span className="tag">ADMINISTRATION</span>
        <h2>Grievance Management Dashboard</h2>
        <p>Monitor and manage citizen complaints.</p>
      </div>

      <button onClick={loadAdminComplaints}>
        Refresh Complaints ↻
      </button>
    </div>

    <div className="complaint-list">
      <h3>All Registered Complaints</h3>

      {adminComplaints.map((complaint) => (
        <div className="admin-complaint" key={complaint.id}>
          <h4>{complaint.category} Complaint</h4>
          <p><strong>ID:</strong> {complaint.id}</p>
          <p><strong>Citizen:</strong> {complaint.name}</p>
          <p><strong>Location:</strong> {complaint.location}</p>
          <p><strong>Description:</strong> {complaint.description}</p>
          <p>
  <strong>Priority:</strong>{' '}
  <span className={`priority-${complaint.priority.toLowerCase()}`}>
    {complaint.priority}
  </span>
</p>

          <label>Update Status:</label>
          <select
            value={complaint.status}
            onChange={(e) =>
              updateComplaintStatus(complaint.id, e.target.value)
            }
          >
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
          </select>
        </div>
      ))}

      {adminComplaints.length === 0 && (
        <p>No complaints found. Click Refresh Complaints.</p>
      )}
    </div>
  </div>
</section>

      <footer id="admin">
        <section className="admin-section" id="admin">
          <div className="admin-container">
            <div className="admin-heading">
              <div>
                <span className="tag">ADMINISTRATION</span>
                <h2>Grievance Management Dashboard</h2>
                <p>Monitor and manage citizen complaints.</p>
              </div>
              <button onClick={loadAdminComplaints}>
                Refresh Complaints ↻
              </button>
            </div>

            <div className="admin-stats">
              <div className="stat-card">
                <span>Total Complaints</span>
                <h2>{adminComplaints.length}</h2>
              </div>

              <div className="stat-card">
                <span>Pending</span>
                <h2>
                  {adminComplaints.filter((c) => c.status === 'Pending').length}
                </h2>
              </div>

              <div className="stat-card">
                <span>In Progress</span>
                <h2>
                  {
                    adminComplaints.filter((c) => c.status === 'In Progress')
                      .length
                  }
                </h2>
              </div>

              <div className="stat-card">
                <span>Resolved</span>
                <h2>
                  {
                    adminComplaints.filter((c) => c.status === 'Resolved')
                      .length
                  }
                </h2>
              </div>
            </div>

            <div className="complaint-list">
              <div className="list-heading">
                <h3>All Registered Complaints</h3>

                <select
                  value={adminFilter}
                  onChange={(e) => setAdminFilter(e.target.value)}
                >
                  <option value="All">All Complaints</option>
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                </select>
              </div>

              {adminComplaints
                .filter(
                  (c) => adminFilter === 'All' || c.status === adminFilter
                )
                .map((complaint) => (
                  <div className="admin-complaint" key={complaint.id}>
                    <div className="complaint-details">
                      <h4>{complaint.category} Complaint</h4>
                      <p>
                        <strong>ID:</strong> {complaint.id}
                      </p>
                      <p>
                        <strong>Citizen:</strong> {complaint.name}
                      </p>
                      <p>
                        <strong>Location:</strong> {complaint.location}
                      </p>
                      <p>
                        <strong>Description:</strong> {complaint.description}
                      </p>
                      <p>
                        <strong>Date:</strong> {complaint.date}
                      </p>
                    </div>

                    <div className="status-control">
                      <label>Update Status</label>
                      <select
                        value={complaint.status}
                        onChange={(e) =>
                          updateComplaintStatus(complaint.id, e.target.value)
                        }
                      >
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Resolved">Resolved</option>
                      </select>
                    </div>
                  </div>
                ))}

              {adminComplaints.length === 0 && (
                <p className="empty-message">
                  No complaints found. Register a complaint to see it here.
                </p>
              )}

              {adminComplaints.length > 0 &&
                adminComplaints.filter(
                  (c) => adminFilter === 'All' || c.status === adminFilter
                ).length === 0 && (
                  <p className="empty-message">
                    No complaints in this category.
                  </p>
                )}
            </div>
          </div>
        </section>

        <h3>🏛️ JanSeva AI</h3>
        <p>Making public grievance management smarter and simpler.</p>
        <small>© 2026 JanSeva AI | Hackathon Project</small>
      </footer>
    </div>
  );
}

export default App;
